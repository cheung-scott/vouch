import { NextRequest, NextResponse } from "next/server";
import {
  ExtractCounterInputSchema,
  type ExtractCounterOutput,
} from "@/types/vera";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ExtractCounterInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // TODO(day-2): diff `changes` against current terms to produce counter_terms
  const response: ExtractCounterOutput = {
    counter_terms: {
      item: undefined,
      quantity: undefined,
      condition: undefined,
      amount: undefined,
      currency: undefined,
      deadline: undefined,
      delivery_method: undefined,
      notes: undefined,
    },
  };
  return NextResponse.json(response);
}
