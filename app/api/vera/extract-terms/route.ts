import { NextRequest, NextResponse } from "next/server";
import {
  ExtractTermsInputSchema,
  type ExtractTermsOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ExtractTermsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-2): run LLM extraction over `user_input` and merge into Deal.terms
  const response: ExtractTermsOutput = {
    terms: {
      item: undefined,
      quantity: undefined,
      condition: undefined,
      counterparty: undefined,
      amount: undefined,
      currency: undefined,
      deadline: undefined,
      delivery_method: undefined,
      notes: undefined,
    },
  };
  return NextResponse.json(response);
}
