import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import type { Database } from "@/lib/db/client";
import { deals, parties } from "@/lib/db/schema";
import type { DealStore } from "@/lib/deals";
import type { Deal, DealStatus, DealTerms, Party } from "@/types/deal";
import { dealReference } from "@/lib/utils";

type Tx = Parameters<Parameters<Database["transaction"]>[0]>[0];
type Executor = Database | Tx;

type DealRow = typeof deals.$inferSelect;
type PartyRow = typeof parties.$inferSelect;

/** Postgres NULL is the app's `undefined` — the Zod schemas use `.optional()`. */
function opt<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}

function toIso(value: Date | null): string | undefined {
  return value === null ? undefined : value.toISOString();
}

function toParty(row: PartyRow): Party {
  return {
    id: row.id,
    role: row.role,
    firstName: row.firstName,
    email: opt(row.email),
    phone: opt(row.phone),
    stripeCustomerId: opt(row.stripeCustomerId),
    stripeAccountId: opt(row.stripeAccountId),
    identityVerified: row.identityVerified,
    committedAt: toIso(row.committedAt),
  };
}

function toDeal(row: DealRow, buyer: Party, seller: Party): Deal {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    terms: row.terms,
    buyer,
    seller,
    stripePaymentIntentId: opt(row.stripePaymentIntentId),
    stripeTransferId: opt(row.stripeTransferId),
    stripeRefundId: opt(row.stripeRefundId),
    stripeIssuingCardholderId: opt(row.stripeIssuingCardholderId),
    stripeIssuingCardId: opt(row.stripeIssuingCardId),
    stripeIssuingCardStatus: opt(row.stripeIssuingCardStatus),
    allowedMerchantCategory: opt(row.allowedMerchantCategory),
    spendCap: opt(row.spendCap),
    voiceAgreementRecordingUrl: opt(row.voiceAgreementRecordingUrl),
    veraSessionIds: row.veraSessionIds,
    veraSummary: opt(row.veraSummary),
    veraEvalResults: opt(row.veraEvalResults),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lockedAt: toIso(row.lockedAt),
    releasedAt: toIso(row.releasedAt),
  };
}

function partyColumns(party: Party) {
  return {
    firstName: party.firstName,
    email: party.email ?? null,
    phone: party.phone ?? null,
    stripeCustomerId: party.stripeCustomerId ?? null,
    stripeAccountId: party.stripeAccountId ?? null,
    identityVerified: party.identityVerified,
    committedAt: party.committedAt ? new Date(party.committedAt) : null,
  };
}

/**
 * Only keys actually present in the patch are written, so a partial update
 * never clobbers a column it did not mention. `id` and `reference` are
 * deliberately absent — both stores treat them as immutable after create.
 */
function dealColumns(patch: Partial<Deal>): Partial<typeof deals.$inferInsert> {
  const c: Partial<typeof deals.$inferInsert> = {};
  if (patch.status !== undefined) c.status = patch.status;
  if (patch.terms !== undefined) c.terms = patch.terms;
  if (patch.stripePaymentIntentId !== undefined)
    c.stripePaymentIntentId = patch.stripePaymentIntentId;
  if (patch.stripeTransferId !== undefined)
    c.stripeTransferId = patch.stripeTransferId;
  if (patch.stripeRefundId !== undefined)
    c.stripeRefundId = patch.stripeRefundId;
  if (patch.stripeIssuingCardholderId !== undefined)
    c.stripeIssuingCardholderId = patch.stripeIssuingCardholderId;
  if (patch.stripeIssuingCardId !== undefined)
    c.stripeIssuingCardId = patch.stripeIssuingCardId;
  if (patch.stripeIssuingCardStatus !== undefined)
    c.stripeIssuingCardStatus = patch.stripeIssuingCardStatus;
  if (patch.allowedMerchantCategory !== undefined)
    c.allowedMerchantCategory = patch.allowedMerchantCategory;
  if (patch.spendCap !== undefined) c.spendCap = patch.spendCap;
  if (patch.voiceAgreementRecordingUrl !== undefined)
    c.voiceAgreementRecordingUrl = patch.voiceAgreementRecordingUrl;
  if (patch.veraSessionIds !== undefined)
    c.veraSessionIds = patch.veraSessionIds;
  if (patch.veraSummary !== undefined) c.veraSummary = patch.veraSummary;
  if (patch.veraEvalResults !== undefined)
    c.veraEvalResults = patch.veraEvalResults;
  if (patch.lockedAt !== undefined) c.lockedAt = new Date(patch.lockedAt);
  if (patch.releasedAt !== undefined) c.releasedAt = new Date(patch.releasedAt);
  return c;
}

async function loadDeal(tx: Executor, id: string): Promise<Deal | null> {
  const [row] = await tx.select().from(deals).where(eq(deals.id, id));
  if (!row) return null;
  const partyRows = await tx
    .select()
    .from(parties)
    .where(eq(parties.dealId, id));
  const buyer = partyRows.find((p) => p.role === "BUYER");
  const seller = partyRows.find((p) => p.role === "SELLER");
  if (!buyer || !seller) {
    throw new Error(`deal ${id} is missing a party row`);
  }
  return toDeal(row, toParty(buyer), toParty(seller));
}

/**
 * Locks the deal row for the rest of the transaction (`SELECT … FOR UPDATE`).
 * Any concurrent transaction touching the same deal blocks here instead of
 * reading a copy it is about to overwrite — the lost-update race the KV
 * store's read-modify-write `update()` cannot avoid.
 */
async function lockDeal(tx: Tx, id: string): Promise<DealRow | undefined> {
  const [row] = await tx
    .select()
    .from(deals)
    .where(eq(deals.id, id))
    .for("update");
  return row;
}

// `deals.id` is a uuid column, so Postgres REJECTS a non-uuid literal instead of
// simply not matching it. That is a behaviour difference from the KV store, where
// an unknown key was just a miss, and it broke two things once Postgres went live:
//
//   1. GET /api/deals/<anything-not-a-uuid> threw at the database and returned 500
//      rather than 404, which also lets a scanner tell "malformed" from "not found".
//   2. Worse, and the reason this is a correctness fix and not a tidy-up: the route
//      does `get(id) ?? byReference(id)`. A throwing get() means the reference
//      lookup NEVER RUNS, so no deal was reachable by its human-facing reference.
//
// Guarding here rather than in the route keeps every caller correct.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class PostgresDealStore implements DealStore {
  constructor(private readonly db: Database) {}

  async create(input: {
    buyer: Party;
    seller: Party;
    terms: DealTerms;
  }): Promise<Deal> {
    const id = randomUUID();
    const reference = dealReference(id);
    const now = new Date();

    return this.db.transaction(async (tx) => {
      await tx.insert(deals).values({
        id,
        reference,
        status: "DRAFT",
        terms: input.terms,
        veraSessionIds: [],
        createdAt: now,
        updatedAt: now,
      });
      // Deal and both parties land together or not at all.
      await tx.insert(parties).values([
        {
          id: input.buyer.id,
          dealId: id,
          role: "BUYER",
          ...partyColumns(input.buyer),
        },
        {
          id: input.seller.id,
          dealId: id,
          role: "SELLER",
          ...partyColumns(input.seller),
        },
      ]);
      const created = await loadDeal(tx, id);
      if (!created) throw new Error(`deal ${id} vanished after insert`);
      return created;
    });
  }

  async get(id: string): Promise<Deal | null> {
    // Not a uuid means it cannot be an id, so it is a miss — not an error.
    if (!UUID_RE.test(id)) return null;
    return loadDeal(this.db, id);
  }

  async byReference(reference: string): Promise<Deal | null> {
    const [row] = await this.db
      .select({ id: deals.id })
      .from(deals)
      .where(eq(deals.reference, reference));
    return row ? loadDeal(this.db, row.id) : null;
  }

  async update(id: string, patch: Partial<Deal>): Promise<Deal> {
    return this.db.transaction(async (tx) => {
      const existing = await lockDeal(tx, id);
      if (!existing) throw new Error(`deal not found: ${id}`);

      await tx
        .update(deals)
        .set({ ...dealColumns(patch), updatedAt: new Date() })
        .where(eq(deals.id, id));

      if (patch.buyer) {
        await tx
          .update(parties)
          .set(partyColumns(patch.buyer))
          .where(and(eq(parties.dealId, id), eq(parties.role, "BUYER")));
      }
      if (patch.seller) {
        await tx
          .update(parties)
          .set(partyColumns(patch.seller))
          .where(and(eq(parties.dealId, id), eq(parties.role, "SELLER")));
      }

      const updated = await loadDeal(tx, id);
      if (!updated) throw new Error(`deal ${id} vanished during update`);
      return updated;
    });
  }

  async setStatus(id: string, status: DealStatus): Promise<Deal> {
    return this.db.transaction(async (tx) => {
      const existing = await lockDeal(tx, id);
      if (!existing) throw new Error(`deal not found: ${id}`);

      const now = new Date();
      const columns: Partial<typeof deals.$inferInsert> = {
        status,
        updatedAt: now,
      };
      if (status === "IN_ESCROW") columns.lockedAt = now;
      if (status === "RELEASED") columns.releasedAt = now;

      await tx.update(deals).set(columns).where(eq(deals.id, id));
      const updated = await loadDeal(tx, id);
      if (!updated) throw new Error(`deal ${id} vanished during setStatus`);
      return updated;
    });
  }

  async appendVeraSession(id: string, sessionId: string): Promise<Deal> {
    return this.db.transaction(async (tx) => {
      const existing = await lockDeal(tx, id);
      if (!existing) throw new Error(`deal not found: ${id}`);

      // Read-modify-write, but under the row lock taken above, so two
      // concurrent appends serialise instead of one overwriting the other.
      if (existing.veraSessionIds.includes(sessionId)) {
        const unchanged = await loadDeal(tx, id);
        if (!unchanged) throw new Error(`deal ${id} vanished`);
        return unchanged;
      }

      await tx
        .update(deals)
        .set({
          veraSessionIds: [...existing.veraSessionIds, sessionId],
          updatedAt: new Date(),
        })
        .where(eq(deals.id, id));

      const updated = await loadDeal(tx, id);
      if (!updated) throw new Error(`deal ${id} vanished during append`);
      return updated;
    });
  }

  async list(filter?: { status?: DealStatus }): Promise<Deal[]> {
    // The status filter runs in Postgres. The KV store downloads every deal
    // and filters in JavaScript — that is the difference this swap buys.
    const rows = filter?.status
      ? await this.db.select().from(deals).where(eq(deals.status, filter.status))
      : await this.db.select().from(deals);
    if (rows.length === 0) return [];

    // One query for every party rather than one per deal (no N+1).
    const partyRows = await this.db
      .select()
      .from(parties)
      .where(
        inArray(
          parties.dealId,
          rows.map((r) => r.id),
        ),
      );

    const byDeal = new Map<string, PartyRow[]>();
    for (const p of partyRows) {
      const bucket = byDeal.get(p.dealId);
      if (bucket) bucket.push(p);
      else byDeal.set(p.dealId, [p]);
    }

    return rows.map((row) => {
      const bucket = byDeal.get(row.id) ?? [];
      const buyer = bucket.find((p) => p.role === "BUYER");
      const seller = bucket.find((p) => p.role === "SELLER");
      if (!buyer || !seller) {
        throw new Error(`deal ${row.id} is missing a party row`);
      }
      return toDeal(row, toParty(buyer), toParty(seller));
    });
  }
}
