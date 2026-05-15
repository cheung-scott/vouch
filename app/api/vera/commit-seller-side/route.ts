import { NextRequest, NextResponse } from "next/server";
import {
  CommitSellerSideInputSchema,
  type CommitSellerSideOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = CommitSellerSideInputSchema.safeParse(body);
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
  if (deal.status !== "AWAITING_SELLER") {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }

  const committedAt = new Date().toISOString();
  const updated = await dealStore.update(deal.id, {
    seller: { ...deal.seller, committedAt },
    status: "AGREED",
  });

  const response: CommitSellerSideOutput = {
    success: true,
    deal_id: updated.id,
  };
  return NextResponse.json(response);
}
