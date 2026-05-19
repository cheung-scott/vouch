import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAccountSession, sanitizeStripeError } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  account_id: z.string().min(3).startsWith("acct_"),
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
    const session = await createAccountSession({
      accountId: parsed.data.account_id,
    });
    return NextResponse.json({ client_secret: session.client_secret });
  } catch (err) {
    console.error("[connect.account-session] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
