import { NextRequest, NextResponse } from "next/server";
import {
  GatherDisputeEvidenceInputSchema,
  type GatherDisputeEvidenceOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = GatherDisputeEvidenceInputSchema.safeParse(body);
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

  const deal = await dealStore.get(parsed.data.deal_id);
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }
  const note = `dispute evidence ${new Date().toISOString()}: ${parsed.data.user_summary}`;
  await dealStore.update(deal.id, {
    terms: {
      ...deal.terms,
      notes: deal.terms.notes ? `${deal.terms.notes}; ${note}` : note,
    },
  });

  const response: GatherDisputeEvidenceOutput = { success: true };
  return NextResponse.json(response);
}
