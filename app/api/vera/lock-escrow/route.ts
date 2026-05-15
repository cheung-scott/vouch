import { NextRequest, NextResponse } from "next/server";
import {
  LockEscrowInputSchema,
  type LockEscrowOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";

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

  // TODO(day-3): call createEscrowPaymentIntent here once Stripe keys + seller
  // Connect account are provisioned. For now we set state and return a stub PI id.
  const stubPaymentIntentId = `pi_stub_${deal.reference.toLowerCase()}`;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
  await dealStore.setStatus(deal.id, "IN_ESCROW");
  const updated = await dealStore.update(deal.id, {
    stripePaymentIntentId:
      deal.stripePaymentIntentId ?? stubPaymentIntentId,
  });

  const response: LockEscrowOutput = {
    success: true,
    amount: updated.terms.amountMinor,
    currency: updated.terms.currency,
    stripe_pi_id: updated.stripePaymentIntentId ?? stubPaymentIntentId,
    expires_at: expiresAt,
  };
  return NextResponse.json(response);
}
