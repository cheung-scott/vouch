import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY not set — Stripe SDK calls will fail until configured.",
  );
}

export const stripe = new Stripe(apiKey ?? "sk_test_placeholder", {
  typescript: true,
  appInfo: {
    name: "Vouch",
    url: "https://github.com/cheung-scott/vouch",
  },
});

export const VOUCH_PLATFORM_FEE_BPS = 500;

export function calculatePlatformFee(amountMinor: number): number {
  return Math.round((amountMinor * VOUCH_PLATFORM_FEE_BPS) / 10_000);
}

export type StripeCurrency = "gbp" | "usd" | "eur";

export async function createConnectExpressAccount(params: {
  email: string;
  country?: string;
  businessType?: "individual" | "company";
  capabilities?: Array<"card_payments" | "transfers">;
}) {
  return stripe.accounts.create({
    type: "express",
    email: params.email,
    country: params.country ?? "GB",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: params.businessType ?? "individual",
    metadata: { vouch_account_kind: "seller" },
  });
}

export async function createAccountOnboardingLink(params: {
  accountId: string;
  returnUrl: string;
  refreshUrl: string;
}) {
  return stripe.accountLinks.create({
    account: params.accountId,
    return_url: params.returnUrl,
    refresh_url: params.refreshUrl,
    type: "account_onboarding",
  });
}

export async function createIdentityVerificationSession(params: {
  email: string;
  metadata?: Record<string, string>;
}) {
  return stripe.identity.verificationSessions.create({
    type: "document",
    options: {
      document: {
        require_matching_selfie: true,
        require_live_capture: true,
      },
    },
    metadata: {
      vouch_email: params.email,
      ...params.metadata,
    },
  });
}

export async function createEscrowPaymentIntent(params: {
  amountMinor: number;
  currency: StripeCurrency;
  buyerCustomerId?: string;
  sellerAccountId: string;
  dealId: string;
}) {
  const applicationFee = calculatePlatformFee(params.amountMinor);
  return stripe.paymentIntents.create({
    amount: params.amountMinor,
    currency: params.currency,
    customer: params.buyerCustomerId,
    capture_method: "manual",
    confirmation_method: "automatic",
    application_fee_amount: applicationFee,
    transfer_data: { destination: params.sellerAccountId },
    metadata: {
      vouch_deal_id: params.dealId,
      vouch_kind: "escrow_hold",
    },
  });
}

export async function captureEscrow(
  paymentIntentId: string,
  amountToCapture?: number,
) {
  return stripe.paymentIntents.capture(
    paymentIntentId,
    amountToCapture ? { amount_to_capture: amountToCapture } : undefined,
  );
}

export async function releaseEscrow(params: {
  paymentIntentId: string;
  dealId: string;
  amountToCapture?: number;
}) {
  const pi = await stripe.paymentIntents.capture(
    params.paymentIntentId,
    {
      expand: ["latest_charge.transfer"],
      ...(params.amountToCapture
        ? { amount_to_capture: params.amountToCapture }
        : {}),
    },
  );
  const charge =
    pi.latest_charge && typeof pi.latest_charge === "object"
      ? (pi.latest_charge as Stripe.Charge)
      : null;
  const transfer =
    charge?.transfer && typeof charge.transfer === "object"
      ? (charge.transfer as Stripe.Transfer)
      : null;
  return {
    payment_intent: pi,
    charge_id: charge?.id ?? null,
    transfer_id: transfer?.id ?? null,
  };
}

export async function cancelEscrow(paymentIntentId: string) {
  return stripe.paymentIntents.cancel(paymentIntentId);
}

export function constructWebhookEvent(params: {
  payload: string | Buffer;
  signature: string;
  secret: string;
}): Stripe.Event {
  return stripe.webhooks.constructEvent(
    params.payload,
    params.signature,
    params.secret,
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Stripe Issuing — the "escrow virtual card" mechanic.
//
// When a deal moves to IN_ESCROW, Vouch can optionally issue a virtual card
// to the seller for the escrow amount, frozen (inactive). On voice-confirmed
// receipt, the card is activated — the seller can spend their balance directly
// without waiting for bank settlement. This aligns with Stripe's 2026 agentic-
// commerce thesis (Issuing for agents), inverted: instead of the agent paying
// with a virtual card, the agent (Vera) MINTS a frozen card for the seller and
// unfreezes it on voice-confirmed delivery. The card IS the escrow lifecycle.
//
// Requires Issuing enabled on the Stripe account. Test mode allows it without
// platform application. Live mode requires Stripe Issuing approval.
//
// Scaffold landed Day 2 PM; wired into release_escrow / cancel_escrow Day 4 PM.
// ────────────────────────────────────────────────────────────────────────────

/** Per-deal cardholder for the seller. Issuing requires a cardholder before a card. */
export async function createIssuingCardholder(params: {
  fullName: string;
  email: string;
  phone?: string;
  billingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string; // ISO 3166-1 alpha-2 ("GB", "US", etc.)
  };
  dealId: string;
}) {
  return stripe.issuing.cardholders.create({
    type: "individual",
    name: params.fullName,
    email: params.email,
    phone_number: params.phone,
    billing: {
      address: {
        line1: params.billingAddress.line1,
        city: params.billingAddress.city,
        postal_code: params.billingAddress.postalCode,
        country: params.billingAddress.country,
      },
    },
    metadata: {
      vouch_deal_id: params.dealId,
      vouch_kind: "seller_cardholder",
    },
  });
}

/**
 * Mint a virtual card for the seller with the escrow amount as the spending
 * limit. Created in INACTIVE state — the card is FROZEN until the buyer
 * voice-confirms receipt, at which point it's activated via `activateIssuingCard`.
 */
export async function mintEscrowCard(params: {
  cardholderId: string;
  amountMinor: number;
  currency: StripeCurrency;
  dealId: string;
}) {
  return stripe.issuing.cards.create({
    cardholder: params.cardholderId,
    currency: params.currency,
    type: "virtual",
    status: "inactive", // 🔒 frozen — flipped to active on release
    spending_controls: {
      spending_limits: [
        {
          amount: params.amountMinor,
          interval: "all_time",
        },
      ],
    },
    metadata: {
      vouch_deal_id: params.dealId,
      vouch_kind: "escrow_card",
      vouch_initial_status: "frozen",
    },
  });
}

/**
 * Activate (unfreeze) the seller's escrow card. Called from the
 * release_escrow tool route after voice-confirmed receipt.
 */
export async function activateIssuingCard(cardId: string) {
  return stripe.issuing.cards.update(cardId, {
    status: "active",
    metadata: {
      vouch_status_changed_at: new Date().toISOString(),
    },
  });
}

/**
 * Cancel (terminate) the seller's escrow card. Called on cancel_escrow when
 * the deal is voided or refunded. Cancelled cards cannot be re-activated.
 */
export async function cancelIssuingCard(cardId: string) {
  return stripe.issuing.cards.update(cardId, {
    status: "canceled",
    metadata: {
      vouch_status_changed_at: new Date().toISOString(),
    },
  });
}

export function sanitizeStripeError(err: unknown): {
  code: string;
  type: string;
} {
  if (err && typeof err === "object") {
    const code =
      "code" in err && typeof (err as { code?: unknown }).code === "string"
        ? (err as { code: string }).code
        : "unknown";
    const type =
      "type" in err && typeof (err as { type?: unknown }).type === "string"
        ? (err as { type: string }).type
        : "unknown";
    return { code, type };
  }
  return { code: "unknown", type: "unknown" };
}
