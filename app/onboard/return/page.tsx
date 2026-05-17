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
  // deal's reference so we can offer a return-to-flow link. Belt-and-braces:
  // if the seller.stripeAccountId isn't already set on the deal (shouldn't
  // happen post-fix to create-account), persist it now.
  let dealReference: string | null = null;
  if (
    dealId &&
    "charges_enabled" in status &&
    status.charges_enabled
  ) {
    const deal = await dealStore.get(dealId);
    if (deal) {
      dealReference = deal.reference;
      if (deal.seller.stripeAccountId !== accountId) {
        await dealStore.update(deal.id, {
          seller: { ...deal.seller, stripeAccountId: accountId },
        });
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="w-full max-w-md">
        <Eyebrow>Vouch · Onboarding complete</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
          You&rsquo;re <span className="italic text-[#5266eb]">back</span>.
        </h1>

        <pre className="mt-8 overflow-auto rounded-md border border-[rgba(50,30,5,0.10)] bg-white p-4 font-mono text-[11px]">
          {JSON.stringify(status, null, 2)}
        </pre>

        {dealReference && (
          <Link
            href={`/deal/${dealReference}/seller`}
            className="mt-6 inline-block rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
          >
            Continue to the deal →
          </Link>
        )}

        <Link
          href="/onboard"
          className="mt-6 ml-3 inline-block text-sm text-[#5266eb] underline"
        >
          ← Back to onboarding
        </Link>
      </div>
    </main>
  );
}
