import { NextRequest, NextResponse } from "next/server";
import {
  LockEscrowInputSchema,
  type LockEscrowOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = LockEscrowInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-1): wire createEscrowPaymentIntent + capture_method=manual flow
  const response: LockEscrowOutput = {
    success: true,
    amount: 0,
    currency: "GBP",
    stripe_pi_id: "pi_stub",
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
  };
  return NextResponse.json(response);
}
