"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  DemoModeBanner,
  Eyebrow,
  MoneyAmount,
} from "@/components/ui";

type Stage = "intro" | "starting" | "error";

/**
 * The /demo entry point. Seeds a fully-prepped scenario deal (Sarah buying
 * an iPhone from Marcus, $400) and redirects into /new so the buyer flow
 * runs against real Vera tooling.
 *
 * The mock eBay listing UI here is a PLACEHOLDER — the final design needs
 * v0/Figma iteration (per the Day 1 conversation).
 */
export default function DemoLandingPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [error, setError] = useState<string | null>(null);

  async function startDemo() {
    setStage("starting");
    setError(null);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          buyer: { firstName: "Sarah", email: "sarah@example.com" },
          counterparty: {
            firstName: "Marcus",
            email: "marcus@example.com",
          },
          initialTerms: {
            item: "iPhone 15, 256GB, white, unlocked, no scratches, original box",
            currency: "USD",
            amountMinor: 40_000,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "demo_seed_failed");
      window.location.href = `/new?demo=1&seeded=${json.reference}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
      setStage("error");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Eyebrow>Vouch · Interactive demo</Eyebrow>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478] hover:text-[#5a5548]"
          >
            Live product →
          </Link>
        </header>

        <DemoModeBanner />

        <Card padding="loose" shadow>
          <Eyebrow tone="indigo">3-minute walkthrough · no signup</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">
            You&rsquo;ll play <span className="italic text-[#5266eb]">both sides</span> of a $400 deal.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#5a5548]">
            Sarah is buying an iPhone 15 from Marcus on a marketplace listing.
            You&rsquo;ll talk to Vera as Sarah, switch to Marcus, do the joint
            sign-off, then see what happens when the phone arrives cracked.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Real Vera. Real voice mediation. Fake Stripe — no card numbers needed.
          </p>
          <button
            type="button"
            onClick={startDemo}
            disabled={stage === "starting"}
            className="mt-8 rounded-md bg-[#635bff] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
          >
            {stage === "starting"
              ? "Setting up your deal…"
              : "Start as Sarah →"}
          </button>
          {error && (
            <p className="mt-4 font-mono text-xs text-[#b54a3a]">
              Couldn&rsquo;t set up the demo: {error}
            </p>
          )}
        </Card>

        <Card>
          <Eyebrow>The deal you&rsquo;ll set up</Eyebrow>
          <dl className="mt-4 grid grid-cols-[140px_1fr] gap-y-3 text-sm">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Item
            </dt>
            <dd>iPhone 15, 256GB, white, unlocked, no scratches, original box</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Price
            </dt>
            <dd>
              <MoneyAmount amountMinor={40_000} currency="USD" bold />
            </dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Buyer
            </dt>
            <dd>Sarah Chen</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Seller
            </dt>
            <dd>Marcus Adebayo</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Outcome
            </dt>
            <dd className="text-[#5a5548]">
              Phone arrives with a cracked screen → Vera mediates a dispute → refund
            </dd>
          </dl>
        </Card>
      </div>
    </main>
  );
}
