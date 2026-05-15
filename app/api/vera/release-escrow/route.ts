import { NextRequest, NextResponse } from "next/server";
import {
  ReleaseEscrowInputSchema,
  type ReleaseEscrowOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = ReleaseEscrowInputSchema.safeParse(body);
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
  if (deal.status !== "IN_ESCROW") {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }

  // TODO(day-3): call releaseEscrow() against the real Stripe PI once keys present.
  const stubTransferId = `tr_stub_${deal.reference.toLowerCase()}`;
  const settlesBy = new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString();
  await dealStore.setStatus(deal.id, "RELEASED");
  const updated = await dealStore.update(deal.id, {
    stripeTransferId: deal.stripeTransferId ?? stubTransferId,
  });

  const response: ReleaseEscrowOutput = {
    success: true,
    transfer_id: updated.stripeTransferId ?? stubTransferId,
    amount: updated.terms.amountMinor,
    currency: updated.terms.currency,
    settles_by: settlesBy,
  };
  return NextResponse.json(response);
}
