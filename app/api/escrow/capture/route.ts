import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { releaseEscrow } from "@/lib/stripe";

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

  try {
    const result = await releaseEscrow({
      paymentIntentId: parsed.data.payment_intent_id,
      dealId: parsed.data.deal_id,
    });
    return NextResponse.json({
      payment_intent_id: result.payment_intent.id,
      status: result.payment_intent.status,
      amount_captured: result.payment_intent.amount_received,
      transfer_id: result.transfer_id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 },
    );
  }
}
