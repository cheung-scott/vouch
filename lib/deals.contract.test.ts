import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import type { Database } from "@/lib/db/client";
import { schema } from "@/lib/db/schema";
import { InMemoryDealStore, type DealStore } from "@/lib/deals";
import { PostgresDealStore } from "@/lib/deals-postgres";
import type { DealTerms, Party, PartyRole } from "@/types/deal";

/**
 * Contract tests: every assertion below runs against BOTH store
 * implementations. That is what makes the KV → Postgres swap safe to do
 * behind an unchanged `DealStore` interface — if Postgres disagrees with the
 * in-memory reference on any of these, the swap is not behaviour-preserving.
 *
 * Postgres here is PGlite: the real Postgres engine compiled to WebAssembly
 * and run in-process, so the SQL, the constraints and the transactions are
 * genuine — no server to install.
 */

const MIGRATIONS_DIR = path.join(process.cwd(), "lib/db/migrations");

const pglite = new PGlite();
const pgDb = drizzle(pglite, { schema }) as unknown as Database;

/** Replays every migration in order, so the test schema is the one a real
 *  deployment would end up with — not a hand-maintained copy that drifts. */
async function applyMigration() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const file of files) {
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

const TERMS: DealTerms = {
  item: "Leica M6",
  quantity: 1,
  amountMinor: 250_000,
  currency: "USD",
};

function newDealInput() {
  return {
    buyer: makeParty("BUYER", "Ada"),
    seller: makeParty("SELLER", "Grace"),
    terms: TERMS,
  };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

await applyMigration();

const implementations: Array<[string, () => Promise<DealStore>]> = [
  ["InMemoryDealStore", async () => new InMemoryDealStore()],
  [
    "PostgresDealStore",
    async () => {
      await pglite.exec("TRUNCATE TABLE deal_access_tokens, parties, deals CASCADE;");
      return new PostgresDealStore(pgDb);
    },
  ],
];

describe.each(implementations)("DealStore contract: %s", (_name, build) => {
  let store: DealStore;

  beforeEach(async () => {
    store = await build();
  });

  it("creates a DRAFT deal with a VCH_ reference and both parties", async () => {
    const input = newDealInput();
    const deal = await store.create(input);

    expect(deal.status).toBe("DRAFT");
    expect(deal.reference).toMatch(/^VCH_[A-Z0-9]{6}$/);
    expect(deal.buyer.id).toBe(input.buyer.id);
    expect(deal.buyer.role).toBe("BUYER");
    expect(deal.seller.id).toBe(input.seller.id);
    expect(deal.seller.role).toBe("SELLER");
    expect(deal.terms).toEqual(TERMS);
    expect(deal.veraSessionIds).toEqual([]);
    expect(deal.lockedAt).toBeUndefined();
    expect(deal.releasedAt).toBeUndefined();
  });

  it("reads a deal back by id and by reference", async () => {
    const created = await store.create(newDealInput());

    const byId = await store.get(created.id);
    const byRef = await store.byReference(created.reference);

    expect(byId?.id).toBe(created.id);
    expect(byRef?.id).toBe(created.id);
    expect(byId?.terms).toEqual(created.terms);
  });

  it("returns null for an unknown id or reference", async () => {
    expect(await store.get(randomUUID())).toBeNull();
    expect(await store.byReference("VCH_ZZZZZZ")).toBeNull();
  });

  it("applies a patch, keeps id and reference immutable, bumps updatedAt", async () => {
    const created = await store.create(newDealInput());
    await wait(5);

    const updated = await store.update(created.id, {
      status: "AGREED",
      stripePaymentIntentId: "pi_test_123",
    });

    expect(updated.id).toBe(created.id);
    expect(updated.reference).toBe(created.reference);
    expect(updated.status).toBe("AGREED");
    expect(updated.stripePaymentIntentId).toBe("pi_test_123");
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
      new Date(created.createdAt).getTime(),
    );
  });

  it("does not clobber columns the patch never mentioned", async () => {
    const created = await store.create(newDealInput());
    await store.update(created.id, { stripePaymentIntentId: "pi_keep_me" });

    const after = await store.update(created.id, { status: "IN_ESCROW" });

    expect(after.stripePaymentIntentId).toBe("pi_keep_me");
    expect(after.terms).toEqual(TERMS);
  });

  it("persists nested party updates for both roles", async () => {
    const created = await store.create(newDealInput());
    const committedAt = new Date().toISOString();

    await store.update(created.id, {
      buyer: { ...created.buyer, committedAt },
    });
    const after = await store.update(created.id, {
      seller: { ...created.seller, stripeAccountId: "acct_test_1" },
    });

    expect(after.buyer.committedAt).toBe(committedAt);
    expect(after.seller.stripeAccountId).toBe("acct_test_1");
    // The buyer edit survives the later seller edit.
    expect(after.buyer.firstName).toBe("Ada");
  });

  it("throws when updating a deal that does not exist", async () => {
    await expect(
      store.update(randomUUID(), { status: "AGREED" }),
    ).rejects.toThrow(/not found/);
  });

  it("stamps lockedAt on IN_ESCROW and releasedAt on RELEASED", async () => {
    const created = await store.create(newDealInput());

    const locked = await store.setStatus(created.id, "IN_ESCROW");
    expect(locked.status).toBe("IN_ESCROW");
    expect(locked.lockedAt).toBeDefined();
    expect(locked.releasedAt).toBeUndefined();

    const released = await store.setStatus(created.id, "RELEASED");
    expect(released.status).toBe("RELEASED");
    expect(released.releasedAt).toBeDefined();
    // lockedAt is not re-stamped by a later transition.
    expect(released.lockedAt).toBe(locked.lockedAt);
  });

  it("does not stamp timestamps for other statuses", async () => {
    const created = await store.create(newDealInput());
    const disputed = await store.setStatus(created.id, "DISPUTED");

    expect(disputed.lockedAt).toBeUndefined();
    expect(disputed.releasedAt).toBeUndefined();
  });

  it("appends Vera session ids in order and ignores duplicates", async () => {
    const created = await store.create(newDealInput());

    await store.appendVeraSession(created.id, "conv_1");
    await store.appendVeraSession(created.id, "conv_2");
    const deduped = await store.appendVeraSession(created.id, "conv_1");

    expect(deduped.veraSessionIds).toEqual(["conv_1", "conv_2"]);
  });

  it("lists every deal, and filters by status in the store", async () => {
    const a = await store.create(newDealInput());
    const b = await store.create(newDealInput());
    await store.setStatus(b.id, "DISPUTED");

    const all = await store.list();
    const disputed = await store.list({ status: "DISPUTED" });

    expect(all.map((d) => d.id).sort()).toEqual([a.id, b.id].sort());
    expect(disputed.map((d) => d.id)).toEqual([b.id]);
  });

  it("round-trips optional fields as undefined, never null", async () => {
    const created = await store.create(newDealInput());
    const fetched = await store.get(created.id);

    expect(fetched?.stripeTransferId).toBeUndefined();
    expect(fetched?.voiceAgreementRecordingUrl).toBeUndefined();
    expect(fetched?.buyer.email).toBeUndefined();
    expect(fetched?.veraEvalResults).toBeUndefined();
  });
});

/**
 * Guarantees only the database can give. These are the reason the migration
 * is worth doing — in the KV store each of these is a rule the application
 * code has to remember in every write path.
 */
describe("Postgres-only guarantees", () => {
  beforeEach(async () => {
    await pglite.exec("TRUNCATE TABLE deal_access_tokens, parties, deals CASCADE;");
  });

  it("refuses a second party in the same role on one deal", async () => {
    const store = new PostgresDealStore(pgDb);
    const deal = await store.create(newDealInput());

    await expect(
      pglite.exec(
        `INSERT INTO parties (id, deal_id, role, first_name, identity_verified)
         VALUES ('${randomUUID()}', '${deal.id}', 'BUYER', 'Impostor', false);`,
      ),
    ).rejects.toThrow(/parties_deal_role_uidx|duplicate key/i);
  });

  it("refuses a party pointing at a deal that does not exist", async () => {
    await expect(
      pglite.exec(
        `INSERT INTO parties (id, deal_id, role, first_name, identity_verified)
         VALUES ('${randomUUID()}', '${randomUUID()}', 'BUYER', 'Orphan', false);`,
      ),
    ).rejects.toThrow(/foreign key|violates/i);
  });

  it("rolls the whole create back if any part of it fails", async () => {
    const store = new PostgresDealStore(pgDb);
    const input = newDealInput();
    // Both parties carry the same id, so the second insert violates the
    // primary key and the transaction must undo the deal row as well.
    input.seller.id = input.buyer.id;

    await expect(store.create(input)).rejects.toThrow();

    const rows = await pglite.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM deals;",
    );
    expect(rows.rows[0].count).toBe("0");
  });
});

afterAll(async () => {
  await pglite.close();
});
