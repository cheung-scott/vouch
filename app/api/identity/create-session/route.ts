import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createIdentityVerificationSession,
  sanitizeStripeError,
} from "@/lib/stripe";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email(),
  deal_id: z.string().optional(),
  party_role: z.enum(["BUYER", "SELLER"]).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const session = await createIdentityVerificationSession({
      email: parsed.data.email,
      metadata: {
        ...(parsed.data.deal_id ? { vouch_deal_id: parsed.data.deal_id } : {}),
        ...(parsed.data.party_role
          ? { vouch_party_role: parsed.data.party_role }
          : {}),
      },
    });
    return NextResponse.json({
      session_id: session.id,
      client_secret: session.client_secret,
      url: session.url,
      status: session.status,
    });
  } catch (err) {
    console.error("[identity.create-session] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
