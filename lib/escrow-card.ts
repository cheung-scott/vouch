import { cancelIssuingCard, sanitizeStripeError } from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import type { Deal } from "@/types/deal";

export type RevokeResult =
  | { ok: true; revoked: boolean }
  | { ok: false; code?: string };

/**
 * Kills the escrow Issuing card before money moves back to the buyer.
 *
 * Finding NEW-2: every refund and cancel path used to leave the card live.
 * The card is minted against Vouch's OWN Issuing balance (finding D1), so a
 * live card plus a completed refund pays out twice — once to the buyer via
 * Stripe, once to the seller via a card Vouch is funding.
 *
 * Deliberately NOT fail-soft. The rest of the Issuing lifecycle treats card
 * operations as "a bonus" and swallows errors, which is fine when the failure
 * only costs a perk. Here the failure costs money, so a card that exists and
 * refuses to cancel must block the refund rather than let both payouts land.
 * A deal with no card at all is the normal path and returns cleanly.
 */
export async function revokeEscrowCard(deal: Deal): Promise<RevokeResult> {
  if (!deal.stripeIssuingCardId) return { ok: true, revoked: false };
  if (deal.stripeIssuingCardStatus === "canceled") {
    return { ok: true, revoked: false };
  }

  try {
    await cancelIssuingCard(deal.stripeIssuingCardId);
  } catch (err) {
    const { code } = sanitizeStripeError(err);
    console.error("[escrow-card] cancelIssuingCard failed", {
      dealId: deal.id,
      cardId: deal.stripeIssuingCardId,
      code,
    });
    return { ok: false, code };
  }

  await dealStore.update(deal.id, { stripeIssuingCardStatus: "canceled" });
  return { ok: true, revoked: true };
}
