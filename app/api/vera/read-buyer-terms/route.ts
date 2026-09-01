import { NextRequest, NextResponse } from "next/server";
import {
  ReadBuyerTermsInputSchema,
  type ReadBuyerTermsOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { guardDeal, requireRole } from "@/lib/auth";
import { composeBuyerTermsRecitation } from "@/lib/vera-contract";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReadBuyerTermsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!parsed.data.deal_id) {
    return NextResponse.json(
      { error: "missing_deal_id" },
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

  // Allow DRAFT deals (buyer's commit_buyer_side may not have fired if the
  // session ended early). The seller can still review whatever was captured.
  // Reject only if the deal has no captured item AND no amount — nothing to read.
  if (!deal.terms.item && !deal.terms.amountMinor) {
    return NextResponse.json(
      { error: "no_terms_captured" },
      { status: 409 },
    );
  }

  const response: ReadBuyerTermsOutput = {
    spoken_text: composeBuyerTermsRecitation(deal),
  };
  return NextResponse.json(response);
}
