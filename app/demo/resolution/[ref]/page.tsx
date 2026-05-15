"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  DemoModeBanner,
  DesignPendingPlaceholder,
  Eyebrow,
  MoneyAmount,
} from "@/components/ui";

type DealView = {
  id: string;
  reference: string;
  status: string;
  buyer: { firstName: string };
  seller: { firstName: string };
  terms: { item: string; amountMinor: number; currency: string };
};

/**
 * The dispute-resolution moment of the /demo walkthrough.
 *
 * After Sarah opens a dispute on the cracked iPhone and submits evidence,
 * Vera "issues a verdict" based on the recorded agreement (which said
 * "no scratches") and the photo evidence (showing a crack).
 *
 * This is the climax frame of the entire submission. The final visual
 * design is PENDING — needs v0/Figma iteration before final cut.
 */
export default function DemoResolutionPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [deal, setDeal] = useState<DealView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/deals/${ref}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "deal_not_found");
        if (cancelled) return;
        setDeal(json.deal);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "unknown");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ref]);

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Eyebrow>Vouch · Resolution · {ref}</Eyebrow>
          <Link
            href="/demo"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478] hover:text-[#5a5548]"
          >
            ← Restart demo
          </Link>
        </header>

        <DemoModeBanner />

        {error && (
          <Card tone="danger">
            <Eyebrow tone="danger">Couldn&rsquo;t load deal</Eyebrow>
            <p className="mt-2 text-sm">{error}</p>
          </Card>
        )}

        {!deal && !error && (
          <p className="text-sm text-[#8a8478]">Loading resolution…</p>
        )}

        {deal && (
          <>
            <DesignPendingPlaceholder
              surface="Vera issues the verdict (the demo's climax frame)"
              intent="Vera presents the case and rules in Sarah's favour — the moment that justifies the whole product."
              notes={[
                "Vera's verdict in display serif, framed as her speaking",
                "Three-point evidence summary: (1) recorded statement 'no scratches', (2) photo at delivery shows crack, (3) Marcus's denial without counter-evidence",
                "Visual: split-screen of the original commitment audio + the photo",
                "Outcome panel: refund animation showing £400 flowing from escrow back to Sarah",
                "Marcus's account: 'flagged for review' indicator",
                "Tone: authoritative but not theatrical — the system worked, no celebration",
                "End-state CTA: 'Try the live product →' + 'Watch the demo video →'",
              ]}
            />

            <Card>
              <Eyebrow>Case summary (the structured data Vera reasons over)</Eyebrow>
              <dl className="mt-4 grid grid-cols-[180px_1fr] gap-y-3 text-sm">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Deal reference
                </dt>
                <dd className="font-mono">{deal.reference}</dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Item committed
                </dt>
                <dd>{deal.terms.item}</dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Amount held
                </dt>
                <dd>
                  <MoneyAmount
                    amountMinor={deal.terms.amountMinor}
                    currency={deal.terms.currency}
                    bold
                  />
                </dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Buyer claim
                </dt>
                <dd className="text-[#5a5548]">
                  &ldquo;Screen is cracked.&rdquo; — Sarah
                </dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Seller response
                </dt>
                <dd className="text-[#5a5548]">
                  &ldquo;It wasn&rsquo;t cracked when I sent it.&rdquo; — Marcus
                </dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Recorded commitment
                </dt>
                <dd className="text-[#5a5548]">
                  &ldquo;…no scratches, original box.&rdquo; — Marcus, on the original agreement
                </dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Photo evidence
                </dt>
                <dd className="text-[#5a5548]">
                  Cracked screen at delivery (placeholder image)
                </dd>

                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Vouch ruling
                </dt>
                <dd className="font-medium text-[#2f7d57]">
                  Refund Sarah · Flag Marcus for review
                </dd>
              </dl>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-5 py-2 text-sm font-medium text-[#2a2924] transition-colors hover:bg-[#fbfaf6]"
              >
                ← Restart the demo
              </Link>
              <Link
                href="/"
                className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
              >
                Try the live product →
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
