import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  deal_id: z.string().uuid(),
  account_id: z.string().startsWith("acct_"),
  seller_first_name: z.string().min(1).max(80).optional(),
});

/**
 * Dev-only utility to patch a deal's seller.stripeAccountId (and
 * optionally seller.firstName) without going through the live Stripe
 * Connect onboarding. Used during demo recording so lock_escrow can
 * succeed against a pre-onboarded test seller account.
 *
 * Owner-token gated — fail-closed if OWNER_TOKEN is unset or the
 * X-Owner-Token header doesn't match. Same security model as the
 * GET /api/deals list endpoint.
 */
export async function POST(req: NextRequest) {
  const ownerToken = process.env.OWNER_TOKEN;
  if (!ownerToken) {
    return NextResponse.json(
      { error: "endpoint_disabled" },
      { status: 403 },
    );
  }
  const provided = req.headers.get("x-owner-token");
  if (provided !== ownerToken) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
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

  const updated = await dealStore.update(deal.id, {
    seller: {
      ...deal.seller,
      stripeAccountId: parsed.data.account_id,
      ...(parsed.data.seller_first_name
        ? { firstName: parsed.data.seller_first_name }
        : {}),
    },
  });

  return NextResponse.json({
    success: true,
    deal_id: updated.id,
    seller: {
      stripeAccountId: updated.seller.stripeAccountId,
      firstName: updated.seller.firstName,
    },
  });
}
