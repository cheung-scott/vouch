import { NextRequest, NextResponse } from "next/server";
import {
  CommitBuyerSideInputSchema,
  type CommitBuyerSideOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = CommitBuyerSideInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-2): persist buyer commitment, advance Deal.status → AWAITING_SELLER
  const response: CommitBuyerSideOutput = {
    success: true,
    deal_id: parsed.data.deal_id ?? "stub_deal",
  };
  return NextResponse.json(response);
}
