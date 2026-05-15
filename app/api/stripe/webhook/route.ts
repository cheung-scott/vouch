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

  // TODO(day-1): branch on event.type for the Vouch lifecycle events:
  //   - identity.verification_session.verified  → mark Party.identityVerified = true
  //   - account.updated                         → reflect Connect onboarding state
  //   - payment_intent.amount_capturable_updated → Deal.status → IN_ESCROW
  //   - payment_intent.succeeded                → Deal.status → RELEASED
  //   - payment_intent.canceled                 → Deal.status → CANCELLED
  //   - charge.dispute.created                  → Deal.status → DISPUTED
  switch (event.type) {
    default:
      break;
  }

  return NextResponse.json({ received: true, type: event.type });
}
