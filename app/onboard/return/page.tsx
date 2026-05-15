import Link from "next/link";

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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(
      `${appUrl}/api/connect/account-status?account=${accountId}`,
      { cache: "no-store" },
    );
    if (!res.ok) return { error: await res.text() };
    return (await res.json()) as AccountStatus;
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown" };
  }
}

export default async function OnboardReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ account?: string }>;
}) {
  const params = await searchParams;
  const accountId = params.account;

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="w-full max-w-md">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
          Vouch · Onboarding complete
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
          You&rsquo;re <span className="italic text-[#5266eb]">back</span>.
        </h1>

        <pre className="mt-8 overflow-auto rounded-md border border-[rgba(50,30,5,0.10)] bg-white p-4 font-mono text-[11px]">
          {JSON.stringify(status, null, 2)}
        </pre>

        <Link
          href="/onboard"
          className="mt-6 inline-block text-sm text-[#5266eb] underline"
        >
          ← Back to onboarding
        </Link>
      </div>
    </main>
  );
}
