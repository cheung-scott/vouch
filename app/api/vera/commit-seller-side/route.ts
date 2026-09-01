import { NextRequest, NextResponse } from "next/server";
import {
  CommitSellerSideInputSchema,
  type CommitSellerSideOutput,
} from "@/types/vera";
import { dealStore } from "@/lib/deals";
import { guardDeal, requireRole } from "@/lib/auth";

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
  if (deal.status !== "AWAITING_SELLER") {
    return NextResponse.json(
      { error: "invalid_state", current_status: deal.status },
      { status: 409 },
    );
  }

  // Persist the seller's first name if Vera passed one through (the seller
  // typed it on the intake page → flows in via {{user_first_name}} → into
  // the tool call body as seller_first_name). Without this, the deal
  // record keeps the placeholder name from buyer onboarding and the
  // signoff page renders "the other party" instead of e.g. "Marcus".
  // Don't accept placeholder / day-of-week / month strings (defence in
  // depth — extract-terms already guards but Vera could send a weird value).
  const PLACEHOLDER_NAMES = new Set([
    "", "seller", "buyer", "the seller", "the buyer", "the other party",
  ]);
  const DAY_OR_MONTH = new Set([
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ]);
  const candidateName = parsed.data.seller_first_name?.trim() ?? "";
  const candidateLower = candidateName.toLowerCase();
  const candidateIsBad =
    PLACEHOLDER_NAMES.has(candidateLower) || DAY_OR_MONTH.has(candidateLower);
  const currentLower = (deal.seller.firstName ?? "").toLowerCase().trim();
  const currentIsPlaceholder =
    PLACEHOLDER_NAMES.has(currentLower) ||
    /^[a-z0-9_-]{4,}$/.test(currentLower); // marketplace handles count as placeholder
  const acceptName =
    !!candidateName && !candidateIsBad && currentIsPlaceholder;

  const committedAt = new Date().toISOString();
  const updated = await dealStore.update(deal.id, {
    seller: {
      ...deal.seller,
      committedAt,
      ...(acceptName ? { firstName: candidateName } : {}),
    },
    status: "AGREED",
  });

  const response: CommitSellerSideOutput = {
    success: true,
    deal_id: updated.id,
  };
  return NextResponse.json(response);
}
