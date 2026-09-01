import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createConnectExpressAccount,
  createAccountOnboardingLink,
  sanitizeStripeError,
} from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import { guardDeal, requireRole } from "@/lib/auth";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email(),
  country: z.string().length(2).optional(),
  // Optional — when supplied, the new acct_… is persisted as the deal's
  // seller.stripeAccountId so lock-escrow can find it later. Without this
  // wiring the Express onboarding flow creates an orphaned Connect account
  // that no deal ever references (Stripe research audit, May 17).
  deal_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { email, country, deal_id: dealId } = parsed.data;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  // If a deal_id was supplied, validate it before spending a Stripe API call
  // creating an account we'd then orphan.
  let deal = null;
  if (dealId) {
    // S-101, the real fix. The status gate below narrowed the race but never
    // bound the caller to a party — anyone with the deal_id could attach
    // their own Connect account. Now only the SELLER (or Vera acting in the
    // call) can, proven by the token from the seller invitation link.
    const auth = await guardDeal(req, dealId);
    if ("response" in auth) return auth.response;
    const wrongParty = requireRole(auth.principal, "SELLER");
    if (wrongParty) return wrongParty;

    deal = await dealStore.get(dealId);
    if (!deal) {
      return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
    }
    // SECURITY (Sec-Review S-101): status-gate the bind. Without this
    // guard, an unauthenticated caller can race the real seller through
    // Express onboarding and bind their own acct_ to a deal that's
    // already advanced past the onboarding window. Only deals in DRAFT
    // or AWAITING_SELLER state are eligible — once a deal reaches AGREED
    // or beyond, the seller's account is locked in.
    const eligibleForBinding = ["DRAFT", "AWAITING_SELLER"].includes(
      deal.status,
    );
    if (!eligibleForBinding) {
      return NextResponse.json(
        { error: "deal_not_in_onboarding_state", current_status: deal.status },
        { status: 409 },
      );
    }
    if (deal.seller.stripeAccountId) {
      // Already wired — return the existing onboarding flow for refresh
      // rather than creating a duplicate account.
      try {
        const link = await createAccountOnboardingLink({
          accountId: deal.seller.stripeAccountId,
          returnUrl: `${appUrl}/onboard/return?account=${deal.seller.stripeAccountId}&deal_id=${dealId}`,
          refreshUrl: `${appUrl}/api/connect/refresh-link?account=${deal.seller.stripeAccountId}`,
        });
        return NextResponse.json({
          account_id: deal.seller.stripeAccountId,
          onboarding_url: link.url,
          expires_at: link.expires_at,
          reused: true,
        });
      } catch (err) {
        console.error("[connect.create-account] refresh-link error", err);
        return NextResponse.json(
          { error: "stripe_error", ...sanitizeStripeError(err) },
          { status: 500 },
        );
      }
    }
  }

  try {
    const account = await createConnectExpressAccount({ email, country });

    // Persist the new acct_… to the deal record BEFORE returning the
    // onboarding URL — if persistence fails we want the error surfaced
    // before the seller wastes time filling out the Stripe form.
    if (deal && dealId) {
      await dealStore.update(dealId, {
        seller: { ...deal.seller, stripeAccountId: account.id },
      });
    }

    const returnUrl = dealId
      ? `${appUrl}/onboard/return?account=${account.id}&deal_id=${dealId}`
      : `${appUrl}/onboard/return?account=${account.id}`;
    const link = await createAccountOnboardingLink({
      accountId: account.id,
      returnUrl,
      refreshUrl: `${appUrl}/api/connect/refresh-link?account=${account.id}`,
    });

    return NextResponse.json({
      account_id: account.id,
      onboarding_url: link.url,
      expires_at: link.expires_at,
    });
  } catch (err) {
    console.error("[connect.create-account] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
