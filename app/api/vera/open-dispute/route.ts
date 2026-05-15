import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import {
  OpenDisputeInputSchema,
  type OpenDisputeOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = OpenDisputeInputSchema.safeParse(body);
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

  await dealStore.setStatus(deal.id, "DISPUTED");

  const response: OpenDisputeOutput = {
    success: true,
    dispute_id: `dsp_${randomUUID().replace(/-/g, "").slice(0, 12)}`,
    expected_resolution_time: "under 24 hours",
  };
  return NextResponse.json(response);
}
