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
      // Surfaced (presence only — the acct_… ID itself is fine to expose
      // since it's not actionable without the platform's API key) so the
      // seller page can branch between "Connect bank" CTA and "Go to
      // sign-off" CTA when status is AGREED.
      stripeAccountId: deal.seller.stripeAccountId,
    },
    veraSessionIds: deal.veraSessionIds,
    // Vera's post-call analysis. Not sensitive — same surface area as the
    // public transcript pitch beat. Either may be undefined for deals
    // created before the post-call webhook was wired.
    veraSummary: deal.veraSummary,
    veraEvalResults: deal.veraEvalResults,
    createdAt: deal.createdAt,
    updatedAt: deal.updatedAt,
    lockedAt: deal.lockedAt,
    releasedAt: deal.releasedAt,
    // Issuing status only (NOT the card or cardholder IDs — those would
    // be a lookup vector against the Stripe API per the S-007 pattern).
    // The UI just needs to know the badge state.
    stripeIssuingCardStatus: deal.stripeIssuingCardStatus,
  };
  return NextResponse.json({ deal: publicDeal });
}
