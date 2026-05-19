import { NextRequest, NextResponse } from "next/server";
import {
  RefundDealInputSchema,
  type RefundDealOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { refundCharge, sanitizeStripeError } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = RefundDealInputSchema.safeParse(body);
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
  // Refund is the post-capture sibling of cancel — IN_ESCROW or RELEASED
  // only. Everything else is rejected with a clean 409 so Vera can read
  // the error back naturally rather than hitting a Stripe 4xx mid-call.
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

  // Idempotency: if the deal already has a refund id, the refund happened
  // — return the existing id rather than firing another Stripe call.
  let refundId = deal.stripeRefundId ?? null;

  if (!refundId) {
    try {
      const refund = await refundCharge({
        paymentIntentId: deal.stripePaymentIntentId,
        dealId: deal.id,
        reason: parsed.data.reason as
          | Stripe.RefundCreateParams.Reason
          | undefined,
      });
      refundId = refund.id;
    } catch (err) {
      const { code } = sanitizeStripeError(err);
      console.error("[refund-deal] refundCharge failed", err);
      return NextResponse.json(
        { error: "stripe_error", code },
        { status: 502 },
      );
    }
  }

  // Persist refund id BEFORE flipping status (same shape as lock-escrow
  // B-1 / release-escrow M-2). If the second write fails, retries find
  // the deal still in IN_ESCROW/RELEASED with the refund id stored, the
  // idempotency guard short-circuits, and the status flip re-runs.
  await dealStore.update(deal.id, { stripeRefundId: refundId });
  await dealStore.setStatus(deal.id, "REFUNDED");

  const response: RefundDealOutput = {
    success: true,
    refund_id: refundId,
    deal_status: "REFUNDED",
    spoken_text:
      "I've reversed the payment. The full amount is being returned to the buyer, including the platform fee. Settlement back to their card usually takes five to ten business days depending on their bank.",
  };
  return NextResponse.json(response);
}
