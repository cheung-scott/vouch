"use client";

// Force dynamic rendering — page reads useSearchParams() which Next.js 16
// requires either be Suspense-wrapped or rendered dynamically. Onboarding is
// interactive (Stripe Connect.js) so static prerender adds no value anyway.
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eyebrow } from "@/components/ui";
import { EmbeddedConnectOnboarding } from "@/components/EmbeddedConnectOnboarding";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; what: string }
  | {
      kind: "ok";
      what: string;
      accountId: string;
      onboardingUrl?: string;
    }
  | { kind: "error"; what: string; message: string };

export default function OnboardPage() {
  const searchParams = useSearchParams();
  const dealId = searchParams.get("deal_id") || undefined;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function startConnect() {
    setStatus({ kind: "loading", what: "connect" });
    try {
      const res = await fetch("/api/connect/create-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, country: "GB", deal_id: dealId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? "failed");
      // Embedded path: keep the seller on Vouch by rendering Stripe's
      // onboarding component inline below. The hosted `onboarding_url` is
      // retained as a fallback escape hatch if the embed fails to init.
      setStatus({
        kind: "ok",
        what: "connect",
        accountId: json.account_id,
        onboardingUrl: json.onboarding_url,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      setStatus({ kind: "error", what: "connect", message });
    }
  }

  const embedded = status.kind === "ok" && status.what === "connect";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="w-full max-w-md">
        <Eyebrow>Vouch · Day 1 onboarding harness</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
          Set up your <span className="italic text-[#5266eb]">account</span>.
        </h1>
        <p className="mt-4 text-sm text-[#5a5548]">
          Stripe Connect verification runs inside Vouch — you won&rsquo;t leave
          this page.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={embedded}
              className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-3 py-2 text-sm outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30 disabled:opacity-60"
            />
          </label>

          {!embedded && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={startConnect}
                disabled={!email || status.kind === "loading"}
                className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {status.kind === "loading" && status.what === "connect"
                  ? "Creating account..."
                  : "Start Stripe Connect Express onboarding →"}
              </button>
            </div>
          )}

          {status.kind === "error" && (
            <div className="mt-4 rounded-md border border-[rgba(181,74,58,0.4)] bg-[rgba(181,74,58,0.08)] p-3 font-mono text-xs text-[#b54a3a]">
              {status.what} error: {status.message}
            </div>
          )}

          {embedded && status.kind === "ok" && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
                Verification · {status.accountId}
              </p>
              <EmbeddedConnectOnboarding
                accountId={status.accountId}
                onExit={() => {
                  // Stripe Connect emits onExit when the seller finishes (or
                  // cancels) the embedded flow. Route to /onboard/return —
                  // it'll detect deal_id, write seller.stripeAccountId, and
                  // forward to the deal's signoff page.
                  const params = new URLSearchParams({
                    account: status.accountId,
                  });
                  if (dealId) params.set("deal_id", dealId);
                  window.location.href = `/onboard/return?${params.toString()}`;
                }}
              />
              {/* Manual escape hatch — Stripe's embedded onExit doesn't
                  always fire predictably on "Information submitted" screens
                  (the post-verification confirmation state). Visible button
                  lets the seller advance once they see Stripe say done. */}
              <a
                href={
                  dealId
                    ? `/onboard/return?account=${status.accountId}&deal_id=${dealId}`
                    : `/onboard/return?account=${status.accountId}`
                }
                className="mt-2 inline-block w-full rounded-md border border-[#5266eb] bg-white px-5 py-3 text-center text-sm font-medium text-[#5266eb] transition-colors hover:bg-[#5266eb] hover:text-white"
              >
                {dealId
                  ? "I'm done — continue to sign-off →"
                  : "I'm done — continue →"}
              </a>
              {status.onboardingUrl && (
                <a
                  href={status.onboardingUrl}
                  className="text-center text-xs text-[#8a8478] underline decoration-[rgba(50,30,5,0.20)] underline-offset-4 hover:text-[#5266eb]"
                >
                  Trouble loading? Continue on Stripe →
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
