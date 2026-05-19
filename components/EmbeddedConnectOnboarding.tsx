"use client";

import { useEffect, useState } from "react";
import { loadConnectAndInitialize } from "@stripe/connect-js";
import {
  ConnectComponentsProvider,
  ConnectAccountOnboarding,
} from "@stripe/react-connect-js";

type StripeConnectInstance = Awaited<
  ReturnType<typeof loadConnectAndInitialize>
>;

type Props = {
  accountId: string;
  onComplete?: () => void;
  onExit?: () => void;
};

/**
 * Renders Stripe's hosted onboarding UI inside Vouch's React tree via the
 * Connect Embedded Components SDK. Replaces the legacy `window.location.href`
 * redirect to connect.stripe.com — sellers never leave Vouch's domain.
 *
 * Mints a short-lived AccountSession via `/api/connect/account-session` on
 * mount; the session expires after ~30 min so we re-mint on every render of
 * the component (keyed by accountId). Stripe's SDK handles its own focus
 * management, error surfacing, and step navigation — we just host it.
 */
export function EmbeddedConnectOnboarding({
  accountId,
  onComplete,
  onExit,
}: Props) {
  const [stripeConnect, setStripeConnect] =
    useState<StripeConnectInstance | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const instance = await loadConnectAndInitialize({
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          fetchClientSecret: async () => {
            const res = await fetch("/api/connect/account-session", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ account_id: accountId }),
            });
            if (!res.ok) throw new Error("Failed to mint account session");
            const json = await res.json();
            return json.client_secret as string;
          },
          appearance: {
            variables: {
              colorPrimary: "#5266eb",
              colorText: "#2a2924",
              colorBackground: "#f6f5f2",
              fontFamily: "system-ui, -apple-system, sans-serif",
              borderRadius: "6px",
            },
          },
        });
        if (!cancelled) setStripeConnect(instance);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "init_failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  if (error) {
    return (
      <div className="rounded-md border border-[rgba(181,74,58,0.4)] bg-[rgba(181,74,58,0.08)] p-3 font-mono text-xs text-[#b54a3a]">
        Couldn&apos;t load Stripe onboarding: {error}
      </div>
    );
  }

  if (!stripeConnect) {
    return (
      <div className="rounded-md border border-[rgba(50,30,5,0.10)] bg-white p-4 text-sm text-[#5a5548]">
        Loading verification…
      </div>
    );
  }

  return (
    <ConnectComponentsProvider connectInstance={stripeConnect}>
      <ConnectAccountOnboarding
        onExit={() => {
          // Stripe fires onExit when the seller finishes (or aborts) the
          // flow. We treat both as "they're done with the embed for now" —
          // the parent page can re-query the account's `details_submitted`
          // status to decide what to render next.
          onComplete?.();
          onExit?.();
        }}
      />
    </ConnectComponentsProvider>
  );
}
