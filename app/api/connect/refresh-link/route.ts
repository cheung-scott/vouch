import { NextRequest, NextResponse } from "next/server";
import {
  createAccountOnboardingLink,
  sanitizeStripeError,
} from "@/lib/stripe";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("account");
  if (!accountId || !accountId.startsWith("acct_")) {
    return NextResponse.json({ error: "invalid_account" }, { status: 400 });
  }

  const deals = await dealStore.list();
  const owned = deals.some((d) => d.seller.stripeAccountId === accountId);
  if (!owned) {
    return NextResponse.json({ error: "account_not_recognized" }, { status: 404 });
  }

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
