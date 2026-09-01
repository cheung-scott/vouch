import { randomUUID } from "node:crypto";
import type { Deal, DealStatus, DealTerms, Party } from "@/types/deal";
import { dealReference } from "./utils";
import { getDb } from "@/lib/db/client";
import { PostgresDealStore } from "@/lib/deals-postgres";

export interface DealStore {
  create(input: {
    buyer: Party;
    seller: Party;
    terms: DealTerms;
  }): Promise<Deal>;
  get(id: string): Promise<Deal | null>;
  byReference(reference: string): Promise<Deal | null>;
  update(id: string, patch: Partial<Deal>): Promise<Deal>;
  setStatus(id: string, status: DealStatus): Promise<Deal>;
  appendVeraSession(id: string, sessionId: string): Promise<Deal>;
  list(filter?: { status?: DealStatus }): Promise<Deal[]>;
}

export class InMemoryDealStore implements DealStore {
  private deals = new Map<string, Deal>();
  private referenceIndex = new Map<string, string>();

  async create(input: {
    buyer: Party;
    seller: Party;
    terms: DealTerms;
  }): Promise<Deal> {
    const id = randomUUID();
    const reference = dealReference(id);
    const now = new Date().toISOString();
    const deal: Deal = {
      id,
      reference,
      status: "DRAFT",
      terms: input.terms,
      buyer: input.buyer,
      seller: input.seller,
      veraSessionIds: [],
      createdAt: now,
      updatedAt: now,
    };
    this.deals.set(id, deal);
    this.referenceIndex.set(reference, id);
    return deal;
  }

  async get(id: string): Promise<Deal | null> {
    return this.deals.get(id) ?? null;
  }

  async byReference(reference: string): Promise<Deal | null> {
    const id = this.referenceIndex.get(reference);
    return id ? (this.deals.get(id) ?? null) : null;
  }

  async update(id: string, patch: Partial<Deal>): Promise<Deal> {
    const existing = this.deals.get(id);
    if (!existing) throw new Error(`deal not found: ${id}`);
    const updated: Deal = {
      ...existing,
      ...patch,
      id: existing.id,
      reference: existing.reference,
      updatedAt: new Date().toISOString(),
    };
    this.deals.set(id, updated);
    return updated;
  }

  async setStatus(id: string, status: DealStatus): Promise<Deal> {
    const patch: Partial<Deal> = { status };
    if (status === "IN_ESCROW") patch.lockedAt = new Date().toISOString();
    if (status === "RELEASED") patch.releasedAt = new Date().toISOString();
    return this.update(id, patch);
  }

  async appendVeraSession(id: string, sessionId: string): Promise<Deal> {
    const existing = this.deals.get(id);
    if (!existing) throw new Error(`deal not found: ${id}`);
    if (existing.veraSessionIds.includes(sessionId)) return existing;
    return this.update(id, {
      veraSessionIds: [...existing.veraSessionIds, sessionId],
    });
  }

  async list(filter?: { status?: DealStatus }): Promise<Deal[]> {
    const all = Array.from(this.deals.values());
    if (!filter?.status) return all;
    return all.filter((d) => d.status === filter.status);
  }
}

// Vercel KV-backed implementation. Keys:
//   vouch:deal:{id}      → Deal JSON
//   vouch:ref:{ref}      → deal id (lookup index)
//   vouch:deals          → set of all deal ids (for list)
// All writes that touch both the deal blob and an index are sequenced —
// no MULTI here because list() is cold-path and Vercel KV's REST shape
// doesn't expose pipelined transactions cleanly. Acceptable for
// hackathon scope; revisit for production.
class KvDealStore implements DealStore {
  // Lazy-loaded so the module doesn't blow up when KV envs aren't set in
  // a local-only dev session. Type is `any` because @vercel/kv's surface
  // is well-typed at the call site and dragging the import into module
  // scope would defeat the lazy guard.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private kvInstance: any | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async kv(): Promise<any> {
    if (this.kvInstance) return this.kvInstance;
    const mod = await import("@vercel/kv");
    this.kvInstance = mod.kv;
    return this.kvInstance;
  }

  private dealKey(id: string) {
    return `vouch:deal:${id}`;
  }

  private refKey(reference: string) {
    return `vouch:ref:${reference}`;
  }

  private readonly indexKey = "vouch:deals";

  async create(input: {
    buyer: Party;
    seller: Party;
    terms: DealTerms;
  }): Promise<Deal> {
    const id = randomUUID();
    const reference = dealReference(id);
    const now = new Date().toISOString();
    const deal: Deal = {
      id,
      reference,
      status: "DRAFT",
      terms: input.terms,
      buyer: input.buyer,
      seller: input.seller,
      veraSessionIds: [],
      createdAt: now,
      updatedAt: now,
    };
    const kv = await this.kv();
    await kv.set(this.dealKey(id), deal);
    await kv.set(this.refKey(reference), id);
    await kv.sadd(this.indexKey, id);
    return deal;
  }

  async get(id: string): Promise<Deal | null> {
    const kv = await this.kv();
    const deal = (await kv.get(this.dealKey(id))) as Deal | null;
    return deal;
  }

  async byReference(reference: string): Promise<Deal | null> {
    const kv = await this.kv();
    const id = (await kv.get(this.refKey(reference))) as string | null;
    if (!id) return null;
    return this.get(id);
  }

  async update(id: string, patch: Partial<Deal>): Promise<Deal> {
    const existing = await this.get(id);
    if (!existing) throw new Error(`deal not found: ${id}`);
    const updated: Deal = {
      ...existing,
      ...patch,
      id: existing.id,
      reference: existing.reference,
      updatedAt: new Date().toISOString(),
    };
    const kv = await this.kv();
    await kv.set(this.dealKey(id), updated);
    return updated;
  }

  async setStatus(id: string, status: DealStatus): Promise<Deal> {
    const patch: Partial<Deal> = { status };
    if (status === "IN_ESCROW") patch.lockedAt = new Date().toISOString();
    if (status === "RELEASED") patch.releasedAt = new Date().toISOString();
    return this.update(id, patch);
  }

  async appendVeraSession(id: string, sessionId: string): Promise<Deal> {
    const existing = await this.get(id);
    if (!existing) throw new Error(`deal not found: ${id}`);
    if (existing.veraSessionIds.includes(sessionId)) return existing;
    return this.update(id, {
      veraSessionIds: [...existing.veraSessionIds, sessionId],
    });
  }

  async list(filter?: { status?: DealStatus }): Promise<Deal[]> {
    const kv = await this.kv();
    const ids = ((await kv.smembers(this.indexKey)) ?? []) as string[];
    if (ids.length === 0) return [];
    const blobs = (await kv.mget(...ids.map((id) => this.dealKey(id)))) as (
      | Deal
      | null
    )[];
    const deals = blobs.filter((d): d is Deal => d !== null);
    if (!filter?.status) return deals;
    return deals.filter((d) => d.status === filter.status);
  }
}

declare global {
  var __vouchDealStore: DealStore | undefined;
}

// Pick KV when the env vars are present (Vercel sets these automatically
// when a KV/Upstash store is bound to the project; both legacy `KV_REST_*`
// and the newer `UPSTASH_REDIS_REST_*` shapes work because @vercel/kv
// auto-detects). Otherwise stay in-memory — keeps local dev frictionless
// and matches the A-001 pattern in OffPlanLog.
function pickStore(): DealStore {
  if (process.env.DEAL_STORE === "postgres") {
    console.info("[deals] using PostgresDealStore (DEAL_STORE=postgres)");
    return new PostgresDealStore(getDb());
  }
  const hasKv =
    !!process.env.KV_REST_API_URL ||
    !!process.env.UPSTASH_REDIS_REST_URL ||
    !!process.env.KV_URL;
  if (hasKv) {
    console.info("[deals] using KvDealStore (Vercel KV / Upstash Redis bound)");
    return new KvDealStore();
  }
  console.info(
    "[deals] using InMemoryDealStore (no KV env vars set — local dev only)",
  );
  return new InMemoryDealStore();
}

export const dealStore: DealStore = globalThis.__vouchDealStore ?? pickStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__vouchDealStore = dealStore;
}
