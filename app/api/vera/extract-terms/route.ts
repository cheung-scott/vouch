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

      // Guard against Vera's LLM misclassifying parts of the user utterance
      // as a counterparty name. The two common failure modes (seen 2026-05-20):
      //   1. Day-of-week mentions like "by Friday" → seller named "Friday"
      //   2. Overwriting an already-set seller (e.g. from extension prefill
      //      `mrclearances`) with a guess from later in the conversation
      // Filter both cases out here — Vera can still be wrong upstream, but
      // the deal record stays clean.
      const DAY_OF_WEEK = new Set([
        "monday", "tuesday", "wednesday", "thursday",
        "friday", "saturday", "sunday",
      ]);
      const MONTH = new Set([
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december",
      ]);
      const PLACEHOLDER_NAMES = new Set([
        "", "seller", "buyer", "the seller", "the buyer", "the other party",
      ]);
      const candidateName = extracted.counterparty_name?.split(" ")[0];
      const candidateLower = candidateName?.toLowerCase().trim() ?? "";
      const currentLower = (deal.seller.firstName ?? "").toLowerCase().trim();
      const candidateIsDateWord =
        DAY_OF_WEEK.has(candidateLower) || MONTH.has(candidateLower);
      const currentIsPlaceholder = PLACEHOLDER_NAMES.has(currentLower);
      const acceptNameUpdate =
        !!candidateName && !candidateIsDateWord && currentIsPlaceholder;

      const sellerUpdate =
        extracted.counterparty_name ||
        extracted.counterparty_email ||
        extracted.counterparty_phone
          ? {
              ...deal.seller,
              firstName: acceptNameUpdate
                ? candidateName
                : deal.seller.firstName,
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
