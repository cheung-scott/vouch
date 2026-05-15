import { NextRequest, NextResponse } from "next/server";
import {
  ExtractCounterInputSchema,
  type ExtractCounterOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { extractTermsFromUtterance } from "@/lib/vera-extract";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ExtractCounterInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const extracted = extractTermsFromUtterance(parsed.data.changes);

  if (parsed.data.deal_id) {
    const deal = await dealStore.get(parsed.data.deal_id);
    if (deal) {
      const counterTerms = { ...deal.terms };
      if (extracted.amount_minor)
        counterTerms.amountMinor = extracted.amount_minor;
      if (extracted.currency) counterTerms.currency = extracted.currency;
      if (extracted.delivery_method)
        counterTerms.deliveryMethod = extracted.delivery_method;
      if (extracted.notes)
        counterTerms.notes = counterTerms.notes
          ? `${counterTerms.notes}; counter: ${extracted.notes}`
          : `counter: ${extracted.notes}`;
      await dealStore.update(deal.id, {
        terms: counterTerms,
        status: "DRAFT",
      });
    }
  }

  const response: ExtractCounterOutput = {
    counter_terms: {
      item: extracted.item,
      quantity: extracted.quantity,
      condition: extracted.condition,
      amount: extracted.amount_minor,
      currency: extracted.currency,
      deadline: extracted.deadline_hint,
      delivery_method: extracted.delivery_method,
      notes: extracted.notes,
    },
  };
  return NextResponse.json(response);
}
