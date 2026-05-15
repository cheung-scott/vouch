import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createEscrowPaymentIntent,
  calculatePlatformFee,
} from "@/lib/stripe";

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
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 },
    );
  }
}
