import { randomUUID } from "node:crypto";
import type { Deal, DealStatus, DealTerms, Party } from "@/types/deal";
import { dealReference } from "./utils";

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

class InMemoryDealStore implements DealStore {
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

declare global {
  var __vouchDealStore: DealStore | undefined;
}

export const dealStore: DealStore =
  globalThis.__vouchDealStore ?? new InMemoryDealStore();

if (process.env.NODE_ENV !== "production") {
  globalThis.__vouchDealStore = dealStore;
}
