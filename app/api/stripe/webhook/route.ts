import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "webhook_misconfigured" },
      { status: 400 },
    );
  }

  const payload = await req.text();

  let event;
  try {
    event = constructWebhookEvent({ payload, signature, secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "signature_verification_failed", message },
      { status: 400 },
    );
  }

  // TODO(day-2): replace console logging with DB writes once Vercel KV is wired.
  switch (event.type) {
    case "identity.verification_session.verified": {
      const session = event.data.object;
      console.log(
        "[webhook] identity verified",
        session.id,
        session.metadata?.vouch_deal_id,
      );
      break;
    }
    case "identity.verification_session.requires_input":
    case "identity.verification_session.canceled": {
      const session = event.data.object;
      console.log(
        "[webhook] identity",
        event.type,
        session.id,
        session.last_error?.code,
      );
      break;
    }
    case "account.updated": {
      const account = event.data.object;
      console.log(
        "[webhook] account.updated",
        account.id,
        "charges_enabled=",
        account.charges_enabled,
        "details_submitted=",
        account.details_submitted,
      );
      break;
    }
    case "payment_intent.amount_capturable_updated": {
      const pi = event.data.object;
      console.log(
        "[webhook] escrow funded → IN_ESCROW",
        pi.id,
        pi.metadata?.vouch_deal_id,
      );
      break;
    }
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      console.log(
        "[webhook] escrow released → RELEASED",
        pi.id,
        pi.metadata?.vouch_deal_id,
      );
      break;
    }
    case "payment_intent.canceled": {
      const pi = event.data.object;
      console.log(
        "[webhook] escrow canceled → CANCELLED",
        pi.id,
        pi.metadata?.vouch_deal_id,
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const pi = event.data.object;
      console.log(
        "[webhook] payment failed",
        pi.id,
        pi.last_payment_error?.message,
      );
      break;
    }
    case "charge.dispute.created": {
      const dispute = event.data.object;
      console.log(
        "[webhook] charge dispute → DISPUTED",
        dispute.id,
        dispute.reason,
      );
      break;
    }
    case "transfer.created":
    case "transfer.updated": {
      const transfer = event.data.object;
      console.log("[webhook]", event.type, transfer.id, transfer.destination);
      break;
    }
    default:
      console.log("[webhook] unhandled event type:", event.type);
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}
