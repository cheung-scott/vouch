import { NextRequest, NextResponse } from "next/server";
import {
  createAccountOnboardingLink,
  sanitizeStripeError,
} from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("account");
  if (!accountId || !accountId.startsWith("acct_")) {
    return NextResponse.json({ error: "invalid_account" }, { status: 400 });
  }

  // Stripe redirects here when an onboarding link expires (15 min TTL).
  // Trust the acct_ prefix as the format guard — the older "is this
  // account owned by any deal in our store?" check returned 404 for
  // standalone /onboard test sessions (no deal yet) and for sellers whose
  // deal_id hadn't been persisted yet (pre-fix, every account). Stripe
  // research audit, May 17. Post-hackathon: re-add a session-bound check
  // once AuthN lands (S-103 §3).
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  try {
    const link = await createAccountOnboardingLink({
      accountId,
      returnUrl: `${appUrl}/onboard/return?account=${accountId}`,
      refreshUrl: `${appUrl}/api/connect/refresh-link?account=${accountId}`,
    });
    return NextResponse.redirect(link.url);
  } catch (err) {
    console.error("[connect.refresh-link] stripe error", err);
    return NextResponse.json(
      { error: "stripe_error", ...sanitizeStripeError(err) },
      { status: 500 },
    );
  }
}
