import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dealStore } from "@/lib/deals";

const InputSchema = z.object({
  deal_id: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
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

  const base = process.env.APP_URL ?? "http://localhost:3000";
  const link = `${base}/deal/${deal.reference}/seller`;

  const method: "email" | "sms" | "none" = deal.seller.email
    ? "email"
    : deal.seller.phone
      ? "sms"
      : "none";

  if (method === "email") {
    console.log(
      `[notify] would email ${deal.seller.email}: "${deal.buyer.firstName} set up a Vouch deal with you. Listen + confirm here: ${link}"`,
    );
  } else if (method === "sms") {
    console.log(
      `[notify] would SMS ${deal.seller.phone}: "Vouch: ${deal.buyer.firstName} set up a deal with you. ${link}"`,
    );
  } else {
    console.warn(
      `[notify] deal ${deal.reference}: no seller email or phone — buyer must share link manually: ${link}`,
    );
  }

  return NextResponse.json({ success: true, method, link });
}
