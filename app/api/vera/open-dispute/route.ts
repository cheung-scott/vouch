import { NextRequest, NextResponse } from "next/server";
import {
  OpenDisputeInputSchema,
  type OpenDisputeOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = OpenDisputeInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-4): create Dispute, freeze Deal.status → DISPUTED, notify both parties
  const response: OpenDisputeOutput = {
    success: true,
    dispute_id: "dsp_stub",
    expected_resolution_time: "under 24 hours",
  };
  return NextResponse.json(response);
}
