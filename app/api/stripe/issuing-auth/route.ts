import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Safety upper bound — actual response budget is ~2s before Stripe auto-declines.
export const maxDuration = 5;

// Stripe Issuing realtime authorization webhook.
// Stripe sends issuing_authorization.request when a card mints an authorisation.
// We have ~2 seconds total to respond {approved: true|false} or Stripe auto-declines.
//
// HOT PATH — keep this handler minimal. No KV idempotency, no Vera tool calls,
// no LLM. Direct comparison of the deal's agreed merchant category vs the
// authorisation's merchant_data.category. Return decision.
//
// Dedicated endpoint (not /api/stripe/webhook) because the main webhook does
// idempotency lookups + multi-secret signature verification + deal mutations,
// any of which could blow past the 2s budget.

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  // Dedicated destination secret. The vouch-prod-issuing-auth Stripe webhook
  // destination has its own whsec_ that's distinct from the main platform
  // destination's secret. Prefer the dedicated one; fall back to the platform
  // secret for backwards-compat if someone reuses an existing destination.
  const secret =
    process.env.STRIPE_WEBHOOK_SECRET_ISSUING ??
    process.env.STRIPE_WEBHOOK_SECRET_PLATFORM;

  if (!signature || !secret) {
    // Fail-closed: if we can't verify, we decline. Stripe rejects unsigned anyway.
    return NextResponse.json(
      { approved: false, reason: "webhook_misconfigured" },
      { status: 400 },
    );
  }

  const payload = await req.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[issuing-auth] signature verification failed", err);
    return NextResponse.json(
      { approved: false, reason: "bad_signature" },
      { status: 400 },
    );
  }

  if (event.type !== "issuing_authorization.request") {
    // Defensive: this endpoint only handles auth requests. Other Issuing
    // events (e.g. created/updated) go to the main webhook.
    return NextResponse.json({ received: true, type: event.type });
  }

  const auth = event.data.object as Stripe.Issuing.Authorization;
  const merchantCategory = auth.merchant_data.category;
  const amount = auth.amount;
  const cardId = auth.card.id;

  // Look up the deal this card belongs to. Card has metadata.vouch_deal_id
  // (set at mint time per /api/issuing/mint-escrow-card → mintEscrowCard).
  const dealId = auth.card.metadata?.vouch_deal_id;
  if (!dealId) {
    console.warn("[issuing-auth] card has no vouch_deal_id, declining", cardId);
    return NextResponse.json({ approved: false, reason: "no_deal_metadata" });
  }

  const deal = await dealStore.get(dealId);
  if (!deal) {
    console.warn("[issuing-auth] deal not found, declining", dealId);
    return NextResponse.json({ approved: false, reason: "deal_not_found" });
  }

  // Approval criteria — keep simple for demo:
  //   1. Deal status must be RELEASED (escrow paid out, card activated)
  //   2. Merchant category should match deal.allowedMerchantCategory if set
  //   3. Amount should be within deal.spendCap if set (else default = deal.terms.amountMinor)
  // Decline reasons logged for the demo's "Vera gatekeeps" beat.

  if (deal.status !== "RELEASED") {
    console.log(
      "[issuing-auth] decline: deal not RELEASED",
      dealId,
      deal.status,
    );
    return NextResponse.json({ approved: false, reason: "deal_not_released" });
  }

  const allowedCategory = deal.allowedMerchantCategory;
  if (allowedCategory && merchantCategory !== allowedCategory) {
    console.log(
      "[issuing-auth] decline: category mismatch",
      "expected=",
      allowedCategory,
      "actual=",
      merchantCategory,
    );
    return NextResponse.json({ approved: false, reason: "category_mismatch" });
  }

  const spendCap = deal.spendCap ?? deal.terms.amountMinor;
  if (amount > spendCap) {
    console.log(
      "[issuing-auth] decline: over cap",
      "amount=",
      amount,
      "cap=",
      spendCap,
    );
    return NextResponse.json({ approved: false, reason: "over_cap" });
  }

  console.log(
    "[issuing-auth] APPROVED",
    dealId,
    "amount=",
    amount,
    "category=",
    merchantCategory,
  );
  return NextResponse.json({ approved: true });
}
