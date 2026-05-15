import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const accountId = req.nextUrl.searchParams.get("account");
  if (!accountId) {
    return NextResponse.json({ error: "missing_account" }, { status: 400 });
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);
    return NextResponse.json({
      id: account.id,
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      requirements_currently_due: account.requirements?.currently_due ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json(
      { error: "stripe_error", message },
      { status: 500 },
    );
  }
}
