import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { Deal, DealTerms } from "@/types/deal";

// Enum values are duplicated from types/deal.ts rather than derived, because
// Postgres enums are a schema object — changing one is a migration, not a
// type-level edit. Keeping them literal makes that cost visible.
export const dealStatusEnum = pgEnum("deal_status", [
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

export const issuingCardStatusEnum = pgEnum("issuing_card_status", [
  "frozen",
  "active",
  "canceled",
]);

export const partyRoleEnum = pgEnum("party_role", ["BUYER", "SELLER"]);

export const deals = pgTable(
  "deals",
  {
    id: uuid("id").primaryKey(),
    reference: text("reference").notNull().unique(),
    status: dealStatusEnum("status").notNull(),
    // DealTerms stays a single jsonb value object — every caller reads
    // deal.terms.amountMinor. Shredding it into columns would break them all.
    terms: jsonb("terms").$type<DealTerms>().notNull(),

    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeTransferId: text("stripe_transfer_id"),
    stripeRefundId: text("stripe_refund_id"),
    stripeIssuingCardholderId: text("stripe_issuing_cardholder_id"),
    stripeIssuingCardId: text("stripe_issuing_card_id"),
    stripeIssuingCardStatus: issuingCardStatusEnum("stripe_issuing_card_status"),

    allowedMerchantCategory: text("allowed_merchant_category"),
    spendCap: integer("spend_cap"),

    // SECURITY: never returned raw in a public API response (GDPR Art. 9).
    voiceAgreementRecordingUrl: text("voice_agreement_recording_url"),

    // Native text[] rather than a join table — the app treats this as an
    // ordered append-only list, never queries it relationally.
    veraSessionIds: text("vera_session_ids").array().notNull().default([]),
    veraSummary: text("vera_summary"),
    veraEvalResults: jsonb("vera_eval_results").$type<Deal["veraEvalResults"]>(),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
    lockedAt: timestamp("locked_at", { withTimezone: true }),
    releasedAt: timestamp("released_at", { withTimezone: true }),
  },
  (t) => [
    index("deals_created_at_idx").on(t.createdAt),
    index("deals_status_idx").on(t.status),
  ],
);

export const parties = pgTable(
  "parties",
  {
    // Caller-supplied UUID — app/api/deals/route.ts mints these before
    // calling create(), so the store must persist rather than generate them.
    id: uuid("id").primaryKey(),
    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id, { onDelete: "cascade" }),
    role: partyRoleEnum("role").notNull(),
    firstName: text("first_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeAccountId: text("stripe_account_id"),
    identityVerified: boolean("identity_verified").notNull().default(false),
    committedAt: timestamp("committed_at", { withTimezone: true }),
  },
  (t) => [
    // Exactly one buyer and one seller per deal, enforced by the database
    // rather than by convention in every write path.
    uniqueIndex("parties_deal_role_uidx").on(t.dealId, t.role),
    index("parties_deal_id_idx").on(t.dealId),
  ],
);

/**
 * Per-party capability tokens. Opaque (the string carries no meaning; the
 * server looks it up) rather than a self-contained JWT, because a leaked deal
 * link must die instantly — deleting a row does that, and an unexpired JWT
 * cannot be un-issued.
 */
export const dealAccessTokens = pgTable(
  "deal_access_tokens",
  {
    id: uuid("id").primaryKey(),
    // 32 random bytes, base64url. Unique + indexed: this is the auth hot path.
    token: text("token").notNull().unique(),
    partyId: uuid("party_id")
      .notNull()
      .references(() => parties.id, { onDelete: "cascade" }),
    // dealId and role are copied from the party rather than joined. Both are
    // immutable for the life of a party, so there is no drift risk, and it
    // keeps verification to one indexed point lookup on the auth hot path.
    dealId: uuid("deal_id")
      .notNull()
      .references(() => deals.id, { onDelete: "cascade" }),
    role: partyRoleEnum("role").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("deal_access_tokens_party_id_idx").on(t.partyId)],
);

export const schema = { deals, parties, dealAccessTokens };
