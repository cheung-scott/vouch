import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cancelEscrow } from "@/lib/stripe";

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
    const pi = await cancelEscrow(parsed.data.payment_intent_id);
    return NextResponse.json({
      payment_intent_id: pi.id,
      status: pi.status,
      cancellation_reason: pi.cancellation_reason,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 },
    );
  }
}
