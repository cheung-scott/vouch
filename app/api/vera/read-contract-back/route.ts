import { NextRequest, NextResponse } from "next/server";
import {
  ReadContractBackInputSchema,
  type ReadContractBackOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReadContractBackInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-2): hydrate Deal by deal_id and render the contract recitation
  const response: ReadContractBackOutput = {
    spoken_text:
      "Let me read this back. The full contract recitation will render here once the deal is hydrated.",
  };
  return NextResponse.json(response);
}
