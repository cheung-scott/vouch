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
  "REFUNDED",
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
  // Set by /api/escrow/refund when a dispute resolves in the buyer's
  // favour and the captured funds are reversed via Stripe's refunds
  // API with reverse_transfer + refund_application_fee.
  stripeRefundId: z.string().optional(),
  // Stripe Issuing — escrow virtual card lifecycle.
  // Per-seller cardholder is created on first IN_ESCROW transition; card is minted
  // frozen and activated on voice-confirmed receipt. Card status drives the
  // visible "escrow card" state on the deal detail page. See lib/stripe.ts
  // § Stripe Issuing for the lifecycle helpers.
  stripeIssuingCardholderId: z.string().optional(),
  stripeIssuingCardId: z.string().optional(),
  stripeIssuingCardStatus: z.enum(["frozen", "active", "canceled"]).optional(),
  // Optional Issuing controls — populated by Vera if the deal agreed a
  // merchant category and/or spending cap during onboarding. Consumed by
  // app/api/stripe/issuing-auth/route.ts on every real-time authorization
  // request. If unset, the handler falls back to approving anything
  // ≤ terms.amountMinor in any category (existing per-card spending limit
  // still applies as a backstop).
  allowedMerchantCategory: z.string().optional(),
  spendCap: z.number().int().optional(),
  // SECURITY: never include this raw URL in public API responses (GDPR Art. 9 biometric data).
  // Day 3+ implementation must generate signed URLs server-side per request after auth.
  voiceAgreementRecordingUrl: z.string().url().optional(),
  veraSessionIds: z.array(z.string()).default([]),
  // Vera's post-call analysis (populated by ElevenLabs's post-call webhook on
  // conversation end). All fields are optional — older deals from before this
  // was wired will not have them. See app/api/vera/post-call-webhook/route.ts
  // for the persistence path and components/VeraAnalysisCard.tsx for the
  // display surface.
  veraSummary: z.string().optional(),
  veraEvalResults: z
    .record(
      z.string(),
      z.object({
        result: z.enum(["success", "failure", "unknown"]),
        rationale: z.string(),
      }),
    )
    .optional(),
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
