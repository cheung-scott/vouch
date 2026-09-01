import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";
import {
  createIssuingCardholder,
  mintEscrowCard,
  sanitizeStripeError,
} from "@/lib/stripe";
import { toStripeCurrency } from "@/types/deal";

/**
 * POST /api/issuing/mint-escrow-card
 *
 * Day 4 PM scaffold. Triggered from the lock_escrow Vera tool route after
 * the PaymentIntent successfully captures the buyer's funds. Mints a FROZEN
 * virtual card for the seller, sized to the escrow amount.
 *
 * Lifecycle:
 *   IN_ESCROW (PI authorised)  →  mintEscrowCard (status: frozen)
 *   RELEASED  (voice receipt)  →  activateIssuingCard (status: active)
 *   CANCELLED (refund / void)  →  cancelIssuingCard  (status: canceled)
 *
 * State machine guards:
 *   - deal must exist
 *   - deal must be in IN_ESCROW status (no early mint, no double-mint)
 *   - deal must NOT already have stripeIssuingCardId set (idempotency)
 */

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

  // NEW-1: this route moves money. Authenticate before touching the deal.
  const auth = await guardDeal(req, parsed.data.deal_id);
  if ("response" in auth) return auth.response;

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
  if (deal.stripeIssuingCardId) {
    // Idempotent — return the existing card reference
    return NextResponse.json({
      success: true,
      card_id: deal.stripeIssuingCardId,
      card_status: deal.stripeIssuingCardStatus ?? "frozen",
      already_minted: true,
    });
  }

  try {
    // 1. Ensure a cardholder exists for the seller (per-deal cardholder).
    //    In production we'd cache cardholders per Stripe account ID; for
    //    hackathon scope we create one per deal — simpler invariants.
    const cardholder = await createIssuingCardholder({
      // Stripe Issuing requires a full legal name. Party schema only
      // has firstName, so test mode uses a placeholder surname. Production
      // should collect full legal name during Connect onboarding (per
      // Stripe-Full-Audit findings).
      fullName: `${deal.seller.firstName} Test`,
      email:
        deal.seller.email ?? `seller-${deal.reference.toLowerCase()}@vouch.fund`,
      phone: deal.seller.phone,
      billingAddress: {
        // `address_full_match` is Stripe's test-mode magic value that
        // passes all KYC address checks. Production should take the
        // verified address from the Stripe Connect account.
        line1: "address_full_match",
        city: "London",
        postalCode: "EC1A 1BB",
        country: "GB",
      },
      dealId: deal.id,
    });

    // 2. Mint the card, frozen, sized to the escrow amount.
    const card = await mintEscrowCard({
      cardholderId: cardholder.id,
      amountMinor: deal.terms.amountMinor,
      currency: toStripeCurrency(deal.terms.currency),
      dealId: deal.id,
    });

    // 3. Persist card references on the deal.
    await dealStore.update(deal.id, {
      stripeIssuingCardholderId: cardholder.id,
      stripeIssuingCardId: card.id,
      stripeIssuingCardStatus: "frozen",
    });

    return NextResponse.json({
      success: true,
      card_id: card.id,
      cardholder_id: cardholder.id,
      card_status: "frozen",
      amount_minor: deal.terms.amountMinor,
      currency: deal.terms.currency,
    });
  } catch (err) {
    console.error("[issuing/mint-escrow-card] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 502 },
    );
  }
}
