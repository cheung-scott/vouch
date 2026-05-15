import { NextRequest, NextResponse } from "next/server";
import {
  CommitSellerSideInputSchema,
  type CommitSellerSideOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = CommitSellerSideInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-2): persist seller commitment, advance Deal.status → AGREED
  const response: CommitSellerSideOutput = {
    success: true,
    deal_id: parsed.data.deal_id ?? "stub_deal",
  };
  return NextResponse.json(response);
}
