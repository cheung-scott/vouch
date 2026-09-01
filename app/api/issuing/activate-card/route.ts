import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dealStore } from "@/lib/deals";
import { guardDeal } from "@/lib/auth";
import {
  activateIssuingCard,
  cancelIssuingCard,
  sanitizeStripeError,
} from "@/lib/stripe";

/**
 * POST /api/issuing/activate-card
 *
 * Day 4 PM scaffold. Triggered from the release_escrow Vera tool route after
 * voice-confirmed receipt. Unfreezes the seller's escrow card so they can
 * spend the held amount.
 *
 * Also handles the cancellation path via `?action=cancel` — called from
 * cancel_escrow when a deal is voided / refunded. Cancelled cards cannot
 * be re-activated.
 *
 * State machine guards:
 *   - deal must exist
 *   - deal must have a stripeIssuingCardId (i.e. mint-escrow-card was called)
 *   - card must currently be in "frozen" state for activation, OR
 *     deal must be in DISPUTED / CANCELLED state for cancellation
 */

const InputSchema = z.object({
  deal_id: z.string().min(1),
  action: z.enum(["activate", "cancel"]).default("activate"),
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
  if (!deal.stripeIssuingCardId) {
    return NextResponse.json(
      { error: "no_card_minted", current_status: deal.status },
      { status: 409 },
    );
  }

  const action = parsed.data.action;

  // Status guards per action
  if (action === "activate") {
    if (deal.status !== "RELEASED") {
      return NextResponse.json(
        {
          error: "invalid_state_for_activation",
          current_status: deal.status,
          expected: "RELEASED",
        },
        { status: 409 },
      );
    }
    if (deal.stripeIssuingCardStatus !== "frozen") {
      return NextResponse.json(
        {
          error: "card_not_frozen",
          current_card_status: deal.stripeIssuingCardStatus,
        },
        { status: 409 },
      );
    }
  } else {
    // cancel
    if (!["DISPUTED", "REVIEWING", "CANCELLED"].includes(deal.status)) {
      return NextResponse.json(
        {
          error: "invalid_state_for_cancellation",
          current_status: deal.status,
        },
        { status: 409 },
      );
    }
  }

  try {
    if (action === "activate") {
      await activateIssuingCard(deal.stripeIssuingCardId);
      await dealStore.update(deal.id, { stripeIssuingCardStatus: "active" });
      return NextResponse.json({
        success: true,
        card_id: deal.stripeIssuingCardId,
        card_status: "active",
        action: "activated",
      });
    } else {
      await cancelIssuingCard(deal.stripeIssuingCardId);
      await dealStore.update(deal.id, { stripeIssuingCardStatus: "canceled" });
      return NextResponse.json({
        success: true,
        card_id: deal.stripeIssuingCardId,
        card_status: "canceled",
        action: "cancelled",
      });
    }
  } catch (err) {
    console.error("[issuing/activate-card] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 502 },
    );
  }
}
