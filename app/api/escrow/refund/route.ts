import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { refundCharge, sanitizeStripeError } from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";
import { revokeEscrowCard } from "@/lib/escrow-card";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Stripe's `Refund.reason` enum is a closed set. Validate the optional
// `reason` against it so callers can't smuggle arbitrary strings into
// Stripe's API and so the parse failure shows up here, not in a 4xx
// from Stripe's side.
const ReasonSchema = z.enum([
  "duplicate",
  "fraudulent",
  "requested_by_customer",
]);

const BodySchema = z.object({
  deal_id: z.string().min(1),
  reason: ReasonSchema.optional(),
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

  // NEW-1: this route moves money. Authenticate before touching the deal.
  const auth = await guardDeal(req, parsed.data.deal_id);
  if ("response" in auth) return auth.response;

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }
  // Refund is the post-capture sibling of cancelEscrow — only legal once
  // the buyer has actually funded the hold (IN_ESCROW) or after the
  // seller has been paid out (RELEASED). DRAFT/AGREED still belong to
  // cancel; CANCELLED/REFUNDED are terminal.
  if (!["IN_ESCROW", "RELEASED"].includes(deal.status)) {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }
  if (!deal.stripePaymentIntentId) {
    return NextResponse.json(
      { error: "no_payment_intent" },
      { status: 409 },
    );
  }


  // NEW-2: kill the escrow card BEFORE the money goes back to the buyer. The
  // card is funded from Vouch's own Issuing balance (D1), so a live card plus
  // a completed refund pays out twice. See lib/escrow-card.ts.
  const revoked = await revokeEscrowCard(deal);
  if (!revoked.ok) {
    return NextResponse.json(
      { error: "card_revoke_failed", code: revoked.code },
      { status: 502 },
    );
  }

  try {
    const refund = await refundCharge({
      paymentIntentId: deal.stripePaymentIntentId,
      dealId: deal.id,
      reason: parsed.data.reason as
        | Stripe.RefundCreateParams.Reason
        | undefined,
    });

    // Persist refund id BEFORE flipping status (same shape as
    // lock-escrow B-1 / release-escrow M-2). If the second write fails,
    // a retry hits the state guard (still IN_ESCROW or RELEASED) and
    // Stripe's idempotency on refund creation prevents a double-refund.
    await dealStore.update(deal.id, { stripeRefundId: refund.id });
    await dealStore.setStatus(deal.id, "REFUNDED");

    return NextResponse.json({
      refund_id: refund.id,
      status: "refunded",
      deal_status: "REFUNDED",
    });
  } catch (err) {
    console.error("[escrow.refund] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
