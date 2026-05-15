import { NextRequest, NextResponse } from "next/server";
import {
  ReadBuyerTermsInputSchema,
  type ReadBuyerTermsOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReadBuyerTermsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-2): hydrate buyer-committed terms and recite to seller
  const response: ReadBuyerTermsOutput = {
    spoken_text:
      "The buyer's proposed terms will be recited here once the deal is hydrated.",
  };
  return NextResponse.json(response);
}
