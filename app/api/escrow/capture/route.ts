import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { releaseEscrow, sanitizeStripeError } from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";

export const runtime = "nodejs";

const BodySchema = z.object({
  payment_intent_id: z.string().startsWith("pi_"),
  deal_id: z.string().min(1),
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
  if (deal.status !== "IN_ESCROW") {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }
  if (deal.stripePaymentIntentId !== parsed.data.payment_intent_id) {
    return NextResponse.json(
      { error: "payment_intent_mismatch" },
      { status: 403 },
    );
  }

  try {
    const result = await releaseEscrow({
      paymentIntentId: parsed.data.payment_intent_id,
      dealId: parsed.data.deal_id,
    });
    return NextResponse.json({
      payment_intent_id: result.payment_intent.id,
      status: result.payment_intent.status,
      amount_captured: result.payment_intent.amount_received,
      charge_id: result.charge_id,
      transfer_id: result.transfer_id,
    });
  } catch (err) {
    console.error("[escrow.capture] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
