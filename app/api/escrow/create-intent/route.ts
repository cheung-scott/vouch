import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createEscrowPaymentIntent,
  calculatePlatformFee,
  sanitizeStripeError,
} from "@/lib/stripe";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";

const BodySchema = z.object({
  deal_id: z.string().min(1),
  amount_minor: z.number().int().positive(),
  currency: z
    .string()
    .transform((s) => s.toLowerCase())
    .pipe(z.enum(["gbp", "usd", "eur"])),
  seller_account_id: z.string().startsWith("acct_"),
  buyer_customer_id: z.string().optional(),
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

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }
  if (
    deal.seller.stripeAccountId &&
    deal.seller.stripeAccountId !== parsed.data.seller_account_id
  ) {
    return NextResponse.json(
      { error: "seller_account_mismatch" },
      { status: 403 },
    );
  }

  try {
    const pi = await createEscrowPaymentIntent({
      amountMinor: parsed.data.amount_minor,
      currency: parsed.data.currency,
      sellerAccountId: parsed.data.seller_account_id,
      buyerCustomerId: parsed.data.buyer_customer_id,
      dealId: parsed.data.deal_id,
    });
    return NextResponse.json({
      payment_intent_id: pi.id,
      client_secret: pi.client_secret,
      status: pi.status,
      amount: pi.amount,
      application_fee_amount: calculatePlatformFee(parsed.data.amount_minor),
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
