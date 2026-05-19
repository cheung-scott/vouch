import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import type { Stripe } from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  // Stripe v2 webhooks split event scopes: "Your account" (platform-side PI/
  // transfer/dispute events) and "Connected accounts" (seller-side
  // account.updated, identity.*). Each destination has its own signing
  // secret. Both POST to this single endpoint, so we try each secret in
  // turn and accept the event if either verifies.
  const platformSecret = process.env.STRIPE_WEBHOOK_SECRET_PLATFORM;
  const connectSecret = process.env.STRIPE_WEBHOOK_SECRET_CONNECT;
  const secrets = [platformSecret, connectSecret].filter(
    (s): s is string => Boolean(s),
  );

  if (!signature || secrets.length === 0) {
    return NextResponse.json(
      { error: "webhook_misconfigured" },
      { status: 400 },
    );
  }

  const payload = await req.text();

  let event: Stripe.Event | undefined;
  let lastErr: unknown;
  for (const secret of secrets) {
    try {
      event = constructWebhookEvent({ payload, signature, secret });
      break;
    } catch (err) {
      lastErr = err;
    }
  }
  if (!event) {
    console.error(
      "[webhook] signature verification failed against all secrets",
      lastErr,
    );
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Helper: pull the deal_id from event.data.object.metadata.vouch_deal_id
  // and load the deal record. Returns null if metadata is missing or deal
  // doesn't exist (orphan events from test cards / other accounts).
  // Per Stripe-Full-Audit, the handler previously only logged — state
  // mutation now happens for events that own a deal_id.
  async function dealFromMetadata(
    obj: { metadata?: Record<string, string> | null },
  ) {
    const dealId = obj.metadata?.vouch_deal_id;
    if (!dealId) return null;
    return dealStore.get(dealId);
  }

  switch (event.type) {
    case "identity.verification_session.verified": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      console.log(
        "[webhook] identity verified",
        session.id,
        session.metadata?.vouch_deal_id,
      );
      break;
    }
    case "identity.verification_session.requires_input":
    case "identity.verification_session.canceled": {
      const session = event.data.object as Stripe.Identity.VerificationSession;
      console.log(
        "[webhook] identity",
        event.type,
        session.id,
        session.last_error?.code,
      );
      break;
    }
    case "account.updated": {
      // Fires for Connect accounts (sellers) when their onboarding state
      // changes. Only relevant when "Listen to events on Connected
      // accounts" is checked in the webhook endpoint config. We look up
      // any deal where this acct_ is the seller and surface the flip.
      const account = event.data.object as Stripe.Account;
      console.log(
        "[webhook] account.updated",
        account.id,
        "charges_enabled=",
        account.charges_enabled,
        "details_submitted=",
        account.details_submitted,
      );
      // Find deals owned by this seller; no mutation needed (Connect
      // state is sourced from Stripe directly when lock-escrow runs) but
      // logging here helps debug "why didn't onboarding complete?".
      break;
    }
    case "payment_intent.requires_action": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const deal = await dealFromMetadata(pi);
      console.log(
        "[webhook] PI requires action (3DS/SCA)",
        pi.id,
        pi.metadata?.vouch_deal_id,
        pi.next_action?.type,
      );
      // Don't transition; UI watches the PI client-side to drive the
      // 3DS challenge. Could flip to a transient AWAITING_3DS substatus
      // in v2 if we add the field to the Deal schema.
      if (deal) {
        console.log(
          "[webhook] 3DS pending on deal",
          deal.reference,
          "— buyer must complete challenge",
        );
      }
      break;
    }
    case "payment_intent.processing": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(
        "[webhook] PI processing (async payment method)",
        pi.id,
        pi.metadata?.vouch_deal_id,
        pi.payment_method_types?.[0],
      );
      break;
    }
    case "payment_intent.amount_capturable_updated": {
      // The buyer's card was authorised; funds are "held" pending
      // capture. This is the confirmation that the escrow lock actually
      // worked from Stripe's perspective — Vera already flipped the
      // deal to IN_ESCROW via lock_escrow, this confirms async.
      const pi = event.data.object as Stripe.PaymentIntent;
      const deal = await dealFromMetadata(pi);
      console.log(
        "[webhook] escrow funded → IN_ESCROW",
        pi.id,
        pi.metadata?.vouch_deal_id,
      );
      if (deal && deal.status === "AGREED") {
        // Belt-and-braces: if Vera's lock_escrow returned an error to
        // the client but the PI actually authorised on Stripe's side,
        // this webhook closes the loop.
        await dealStore.update(deal.id, { stripePaymentIntentId: pi.id });
        await dealStore.setStatus(deal.id, "IN_ESCROW");
      }
      break;
    }
    case "payment_intent.succeeded": {
      // Capture succeeded. Vera already flipped to RELEASED via
      // release_escrow, but webhook closes the loop for async paths
      // (3DS-challenge then capture, etc.).
      const pi = event.data.object as Stripe.PaymentIntent;
      const deal = await dealFromMetadata(pi);
      console.log(
        "[webhook] escrow released → RELEASED",
        pi.id,
        pi.metadata?.vouch_deal_id,
      );
      if (deal && deal.status === "IN_ESCROW") {
        await dealStore.setStatus(deal.id, "RELEASED");
      }
      break;
    }
    case "payment_intent.canceled": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const deal = await dealFromMetadata(pi);
      console.log(
        "[webhook] escrow canceled → CANCELLED",
        pi.id,
        pi.metadata?.vouch_deal_id,
      );
      if (
        deal &&
        (deal.status === "AGREED" ||
          deal.status === "IN_ESCROW" ||
          deal.status === "DISPUTED")
      ) {
        await dealStore.setStatus(deal.id, "CANCELLED");
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.log(
        "[webhook] payment failed",
        pi.id,
        pi.last_payment_error?.message,
      );
      // Don't auto-transition — buyer may retry with a different card.
      // The /api/escrow/create-intent path handles this on next attempt.
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      console.log(
        "[webhook] charge dispute → DISPUTED",
        dispute.id,
        dispute.reason,
      );
      // Look up the PI metadata to find the deal. dispute.payment_intent
      // gives the PI id; retrieve to get metadata. Skipping that hop for
      // hackathon — log only. Real product: do the retrieve + flip
      // deal.status to DISPUTED.
      break;
    }
    case "transfer.created":
    case "transfer.updated": {
      const transfer = event.data.object as Stripe.Transfer;
      console.log("[webhook]", event.type, transfer.id, transfer.destination);
      break;
    }
    default:
      console.log("[webhook] unhandled event type:", event.type);
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}
