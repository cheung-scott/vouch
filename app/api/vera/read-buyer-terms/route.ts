import { NextRequest, NextResponse } from "next/server";
import {
  ReadBuyerTermsInputSchema,
  type ReadBuyerTermsOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
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

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }

  if (deal.status === "DRAFT") {
    return NextResponse.json(
      { error: "buyer_not_yet_committed" },
      { status: 409 },
    );
  }

  const response: ReadBuyerTermsOutput = {
    spoken_text: composeBuyerTermsRecitation(deal),
  };
  return NextResponse.json(response);
}
