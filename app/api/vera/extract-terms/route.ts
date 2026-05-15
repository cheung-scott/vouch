import { NextRequest, NextResponse } from "next/server";
import {
  ExtractTermsInputSchema,
  type ExtractTermsOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { extractTermsFromUtterance } from "@/lib/vera-extract";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ExtractTermsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const extracted = extractTermsFromUtterance(parsed.data.user_input);

  if (parsed.data.deal_id) {
    const deal = await dealStore.get(parsed.data.deal_id);
    if (deal) {
      const nextTerms = { ...deal.terms };
      if (extracted.item && !nextTerms.item) nextTerms.item = extracted.item;
      if (extracted.quantity) nextTerms.quantity = extracted.quantity;
      if (extracted.amount_minor) nextTerms.amountMinor = extracted.amount_minor;
      if (extracted.currency) nextTerms.currency = extracted.currency;
      if (extracted.delivery_method)
        nextTerms.deliveryMethod = extracted.delivery_method;
      if (extracted.deadline_hint && !nextTerms.deadline)
        nextTerms.notes = `${nextTerms.notes ? nextTerms.notes + "; " : ""}deadline: ${extracted.deadline_hint}`;
      if (extracted.notes)
        nextTerms.notes = nextTerms.notes
          ? `${nextTerms.notes}; ${extracted.notes}`
          : extracted.notes;

      const sellerUpdate =
        extracted.counterparty_name ||
        extracted.counterparty_email ||
        extracted.counterparty_phone
          ? {
              ...deal.seller,
              firstName:
                extracted.counterparty_name?.split(" ")[0] ??
                deal.seller.firstName,
              email: extracted.counterparty_email ?? deal.seller.email,
              phone: extracted.counterparty_phone ?? deal.seller.phone,
            }
          : null;

      await dealStore.update(deal.id, {
        terms: nextTerms,
        ...(sellerUpdate ? { seller: sellerUpdate } : {}),
      });
    }
  }

  const response: ExtractTermsOutput = {
    terms: {
      item: extracted.item,
      quantity: extracted.quantity,
      condition: extracted.condition,
      counterparty:
        extracted.counterparty_name ??
        extracted.counterparty_email ??
        extracted.counterparty_phone,
      amount: extracted.amount_minor,
      currency: extracted.currency,
      deadline: extracted.deadline_hint,
      delivery_method: extracted.delivery_method,
      notes: extracted.notes,
    },
  };
  return NextResponse.json(response);
}
