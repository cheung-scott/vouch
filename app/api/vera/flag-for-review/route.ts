import { NextRequest, NextResponse } from "next/server";
import {
  FlagForReviewInputSchema,
  type FlagForReviewOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { guardDeal, requireRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = FlagForReviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // NEW-1: authenticate before touching the deal. Accepts the party token
  // from the deal link (browser) or the Vera service secret (ConvAI).
  const auth = await guardDeal(req, parsed.data.deal_id);
  if ("response" in auth) return auth.response;
  const wrongParty = requireRole(auth.principal, "SELLER");
  if (wrongParty) return wrongParty;

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }
  await dealStore.update(deal.id, {
    status: "REVIEWING",
    terms: {
      ...deal.terms,
      notes: deal.terms.notes
        ? `${deal.terms.notes}; flag: ${parsed.data.reason}`
        : `flag: ${parsed.data.reason}`,
    },
  });

  const response: FlagForReviewOutput = {
    success: true,
    reviewer_will_contact_by: new Date(
      Date.now() + 1000 * 60 * 60 * 24,
    ).toISOString(),
  };
  return NextResponse.json(response);
}
