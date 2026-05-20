import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const QuerySchema = z.object({
  account_id: z.string().startsWith("acct_"),
});

/**
 * Vouch reputation accumulator — counts deals per seller Stripe Connect
 * account ID. The acct_… is the persistent seller identity in v1 (no
 * separate Vouch accounts yet), so this is the natural rep key.
 *
 * Public endpoint — the stats themselves are not sensitive (same surface
 * area as eBay's "1,247 transactions" display).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse(
    Object.fromEntries(url.searchParams.entries()),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { account_id } = parsed.data;

  // Pull all deals + filter in memory. v1 scale is hackathon test data —
  // this is fine. v2 would index by stripeAccountId in Redis / Postgres.
  const allDeals = await dealStore.list();
  const sellerDeals = allDeals.filter(
    (d) => d.seller.stripeAccountId === account_id,
  );

  // Status taxonomy from types/deal.ts:
  //   DRAFT / AWAITING_SELLER / AGREED  → in-flight
  //   IN_ESCROW                          → money held, awaiting receipt
  //   RELEASED                           → COMPLETED (success)
  //   DISPUTED / REVIEWING               → contested
  //   REFUNDED                           → completed against the seller
  //   CANCELLED                          → aborted before money moved
  const completed = sellerDeals.filter((d) => d.status === "RELEASED").length;
  const refunded = sellerDeals.filter((d) => d.status === "REFUNDED").length;
  const inFlight = sellerDeals.filter((d) =>
    ["DRAFT", "AWAITING_SELLER", "AGREED", "IN_ESCROW"].includes(d.status),
  ).length;
  const disputed = sellerDeals.filter((d) =>
    ["DISPUTED", "REVIEWING"].includes(d.status),
  ).length;
  const totalCompletedOrLost = completed + refunded;
  const total = sellerDeals.length;

  // Dispute rate: refunded / (refunded + completed). Disputes that resolve
  // in the seller's favour count as completed; refunds count as "lost".
  // Returns 0 when there's no completed history yet.
  const disputeRate =
    totalCompletedOrLost > 0 ? refunded / totalCompletedOrLost : 0;

  const totalAmountMinor = sellerDeals
    .filter((d) => d.status === "RELEASED")
    .reduce((sum, d) => sum + (d.terms.amountMinor ?? 0), 0);

  return NextResponse.json({
    account_id,
    completed,
    refunded,
    in_flight: inFlight,
    disputed,
    total,
    dispute_rate: disputeRate,
    total_amount_minor: totalAmountMinor,
    new_to_vouch: total === 0,
  });
}
