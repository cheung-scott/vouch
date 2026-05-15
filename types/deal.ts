import { z } from "zod";

export const CurrencySchema = z.enum(["GBP", "USD", "EUR"]);
export type Currency = z.infer<typeof CurrencySchema>;

export function toStripeCurrency(c: Currency): "gbp" | "usd" | "eur" {
  return c.toLowerCase() as "gbp" | "usd" | "eur";
}

export const DealStatusSchema = z.enum([
  "DRAFT",
  "AWAITING_SELLER",
  "AGREED",
  "IN_ESCROW",
  "RELEASED",
  "DISPUTED",
  "REVIEWING",
  "CANCELLED",
]);
export type DealStatus = z.infer<typeof DealStatusSchema>;

export const PartyRoleSchema = z.enum(["BUYER", "SELLER"]);
export type PartyRole = z.infer<typeof PartyRoleSchema>;

export const PartySchema = z.object({
  id: z.string(),
  role: PartyRoleSchema,
  firstName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripeAccountId: z.string().optional(),
  identityVerified: z.boolean().default(false),
  committedAt: z.string().datetime().optional(),
});
export type Party = z.infer<typeof PartySchema>;

export const DealTermsSchema = z.object({
  item: z.string().default(""),
  quantity: z.number().int().positive().default(1),
  condition: z.string().optional(),
  amountMinor: z.number().int().nonnegative(),
  currency: CurrencySchema,
  deadline: z.string().datetime().optional(),
  deliveryMethod: z.string().optional(),
  notes: z.string().optional(),
});
export type DealTerms = z.infer<typeof DealTermsSchema>;

export const DealSchema = z.object({
  id: z.string(),
  reference: z.string().regex(/^VCH_[A-Z0-9]{6}$/),
  status: DealStatusSchema,
  terms: DealTermsSchema,
  buyer: PartySchema,
  seller: PartySchema,
  stripePaymentIntentId: z.string().optional(),
  stripeTransferId: z.string().optional(),
  // SECURITY: never include this raw URL in public API responses (GDPR Art. 9 biometric data).
  // Day 3+ implementation must generate signed URLs server-side per request after auth.
  voiceAgreementRecordingUrl: z.string().url().optional(),
  veraSessionIds: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lockedAt: z.string().datetime().optional(),
  releasedAt: z.string().datetime().optional(),
});
export type Deal = z.infer<typeof DealSchema>;

export const DisputeReasonSchema = z.enum([
  "NOT_RECEIVED",
  "NOT_AS_DESCRIBED",
  "DAMAGED",
  "LATE",
  "WRONG_ITEM",
  "OTHER",
]);
export type DisputeReason = z.infer<typeof DisputeReasonSchema>;

export const DisputeSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  openedBy: PartyRoleSchema,
  reason: DisputeReasonSchema,
  description: z.string(),
  evidenceUrls: z.array(z.string().url()).default([]),
  status: z.enum(["OPEN", "GATHERING_EVIDENCE", "REVIEWING", "RESOLVED", "ESCALATED"]),
  resolution: z.enum(["BUYER_FAVOUR", "SELLER_FAVOUR", "SPLIT", "PENDING"]).optional(),
  openedAt: z.string().datetime(),
  resolvedAt: z.string().datetime().optional(),
});
export type Dispute = z.infer<typeof DisputeSchema>;
