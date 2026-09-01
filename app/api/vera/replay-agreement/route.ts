import { NextRequest, NextResponse } from "next/server";
import {
  ReplayAgreementInputSchema,
  type ReplayAgreementOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";
import { composeAgreementReplay } from "@/lib/vera-contract";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReplayAgreementInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!parsed.data.deal_id) {
    return NextResponse.json({ error: "missing_deal_id" }, { status: 400 });
  }

  // NEW-1: authenticate before touching the deal. Accepts the party token
  // from the deal link (browser) or the Vera service secret (ConvAI).
  const auth = await guardDeal(req, parsed.data.deal_id);
  if ("response" in auth) return auth.response;

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }

  const response: ReplayAgreementOutput = {
    spoken_text: composeAgreementReplay(deal),
  };
  return NextResponse.json(response);
}
