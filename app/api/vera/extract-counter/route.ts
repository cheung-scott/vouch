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
      // Accept AWAITING_SELLER (true counter-offer) AND DRAFT (the SELLER_
      // ONBOARDING fulfilment-capture flow can call this multiple times in
      // sequence for delivery_method → dispatch deadline → acceptance window,
      // and the first call used to downgrade to DRAFT, blocking subsequent
      // calls with 409 invalid_state. Both states are now valid entry points.
      const allowedStates = ["AWAITING_SELLER", "DRAFT"];
      if (!allowedStates.includes(deal.status)) {
        return NextResponse.json(
          { error: "invalid_state", current_status: deal.status },
          { status: 409 },
        );
      }
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
      // Only downgrade to DRAFT if the change actually affects buyer-visible
      // terms (amount/currency). Pure fulfilment additions (delivery_method,
      // notes-only acceptance window) shouldn't downgrade — the seller is
      // ADDING required logistics, not countering financial terms.
      const isCounterOfferOnFinancials =
        extracted.amount_minor || extracted.currency;
      await dealStore.update(deal.id, {
        terms: counterTerms,
        ...(isCounterOfferOnFinancials ? { status: "DRAFT" as const } : {}),
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
