import { NextRequest, NextResponse } from "next/server";
import { createAccountOnboardingLink } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("account");
  if (!accountId) {
    return NextResponse.json({ error: "missing_account" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const link = await createAccountOnboardingLink({
      accountId,
      returnUrl: `${appUrl}/onboard/return?account=${accountId}`,
      refreshUrl: `${appUrl}/api/connect/refresh-link?account=${accountId}`,
    });
    return NextResponse.redirect(link.url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 },
    );
  }
}
