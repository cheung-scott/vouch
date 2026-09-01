import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cancelEscrow, sanitizeStripeError } from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";
import { revokeEscrowCard } from "@/lib/escrow-card";

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
  if (!["AGREED", "IN_ESCROW"].includes(deal.status)) {
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
    const pi = await cancelEscrow(parsed.data.payment_intent_id);
    return NextResponse.json({
      payment_intent_id: pi.id,
      status: pi.status,
      cancellation_reason: pi.cancellation_reason,
    });
  } catch (err) {
    console.error("[escrow.cancel] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
