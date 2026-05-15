import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createConnectExpressAccount,
  createAccountOnboardingLink,
} from "@/lib/stripe";

export const runtime = "nodejs";

const BodySchema = z.object({
  email: z.string().email(),
  country: z.string().length(2).optional(),
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const account = await createConnectExpressAccount({
      email: parsed.data.email,
      country: parsed.data.country,
    });

    const link = await createAccountOnboardingLink({
      accountId: account.id,
      returnUrl: `${appUrl}/onboard/return?account=${account.id}`,
      refreshUrl: `${appUrl}/api/connect/refresh-link?account=${account.id}`,
    });

    return NextResponse.json({
      account_id: account.id,
      onboarding_url: link.url,
      expires_at: link.expires_at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 },
    );
  }
}
