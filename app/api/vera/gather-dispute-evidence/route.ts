import { NextRequest, NextResponse } from "next/server";
import {
  GatherDisputeEvidenceInputSchema,
  type GatherDisputeEvidenceOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = GatherDisputeEvidenceInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-4): append user_summary + uploaded media URLs to Dispute.evidenceUrls
  const response: GatherDisputeEvidenceOutput = { success: true };
  return NextResponse.json(response);
}
