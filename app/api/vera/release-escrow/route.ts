import { NextRequest, NextResponse } from "next/server";
import {
  ReleaseEscrowInputSchema,
  type ReleaseEscrowOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReleaseEscrowInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-1): call releaseEscrow() with stored payment_intent_id
  const response: ReleaseEscrowOutput = {
    success: true,
    transfer_id: "tr_stub",
    amount: 0,
    currency: "GBP",
    settles_by: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
  };
  return NextResponse.json(response);
}
