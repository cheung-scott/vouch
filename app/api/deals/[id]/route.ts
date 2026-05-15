import { NextRequest, NextResponse } from "next/server";
import { dealStore } from "@/lib/deals";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const byId = await dealStore.get(id);
  const deal = byId ?? (await dealStore.byReference(id.toUpperCase()));
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }

  // Strip PII (email, phone) and Stripe identifiers from the public response.
  // These fields are needed server-side only; the UI renders firstName + terms only.
  const publicDeal = {
    id: deal.id,
    reference: deal.reference,
    status: deal.status,
    terms: deal.terms,
    buyer: {
      role: deal.buyer.role,
      firstName: deal.buyer.firstName,
      identityVerified: deal.buyer.identityVerified,
      committedAt: deal.buyer.committedAt,
    },
    seller: {
      role: deal.seller.role,
      firstName: deal.seller.firstName,
      identityVerified: deal.seller.identityVerified,
      committedAt: deal.seller.committedAt,
    },
    veraSessionIds: deal.veraSessionIds,
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
    lockedAt: deal.lockedAt,
    releasedAt: deal.releasedAt,
  };
  return NextResponse.json({ deal: publicDeal });
}
