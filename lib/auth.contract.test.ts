import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { authorizeDealAccess, requireRole, VERA_SECRET_HEADER } from "@/lib/auth";
import type { Database } from "@/lib/db/client";
import { schema } from "@/lib/db/schema";
import { PostgresDealStore } from "@/lib/deals-postgres";
import {
  BUYER_TOKEN_TTL_MS,
  InMemoryTokenStore,
  PostgresTokenStore,
  tokenStore,
  type TokenStore,
} from "@/lib/tokens";
import type { Party, PartyRole } from "@/types/deal";

const MIGRATIONS_DIR = path.join(process.cwd(), "lib/db/migrations");
const pglite = new PGlite();
const pgDb = drizzle(pglite, { schema }) as unknown as Database;

async function applyMigrations() {
  for (const file of readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort()) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    for (const statement of sql.split("--> statement-breakpoint")) {
      const trimmed = statement.trim();
      if (trimmed) await pglite.exec(trimmed);
    }
  }
}

function makeParty(role: PartyRole, firstName: string): Party {
  return { id: randomUUID(), role, firstName, identityVerified: false };
}

await applyMigrations();

/**
 * The Postgres token store has real foreign keys to parties and deals, so a
 * token cannot be issued for a party that does not exist. Each case therefore
 * seeds a genuine deal first — which is itself worth asserting.
 */
async function seedPartyIds() {
  const store = new PostgresDealStore(pgDb);
  const deal = await store.create({
    buyer: makeParty("BUYER", "Ada"),
    seller: makeParty("SELLER", "Grace"),
    terms: { item: "Leica M6", quantity: 1, amountMinor: 250_000, currency: "USD" },
  });
  return { dealId: deal.id, partyId: deal.buyer.id };
}

const implementations: Array<
  [string, () => Promise<{ store: TokenStore; dealId: string; partyId: string }>]
> = [
  [
    "InMemoryTokenStore",
    async () => ({
      store: new InMemoryTokenStore(),
      dealId: randomUUID(),
      partyId: randomUUID(),
    }),
  ],
  [
    "PostgresTokenStore",
    async () => {
      await pglite.exec(
        "TRUNCATE TABLE deal_access_tokens, parties, deals CASCADE;",
      );
      const ids = await seedPartyIds();
      return { store: new PostgresTokenStore(pgDb), ...ids };
    },
  ],
];

describe.each(implementations)("TokenStore contract: %s", (_name, build) => {
  let store: TokenStore;
  let dealId: string;
  let partyId: string;

  beforeEach(async () => {
    ({ store, dealId, partyId } = await build());
  });

  it("issues an opaque token with a future expiry", async () => {
    const issued = await store.issue({
      partyId,
      dealId,
      role: "BUYER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });

    expect(issued.token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(new Date(issued.expiresAt).getTime()).toBeGreaterThan(Date.now());
    // The token must not be derived from anything guessable about the deal.
    expect(issued.token).not.toContain(dealId);
  });

  it("verifies a token back to its party, deal and role", async () => {
    const issued = await store.issue({
      partyId,
      dealId,
      role: "BUYER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });

    const record = await store.verify(issued.token);

    expect(record).toMatchObject({ partyId, dealId, role: "BUYER" });
    expect(record?.revokedAt).toBeUndefined();
  });

  it("returns null for a token that was never issued", async () => {
    expect(await store.verify("not-a-real-token")).toBeNull();
  });

  it("marks a revoked token, so a leaked link can be killed", async () => {
    const issued = await store.issue({
      partyId,
      dealId,
      role: "BUYER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });

    await store.revoke(issued.token);

    const record = await store.verify(issued.token);
    expect(record?.revokedAt).toBeDefined();
  });

  it("never issues the same token twice", async () => {
    const a = await store.issue({
      partyId,
      dealId,
      role: "BUYER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });
    const b = await store.issue({
      partyId,
      dealId,
      role: "BUYER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });

    expect(a.token).not.toBe(b.token);
  });

  it("finds the active token for a party", async () => {
    const issued = await store.issue({
      partyId,
      dealId,
      role: "SELLER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });

    const found = await store.activeFor(partyId);

    expect(found?.token).toBe(issued.token);
  });

  it("returns no active token once it is revoked", async () => {
    const issued = await store.issue({
      partyId,
      dealId,
      role: "SELLER",
      ttlMs: BUYER_TOKEN_TTL_MS,
    });
    await store.revoke(issued.token);

    expect(await store.activeFor(partyId)).toBeNull();
  });

  it("ignores an expired token when looking for an active one", async () => {
    await store.issue({ partyId, dealId, role: "SELLER", ttlMs: -1_000 });

    expect(await store.activeFor(partyId)).toBeNull();
  });

  it("returns null for a party with no tokens", async () => {
    expect(await store.activeFor(randomUUID())).toBeNull();
  });
});

/** Role gate — the token binds you to a deal, requireRole binds you to an action. */
describe("requireRole", () => {
  it("lets the matching party through", () => {
    const result = requireRole(
      { kind: "party", partyId: "p", dealId: "d", role: "SELLER" },
      "SELLER",
    );

    expect(result).toBeNull();
  });

  it("blocks the wrong party with 403", () => {
    const result = requireRole(
      { kind: "party", partyId: "p", dealId: "d", role: "BUYER" },
      "SELLER",
    );

    expect(result?.status).toBe(403);
  });

  it("always lets Vera through — the service secret carries no role", () => {
    expect(requireRole({ kind: "vera" }, "SELLER")).toBeNull();
    expect(requireRole({ kind: "vera" }, "BUYER")).toBeNull();
  });
});

/**
 * NEW-1 regression suite. These run against the real singleton token store,
 * not a mock, so the wiring is covered too.
 */
describe("NEW-1 — authorizeDealAccess", () => {
  const DEAL = randomUUID();
  const OTHER_DEAL = randomUUID();
  const PARTY = randomUUID();

  function request(init?: { headers?: Record<string, string>; query?: string }) {
    return new Request(`http://localhost/api/vera/release-escrow${init?.query ?? ""}`, {
      method: "POST",
      headers: init?.headers,
    });
  }

  async function issueFor(dealId: string, role: PartyRole = "BUYER") {
    const { token } = await tokenStore.issue({
      partyId: PARTY,
      dealId,
      role,
      ttlMs: BUYER_TOKEN_TTL_MS,
    });
    return token;
  }

  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects a request carrying no credentials at all", async () => {
    const result = await authorizeDealAccess(request(), DEAL);

    expect(result).toMatchObject({ ok: false, status: 401, error: "missing_credentials" });
  });

  it("rejects a token that was never issued", async () => {
    const result = await authorizeDealAccess(
      request({ headers: { authorization: "Bearer made-up" } }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: false, status: 401, error: "invalid_token" });
  });

  it("accepts a valid party token for its own deal", async () => {
    const token = await issueFor(DEAL, "SELLER");

    const result = await authorizeDealAccess(
      request({ headers: { authorization: `Bearer ${token}` } }),
      DEAL,
    );

    expect(result).toMatchObject({
      ok: true,
      principal: { kind: "party", partyId: PARTY, dealId: DEAL, role: "SELLER" },
    });
  });

  it("accepts a party token supplied in the link query string", async () => {
    const token = await issueFor(DEAL);

    const result = await authorizeDealAccess(
      request({ query: `?t=${token}` }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: true });
  });

  it("refuses a valid token issued for a DIFFERENT deal", async () => {
    const token = await issueFor(OTHER_DEAL);

    const result = await authorizeDealAccess(
      request({ headers: { authorization: `Bearer ${token}` } }),
      DEAL,
    );

    expect(result).toMatchObject({
      ok: false,
      status: 403,
      error: "token_deal_mismatch",
    });
  });

  it("refuses a revoked token", async () => {
    const token = await issueFor(DEAL);
    await tokenStore.revoke(token);

    const result = await authorizeDealAccess(
      request({ headers: { authorization: `Bearer ${token}` } }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: false, status: 401, error: "token_revoked" });
  });

  it("refuses an expired token", async () => {
    const { token } = await tokenStore.issue({
      partyId: PARTY,
      dealId: DEAL,
      role: "BUYER",
      ttlMs: -1_000,
    });

    const result = await authorizeDealAccess(
      request({ headers: { authorization: `Bearer ${token}` } }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: false, status: 401, error: "token_expired" });
  });

  it("accepts the Vera service secret on the ConvAI channel", async () => {
    vi.stubEnv("VERA_TOOL_SECRET", "s3cret-value-for-convai");

    const result = await authorizeDealAccess(
      request({ headers: { [VERA_SECRET_HEADER]: "s3cret-value-for-convai" } }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: true, principal: { kind: "vera" } });
  });

  it("refuses a wrong Vera secret", async () => {
    vi.stubEnv("VERA_TOOL_SECRET", "s3cret-value-for-convai");

    const result = await authorizeDealAccess(
      request({ headers: { [VERA_SECRET_HEADER]: "wrong-value-same-length" } }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: false, status: 401 });
  });

  it("FAILS CLOSED when VERA_TOOL_SECRET is unset — an unset secret authenticates nobody", async () => {
    vi.stubEnv("VERA_TOOL_SECRET", "");

    const result = await authorizeDealAccess(
      request({ headers: { [VERA_SECRET_HEADER]: "anything" } }),
      DEAL,
    );

    expect(result).toMatchObject({ ok: false, status: 401 });
  });
});

afterAll(async () => {
  await pglite.close();
});
