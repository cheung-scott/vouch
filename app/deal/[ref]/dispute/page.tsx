"use client";
import { dealFetch, dealHref } from "@/lib/deal-fetch";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, Eyebrow, MoneyAmount } from "@/components/ui";

type DealView = {
  id: string;
  reference: string;
  status: string;
  buyer: { firstName: string };
  seller: { firstName: string };
  terms: { item: string; amountMinor: number; currency: string };
};

type Stage =
  | "loading"
  | "intro"
  | "reason"
  | "replay"
  | "evidence"
  | "submitted"
  | "error";

export default function DisputePage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [deal, setDeal] = useState<DealView | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [reason, setReason] = useState("");
  const [replay, setReplay] = useState<string | null>(null);
  const [evidenceSummary, setEvidenceSummary] = useState("");
  const [disputeId, setDisputeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await dealFetch(`/api/deals/${ref}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "deal_not_found");
        if (cancelled) return;
        setDeal(json.deal);
        setStage("intro");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "unknown");
        setStage("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ref]);

  async function openDispute() {
    if (!deal || !reason.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await dealFetch("/api/vera/open-dispute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id, reason: reason.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "open_failed");
      setDisputeId(json.dispute_id);

      const replayRes = await dealFetch("/api/vera/replay-agreement", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const replayJson = await replayRes.json();
      if (replayRes.ok) setReplay(replayJson.spoken_text);
      setStage("replay");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  async function submitEvidence() {
    if (!deal || !evidenceSummary.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await dealFetch("/api/vera/gather-dispute-evidence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          dispute_id: disputeId ?? undefined,
          user_summary: evidenceSummary.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "evidence_failed");
      setStage("submitted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Eyebrow>Vouch · Dispute · {ref}</Eyebrow>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            {deal?.status ?? stage}
          </p>
        </header>

        {stage === "loading" && (
          <p className="text-sm text-[#8a8478]">Loading deal…</p>
        )}
        {stage === "error" && (
          <p className="font-mono text-sm text-[#b54a3a]">{error}</p>
        )}

        {stage === "intro" && deal && (
          <Card tone="danger" padding="loose" shadow>
            <Eyebrow tone="danger">Vera · dispute intake</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              I understand there&rsquo;s a problem.
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">
              Tell me what happened in your own words. I won&rsquo;t take sides — I&rsquo;ll gather your version, then reach out to {deal.buyer.firstName === deal.seller.firstName ? "the other party" : "the other party"} for theirs. The money stays held safely until we&rsquo;re done.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="The phone arrived but the screen is cracked. Marcus said no scratches."
              className="mt-6 w-full resize-none rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
            />
            <button
              type="button"
              onClick={openDispute}
              disabled={busy || !reason.trim()}
              className="mt-4 rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
            >
              {busy ? "Opening…" : "Open dispute →"}
            </button>
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </Card>
        )}

        {stage === "replay" && replay && deal && (
          <>
            <Card tone="indigo" padding="loose">
              <Eyebrow tone="indigo">Vera replays the original agreement</Eyebrow>
              <p className="mt-5 font-display text-lg font-medium leading-relaxed">
                &ldquo;{replay}&rdquo;
              </p>
            </Card>

            <Card padding="loose">
              <Eyebrow>Compared to that, what specifically is different?</Eyebrow>
              <textarea
                value={evidenceSummary}
                onChange={(e) => setEvidenceSummary(e.target.value)}
                rows={4}
                placeholder="The screen has a big crack across the bottom right corner. Not a scratch, a crack."
                className="mt-4 w-full resize-none rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
              />
              <button
                type="button"
                onClick={submitEvidence}
                disabled={busy || !evidenceSummary.trim()}
                className="mt-4 rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "Saving…" : "Submit evidence summary →"}
              </button>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
                Photo / video / receipt upload wires in Day 4
              </p>
              {error && (
                <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
              )}
            </Card>
          </>
        )}

        {stage === "submitted" && deal && (
          <Card tone="warning" padding="loose">
            <Eyebrow tone="warning">
              Got it · dispute {disputeId} recorded
            </Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              I&rsquo;ll reach out to the other party. Most disputes resolve in under an hour.
            </h2>
            <p className="mt-3 text-sm text-[#5a5548]">
              The{" "}
              <MoneyAmount
                amountMinor={deal.terms.amountMinor}
                currency={deal.terms.currency}
              />{" "}
              stays held safely.
            </p>
            <Link
              href={dealHref(`/deal/${deal.reference}`)}
              className="mt-6 inline-block rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6]"
            >
              Back to deal →
            </Link>
          </Card>
        )}
      </div>
    </main>
  );
}
