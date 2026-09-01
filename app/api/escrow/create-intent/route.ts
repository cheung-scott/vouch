import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createEscrowPaymentIntent,
  calculatePlatformFee,
  sanitizeStripeError,
} from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";
import { toStripeCurrency } from "@/types/deal";

export const runtime = "nodejs";

// Finding NEW-4. This route used to take `amount_minor`, `currency`,
// `seller_account_id` and `buyer_customer_id` from the request body. The
// destination guard only fired when `deal.seller.stripeAccountId` was already
// set, so on a deal whose seller had not onboarded, a caller could name ANY
// `acct_…` as the transfer destination and any amount they liked.
//
// Nothing about the money is client-supplied any more. The body carries a
// deal reference and nothing else; every value comes off the server-side deal.
const BodySchema = z.object({
  deal_id: z.string().min(1),
});

// A hold only makes sense before the money has moved. RELEASED / REFUNDED /
// CANCELLED / DISPUTED are past that point.
const FUNDABLE: readonly string[] = ["DRAFT", "AWAITING_SELLER", "AGREED"];

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
  if (!FUNDABLE.includes(deal.status)) {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }
  // No onboarded seller means there is no legitimate destination for the
  // funds. Refuse rather than fall through to a caller-supplied account.
  if (!deal.seller.stripeAccountId) {
    return NextResponse.json(
      { error: "seller_not_onboarded" },
      { status: 409 },
    );
  }
  if (deal.terms.amountMinor <= 0) {
    return NextResponse.json({ error: "no_agreed_amount" }, { status: 409 });
  }

  try {
    const pi = await createEscrowPaymentIntent({
      amountMinor: deal.terms.amountMinor,
      currency: toStripeCurrency(deal.terms.currency),
      sellerAccountId: deal.seller.stripeAccountId,
      buyerCustomerId: deal.buyer.stripeCustomerId,
      dealId: deal.id,
    });
    return NextResponse.json({
      payment_intent_id: pi.id,
      client_secret: pi.client_secret,
      status: pi.status,
      amount: pi.amount,
      application_fee_amount: calculatePlatformFee(deal.terms.amountMinor),
      currency: pi.currency,
    });
  } catch (err) {
    console.error("[escrow.create-intent] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
