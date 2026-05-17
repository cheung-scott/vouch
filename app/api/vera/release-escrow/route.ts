import { NextRequest, NextResponse } from "next/server";
import {
  ReleaseEscrowInputSchema,
  type ReleaseEscrowOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { releaseEscrow, sanitizeStripeError } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReleaseEscrowInputSchema.safeParse(body);
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
  if (deal.status !== "IN_ESCROW") {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }

  // Idempotency: if the deal already has a transfer ID, the release
  // already happened — return the existing one rather than capturing
  // twice. (Stripe's capture call on a captured PI errors with
  // payment_intent_unexpected_state but we'd rather not surface that.)
  let transferId = deal.stripeTransferId ?? null;

  if (!transferId) {
    if (!deal.stripePaymentIntentId) {
      return NextResponse.json(
        { error: "no_payment_intent" },
        { status: 409 },
      );
    }
    try {
      const result = await releaseEscrow({
        paymentIntentId: deal.stripePaymentIntentId,
        dealId: deal.id,
      });
      // B-001 lesson: charge.transfer is where the destination transfer
      // lives, not pi.latest_charge. releaseEscrow() in lib/stripe.ts
      // already pulls transfer_id from charge.transfer.id.
      transferId = result.transfer_id ?? null;
      if (!transferId) {
        console.warn(
          "[release-escrow] Stripe returned no transfer_id — capture may have succeeded but transfer hop hasn't materialized yet",
          { dealId: deal.id, pi: deal.stripePaymentIntentId },
        );
      }
    } catch (err) {
      const { code } = sanitizeStripeError(err);
      console.error("[release-escrow] releaseEscrow failed", err);
      return NextResponse.json(
        { error: "stripe_error", code },
        { status: 502 },
      );
    }
  }

  await dealStore.setStatus(deal.id, "RELEASED");
  const updated = await dealStore.update(deal.id, {
    stripeTransferId: transferId ?? undefined,
  });

  // 48h settlement window per Stripe's standard Connect payout timing
  // for UK test-mode accounts.
  const settlesBy = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();

  const response: ReleaseEscrowOutput = {
    success: true,
    transfer_id: transferId ?? "",
    amount: updated.terms.amountMinor,
    currency: updated.terms.currency,
    settles_by: settlesBy,
  };
  return NextResponse.json(response);
}
