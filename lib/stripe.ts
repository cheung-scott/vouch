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

// Restricted Stripe client used by Vera's money-moving tools. Permissions are
// scoped down to payment_intents + refunds + issuing.* in the Stripe dashboard
// when the restricted key is generated. NOT `accounts:write` — Vera cannot
// create new Connect accounts. Falls back to the main `stripe` client's
// underlying key if the restricted key env var isn't set yet (dev convenience).
const veraKey = process.env.STRIPE_VERA_KEY ?? apiKey ?? "sk_test_placeholder";
export const stripeVera = new Stripe(veraKey, {
  typescript: true,
  appInfo: {
    name: "Vouch (Vera)",
    url: "https://github.com/cheung-scott/vouch",
  },
});

// 290 bps = 2.9% — matches Stripe's processing rate. Pitch line:
// "Vouch adds zero markup on Stripe — we cover Vera's mediation cost
// from the spread on multi-currency + volume tiers post-MVP." Beats
// Escrow.com's 3.25% low-tier and reads as discipline, not gouging.
// (Was 5% on Day 0; user revisited Day 5 as too aggressive for category.)
export const VOUCH_PLATFORM_FEE_BPS = 290;

export function calculatePlatformFee(amountMinor: number): number {
  return Math.round((amountMinor * VOUCH_PLATFORM_FEE_BPS) / 10_000);
}

export type StripeCurrency = "usd" | "gbp" | "eur";

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
  return stripeVera.paymentIntents.create({
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
  return stripeVera.paymentIntents.capture(
    paymentIntentId,
    amountToCapture ? { amount_to_capture: amountToCapture } : undefined,
  );
}

export async function releaseEscrow(params: {
  paymentIntentId: string;
  dealId: string;
  amountToCapture?: number;
}) {
  // The Stripe `expand` parameter is NOT supported on `capture()` —
  // historically it was silently ignored which meant our transfer_id
  // never populated and the deal record kept stub IDs. Stripe-Full-Audit
  // caught this. Fix: capture WITHOUT expand, then retrieve with expand
  // to pull the populated charge.transfer chain.
  const captured = await stripeVera.paymentIntents.capture(
    params.paymentIntentId,
    params.amountToCapture
      ? { amount_to_capture: params.amountToCapture }
      : undefined,
  );

  // Now hydrate latest_charge.transfer via a fresh retrieve with expand.
  const pi = await stripeVera.paymentIntents.retrieve(captured.id, {
    expand: ["latest_charge.transfer"],
  });

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
  return stripeVera.paymentIntents.cancel(paymentIntentId);
}

/**
 * Refund a captured (post-RELEASE) escrow payment back to the buyer.
 *
 * `reverse_transfer: true` claws the released funds back from the seller's
 * Connect balance (or pushes the balance negative if already withdrawn) so
 * the buyer is made whole. `refund_application_fee: true` also refunds the
 * 2.9% Vouch platform fee — Vera only invokes this when a dispute resolves
 * in the buyer's favour, in which case we shouldn't keep our cut either.
 *
 * Closes the gap flagged in Stripe-Full-Audit ("no refund route —
 * cancel_escrow only works pre-capture").
 */
export async function refundCharge(params: {
  paymentIntentId: string;
  dealId: string;
  reason?: Stripe.RefundCreateParams.Reason;
}) {
  return stripeVera.refunds.create({
    payment_intent: params.paymentIntentId,
    reverse_transfer: true,
    refund_application_fee: true,
    reason: params.reason ?? "requested_by_customer",
    metadata: {
      vouch_deal_id: params.dealId,
      vouch_dispute_outcome: "refund_buyer",
    },
  });
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
  return stripeVera.issuing.cardholders.create({
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
  return stripeVera.issuing.cards.create({
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
  return stripeVera.issuing.cards.update(cardId, {
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
  return stripeVera.issuing.cards.update(cardId, {
    status: "canceled",
    metadata: {
      vouch_status_changed_at: new Date().toISOString(),
    },
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Stripe Agent Toolkit — official 2026 agentic-commerce SDK
// (https://github.com/stripe/ai, v0.9.0).
//
// We surface a factory that lazily constructs the AI-SDK flavour of the
// toolkit, scoped to the restricted Vera key. The toolkit connects to
// `mcp.stripe.com` and the server filters which tools are exposed based on
// the restricted key's permissions — so blast radius is contained at the
// Stripe-API layer, not just our local code.
//
// Pitch line, literally true: "Vera uses Stripe's official agentic-commerce
// toolkit, scoped to a restricted API key."
//
// We don't wire this through ConvAI's webhook-tool format here — the toolkit
// emits AI-SDK / OpenAI / LangChain tool shapes via the MCP bridge, none of
// which match ConvAI's `POST /v1/convai/tools` schema. The factory is
// exported and ready for a future direct-API agent layer (e.g. an
// Anthropic-SDK-driven `/api/vera/agent` route that picks up where ConvAI
// hands off post-call). Vera's existing 13 ConvAI tools cover the demo flow.
//
// Lazy dynamic import keeps the @stripe/agent-toolkit/ai-sdk module (which
// depends on the `ai` peer package) out of the default bundle. Only loaded
// if a caller actually awaits the factory.
// ────────────────────────────────────────────────────────────────────────────
export async function getVeraStripeToolkit() {
  const { StripeAgentToolkit } = await import("@stripe/agent-toolkit/ai-sdk");
  const toolkit = new StripeAgentToolkit({
    secretKey: process.env.STRIPE_VERA_KEY ?? process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder",
    configuration: {
      // v0.9.0 of the toolkit moved permission scoping server-side: the
      // restricted key itself governs which tools mcp.stripe.com exposes
      // (payment_intents:read, refunds:write, etc.). No client-side
      // `actions: { ... }` block any more — the dashboard-issued key is
      // the single source of truth.
      context: {},
    },
  });
  await toolkit.initialize();
  return toolkit;
}

// ────────────────────────────────────────────────────────────────────────────
// Embedded Connect Onboarding — Stripe's React components let us render the
// onboarding UI inside Vouch's own React tree instead of redirecting sellers
// to connect.stripe.com. The flow needs a short-lived AccountSession secret
// (~30 min TTL) that authorises ONE component for ONE Connect account; the
// secret is minted server-side here and consumed by `<ConnectAccountOnboarding/>`
// on the client. Per-component permissions are scoped here, not on the client.
//
// Admin operation — uses the main `stripe` client (full secret) rather than
// the restricted `stripeVera` key, since AccountSessions creation is a
// platform-level action, not a money-movement tool.
// ────────────────────────────────────────────────────────────────────────────
export async function createAccountSession(params: { accountId: string }) {
  return stripe.accountSessions.create({
    account: params.accountId,
    components: {
      account_onboarding: {
        enabled: true,
        features: {
          external_account_collection: true,
        },
      },
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
