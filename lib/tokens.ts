import { randomBytes, randomUUID } from "node:crypto";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { getDb, type Database } from "@/lib/db/client";
import { dealAccessTokens } from "@/lib/db/schema";
import type { PartyRole } from "@/types/deal";

/**
 * Buyers act immediately after creating a deal. Sellers route through Stripe
 * Express onboarding, which can take days — a 24h seller token would expire
 * mid-onboarding and strand them.
 */
export const BUYER_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
export const SELLER_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface IssuedToken {
  token: string;
  expiresAt: string;
}

export interface TokenRecord {
  token: string;
  partyId: string;
  dealId: string;
  role: PartyRole;
  expiresAt: string;
  revokedAt?: string;
}

export interface TokenIssueInput {
  partyId: string;
  dealId: string;
  role: PartyRole;
  ttlMs: number;
}

export interface TokenStore {
  issue(input: TokenIssueInput): Promise<IssuedToken>;
  /**
   * Returns the record if the token exists at all, INCLUDING expired and
   * revoked ones. Validity is the guard's decision (lib/auth.ts) so it can
   * distinguish the rejection reasons; this layer only does storage.
   */
  verify(token: string): Promise<TokenRecord | null>;
  revoke(token: string): Promise<void>;
  /**
   * The newest still-valid token for a party, or null. Lets an authorized
   * counterparty re-fetch a share link without minting a fresh token on every
   * page load, which would grow the table without bound.
   */
  activeFor(partyId: string): Promise<TokenRecord | null>;
}

/** 32 bytes of CSPRNG output. Not derived from the deal id — see NEW-3, where
 *  a 24-bit reference made deals brute-forceable. */
export function newTokenValue(): string {
  return randomBytes(32).toString("base64url");
}

export class InMemoryTokenStore implements TokenStore {
  private records = new Map<string, TokenRecord>();

  async issue(input: TokenIssueInput): Promise<IssuedToken> {
    const token = newTokenValue();
    const expiresAt = new Date(Date.now() + input.ttlMs).toISOString();
    this.records.set(token, {
      token,
      partyId: input.partyId,
      dealId: input.dealId,
      role: input.role,
      expiresAt,
    });
    return { token, expiresAt };
  }

  async verify(token: string): Promise<TokenRecord | null> {
    return this.records.get(token) ?? null;
  }

  async revoke(token: string): Promise<void> {
    const existing = this.records.get(token);
    if (existing) {
      this.records.set(token, {
        ...existing,
        revokedAt: new Date().toISOString(),
      });
    }
  }

  async activeFor(partyId: string): Promise<TokenRecord | null> {
    for (const record of this.records.values()) {
      if (record.partyId !== partyId) continue;
      if (record.revokedAt) continue;
      if (new Date(record.expiresAt).getTime() <= Date.now()) continue;
      return record;
    }
    return null;
  }
}

export class PostgresTokenStore implements TokenStore {
  constructor(private readonly db: Database) {}

  async issue(input: TokenIssueInput): Promise<IssuedToken> {
    const token = newTokenValue();
    const expiresAt = new Date(Date.now() + input.ttlMs);
    await this.db.insert(dealAccessTokens).values({
      id: randomUUID(),
      token,
      partyId: input.partyId,
      dealId: input.dealId,
      role: input.role,
      expiresAt,
      createdAt: new Date(),
    });
    return { token, expiresAt: expiresAt.toISOString() };
  }

  async verify(token: string): Promise<TokenRecord | null> {
    const [row] = await this.db
      .select()
      .from(dealAccessTokens)
      .where(eq(dealAccessTokens.token, token));
    if (!row) return null;
    return {
      token: row.token,
      partyId: row.partyId,
      dealId: row.dealId,
      role: row.role,
      expiresAt: row.expiresAt.toISOString(),
      revokedAt: row.revokedAt?.toISOString(),
    };
  }

  async revoke(token: string): Promise<void> {
    await this.db
      .update(dealAccessTokens)
      .set({ revokedAt: new Date() })
      .where(eq(dealAccessTokens.token, token));
  }

  async activeFor(partyId: string): Promise<TokenRecord | null> {
    const [row] = await this.db
      .select()
      .from(dealAccessTokens)
      .where(
        and(
          eq(dealAccessTokens.partyId, partyId),
          isNull(dealAccessTokens.revokedAt),
          gt(dealAccessTokens.expiresAt, new Date()),
        ),
      )
      .orderBy(desc(dealAccessTokens.createdAt))
      .limit(1);
    if (!row) return null;
    return {
      token: row.token,
      partyId: row.partyId,
      dealId: row.dealId,
      role: row.role,
      expiresAt: row.expiresAt.toISOString(),
      revokedAt: row.revokedAt?.toISOString(),
    };
  }
}

declare global {
  var __vouchTokenStore: TokenStore | undefined;
}

function pickTokenStore(): TokenStore {
  if (process.env.DEAL_STORE === "postgres") {
    console.info("[tokens] using PostgresTokenStore");
    return new PostgresTokenStore(getDb());
  }
  // Mirrors the DealStore fallback. Tokens held in memory do NOT survive a
  // restart or a serverless cold start, so every issued link dies with the
  // process — acceptable for local dev, never for a deployment.
  console.info("[tokens] using InMemoryTokenStore (local dev only)");
  return new InMemoryTokenStore();
}

export const tokenStore: TokenStore =
  globalThis.__vouchTokenStore ?? pickTokenStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__vouchTokenStore = tokenStore;
}
