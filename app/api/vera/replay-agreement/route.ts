import { NextRequest, NextResponse } from "next/server";
import {
  ReplayAgreementInputSchema,
  type ReplayAgreementOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReplayAgreementInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-4): fetch locked contract for deal_id and recite verbatim
  const response: ReplayAgreementOutput = {
    spoken_text:
      "The originally agreed contract will be recited here once the deal is hydrated.",
  };
  return NextResponse.json(response);
}
