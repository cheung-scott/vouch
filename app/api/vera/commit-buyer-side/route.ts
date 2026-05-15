import { NextRequest, NextResponse } from "next/server";
import {
  CommitBuyerSideInputSchema,
  type CommitBuyerSideOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = CommitBuyerSideInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (!parsed.data.deal_id) {
    return NextResponse.json({ error: "missing_deal_id" }, { status: 400 });
  }

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }

  const committedAt = new Date().toISOString();
  const updated = await dealStore.update(deal.id, {
    buyer: { ...deal.buyer, committedAt },
    status: "AWAITING_SELLER",
  });

  const response: CommitBuyerSideOutput = {
    success: true,
    deal_id: updated.id,
  };
  return NextResponse.json(response);
}
