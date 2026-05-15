import { NextRequest, NextResponse } from "next/server";
import {
  FlagForReviewInputSchema,
  type FlagForReviewOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = FlagForReviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-4): set Deal.status → REVIEWING, notify human reviewer queue
  const response: FlagForReviewOutput = {
    success: true,
    reviewer_will_contact_by: new Date(
      Date.now() + 1000 * 60 * 60 * 24,
    ).toISOString(),
  };
  return NextResponse.json(response);
}
