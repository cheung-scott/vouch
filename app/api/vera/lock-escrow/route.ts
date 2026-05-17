import { NextRequest, NextResponse } from "next/server";
import {
  LockEscrowInputSchema,
  type LockEscrowOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { createEscrowPaymentIntent, sanitizeStripeError } from "@/lib/stripe";
import { toStripeCurrency } from "@/types/deal";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = LockEscrowInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!parsed.data.deal_id) {
    return NextResponse.json({ error: "missing_deal_id" }, { status: 400 });
  }

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }
  if (deal.status !== "AGREED") {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }

  // Idempotency: if a real PI already exists on this deal, return it
  // rather than re-creating — prevents double-holds when Vera retries
  // lock_escrow on a transient failure.
  let paymentIntentId = deal.stripePaymentIntentId ?? null;

  if (!paymentIntentId) {
    // Seller must be onboarded onto a Connect account before money can
    // be routed to them. Surface a clean 409 if not — beats letting
    // Stripe return a cryptic "no_such_destination" 400.
    const sellerAccountId = deal.seller.stripeAccountId;
    if (!sellerAccountId) {
      return NextResponse.json(
        { error: "seller_not_onboarded" },
        { status: 409 },
      );
    }

    try {
      const pi = await createEscrowPaymentIntent({
        amountMinor: deal.terms.amountMinor,
        currency: toStripeCurrency(deal.terms.currency),
        buyerCustomerId: deal.buyer.stripeCustomerId,
        sellerAccountId,
        dealId: deal.id,
      });
      paymentIntentId = pi.id;
    } catch (err) {
      const { code } = sanitizeStripeError(err);
      console.error("[lock-escrow] createEscrowPaymentIntent failed", err);
      return NextResponse.json(
        { error: "stripe_error", code },
        { status: 502 },
      );
    }
  }

  // Persist the PI id BEFORE flipping status. If the second write fails,
  // a later retry hits the idempotency guard (we already have a PI) and
  // the state guard (still in AGREED) — both pass, retry succeeds. The
  // reverse order would leave the deal stuck in IN_ESCROW with no PI id
  // and no recovery path (T1 B-1).
  await dealStore.update(deal.id, { stripePaymentIntentId: paymentIntentId });
  const updated = await dealStore.setStatus(deal.id, "IN_ESCROW");

  // 14-day escrow window for the demo. Real product derives this from
  // the agreed terms (e.g. delivery deadline + buffer).
  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 14,
  ).toISOString();

  const response: LockEscrowOutput = {
    success: true,
    amount: updated.terms.amountMinor,
    currency: updated.terms.currency,
    stripe_pi_id: paymentIntentId,
    expires_at: expiresAt,
  };
  return NextResponse.json(response);
}
