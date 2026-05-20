import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { dealStore } from "@/lib/deals";
import { Eyebrow } from "@/components/ui";

type AccountStatus = {
  id: string;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements_currently_due: string[];
};

async function fetchStatus(
  accountId: string,
): Promise<AccountStatus | { error: string }> {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return {
      id: account.id,
      details_submitted: account.details_submitted ?? false,
      charges_enabled: account.charges_enabled ?? false,
      payouts_enabled: account.payouts_enabled ?? false,
      requirements_currently_due: account.requirements?.currently_due ?? [],
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}

export default async function OnboardReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string; deal_id?: string }>;
}) {
  const params = await searchParams;
  const accountId = params.account;
  const dealId = params.deal_id;

  if (!accountId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f2] px-6">
        <p className="text-sm text-[#5a5548]">No account specified.</p>
        <Link
          href="/onboard"
          className="mt-4 text-sm text-[#5266eb] underline"
        >
          Back to onboarding
        </Link>
      </main>
    );
  }

  const status = await fetchStatus(accountId);

  // If a deal_id was carried through and onboarding succeeded, look up the
  // deal's reference so we can offer a return-to-flow link.
  //
  // SECURITY (T1 B-1, fixed): we previously wrote `accountId` from the URL
  // onto the deal's `seller.stripeAccountId` here as "belt-and-braces
  // persistence." That was an attacker-controlled write — anyone with a
  // valid deal_id could craft `/onboard/return?account=acct_<attacker>&
  // deal_id=<uuid>` and re-route the escrow destination before lock-escrow
  // ran. The canonical persistence is in /api/connect/create-account (which
  // requires the seller to actually start onboarding); this page is now
  // read-only and only exposes the dealReference for the "Continue to the
  // deal" link.
  let dealReference: string | null = null;
  if (
    dealId &&
    "charges_enabled" in status &&
    status.charges_enabled
  ) {
    const deal = await dealStore.get(dealId);
    // Only offer the continue link if the deal's seller account ACTUALLY
    // matches the URL account — i.e. create-account persisted this value
    // properly. If they don't match, it's either an attacker probing or a
    // stale URL; either way, don't reveal the deal.
    if (deal && deal.seller.stripeAccountId === accountId) {
      dealReference = deal.reference;
    }
  }

  const isVerified =
    "charges_enabled" in status &&
    status.charges_enabled &&
    status.payouts_enabled &&
    status.details_submitted;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="w-full max-w-md">
        <Eyebrow>
          Vouch · {isVerified ? "You're verified" : "Almost there"}
        </Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
          {isVerified ? (
            <>
              You&rsquo;re <span className="italic text-[#5266eb]">in</span>.
            </>
          ) : (
            <>
              Nearly <span className="italic text-[#5266eb]">there</span>.
            </>
          )}
        </h1>
        <p className="mt-4 text-sm text-[#5a5548]">
          {isVerified
            ? "Stripe has verified your identity and bank account. You can now receive payouts from buyers."
            : "Stripe needs a few more details before you can accept funds."}
        </p>

        {"charges_enabled" in status && (
          <div className="mt-8 grid grid-cols-3 gap-2">
            <StatusChip ok={status.details_submitted} label="Identity" />
            <StatusChip ok={status.charges_enabled} label="Payments" />
            <StatusChip ok={status.payouts_enabled} label="Payouts" />
          </div>
        )}

        {"error" in status && (
          <div className="mt-8 rounded-md border border-[rgba(181,74,58,0.4)] bg-[rgba(181,74,58,0.08)] p-3 font-mono text-xs text-[#b54a3a]">
            Couldn&rsquo;t fetch account status: {status.error}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {dealReference && (
            <Link
              href={`/deal/${dealReference}/signoff`}
              className="rounded-md bg-[#635bff] px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
            >
              Continue to joint sign-off →
            </Link>
          )}
          {!dealReference && isVerified && (
            <Link
              href="/"
              className="rounded-md bg-[#635bff] px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
            >
              Back to Vouch →
            </Link>
          )}
          {!isVerified && (
            <Link
              href="/onboard"
              className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-5 py-3 text-center text-sm font-medium text-[#2a2924] hover:bg-[#efeee9]"
            >
              Continue onboarding
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

function StatusChip({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium ${
        ok
          ? "border-[rgba(50,150,90,0.3)] bg-[rgba(50,150,90,0.08)] text-[#2f7a4e]"
          : "border-[rgba(50,30,5,0.12)] bg-white text-[#8a8478]"
      }`}
    >
      <span className="text-base leading-none">{ok ? "✓" : "•"}</span>
      <span>{label}</span>
    </div>
  );
}
