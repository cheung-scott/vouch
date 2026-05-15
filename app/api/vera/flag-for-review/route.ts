import { NextRequest, NextResponse } from "next/server";
import {
  FlagForReviewInputSchema,
  type FlagForReviewOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = FlagForReviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (parsed.data.deal_id) {
    const deal = await dealStore.get(parsed.data.deal_id);
    if (deal) {
      await dealStore.update(deal.id, {
        status: "REVIEWING",
        terms: {
          ...deal.terms,
          notes: deal.terms.notes
            ? `${deal.terms.notes}; flag: ${parsed.data.reason}`
            : `flag: ${parsed.data.reason}`,
        },
      });
    }
  }

  const response: FlagForReviewOutput = {
    success: true,
    reviewer_will_contact_by: new Date(
      Date.now() + 1000 * 60 * 60 * 24,
    ).toISOString(),
  };
  return NextResponse.json(response);
}
