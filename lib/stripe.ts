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
    business_type: "individual",
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

export async function captureEscrow(paymentIntentId: string) {
  return stripe.paymentIntents.capture(paymentIntentId);
}

export async function releaseEscrow(params: {
  paymentIntentId: string;
  dealId: string;
}) {
  const pi = await stripe.paymentIntents.capture(params.paymentIntentId);
  return {
    payment_intent: pi,
    transfer_id: typeof pi.latest_charge === "string" ? pi.latest_charge : null,
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
