"use client";

import { use, useEffect, useState } from "react";
import { Card, Eyebrow } from "@/components/ui";

type Stage =
  | "loading"
  | "preflight"
  | "recitation"
  | "deciding"
  | "committed"
  | "countering"
  | "countered"
  | "declined"
  | "error";

type DealSummary = {
  id: string;
  reference: string;
  status: string;
  buyer: { firstName: string };
  seller: { firstName: string };
  terms: { item: string; amountMinor: number; currency: string };
};

export default function SellerPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [stage, setStage] = useState<Stage>("loading");
  const [deal, setDeal] = useState<DealSummary | null>(null);
  const [sellerName, setSellerName] = useState("");
  const [recitation, setRecitation] = useState<string | null>(null);
  const [counter, setCounter] = useState("");
  const [busy, setBusy] = useState(false);
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
        setSellerName(json.deal.seller.firstName ?? "");
        if (json.deal.status === "DRAFT") {
          setError(
            `${json.deal.buyer.firstName} hasn't finished capturing terms yet. Check back once they confirm.`,
          );
          setStage("error");
        } else if (
          ["AGREED", "IN_ESCROW", "RELEASED"].includes(json.deal.status)
        ) {
          setStage("committed");
        } else {
          setStage("preflight");
        }
      } catch (err) {
        if (cancelled) return;
        const raw = err instanceof Error ? err.message : "unknown";
        setError(
          raw === "deal_not_found"
            ? `We couldn't find deal ${ref}. Check the link.`
            : `Couldn't load the deal: ${raw}`,
        );
        setStage("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ref]);

  async function listenToTerms() {
    if (!deal) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/read-buyer-terms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "recitation_failed");
      setRecitation(json.spoken_text);
      setStage("recitation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  async function agree() {
    if (!deal) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/commit-seller-side", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "commit_failed");
      setStage("committed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  async function sendCounter() {
    if (!deal || !counter.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/extract-counter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id, changes: counter.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "counter_failed");
      setStage("countered");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  async function decline() {
    if (!deal) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/flag-for-review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id, reason: "seller declined" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "decline_failed");
      setStage("declined");
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
          <Eyebrow>Vouch · Seller invitation · {ref}</Eyebrow>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            {deal?.status ?? stage}
          </p>
        </header>

        {stage === "loading" && (
          <p className="text-sm text-[#8a8478]">Loading deal…</p>
        )}

        {stage === "error" && (
          <p className="font-mono text-sm text-[#b54a3a]">
            Couldn&apos;t load the deal: {error}
          </p>
        )}

        {stage === "preflight" && deal && (
          <Card padding="loose" shadow>
            <Eyebrow tone="indigo">Vera · seller intake</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              Hi — {deal.buyer.firstName} set up a deal{" "}
              <span className="italic text-[#5266eb]">they&rsquo;d like to do with you</span>.
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">
              I&rsquo;ll read their terms back first. Then you can agree, propose changes, or decline.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Your first name"
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
              />
              <button
                type="button"
                onClick={listenToTerms}
                disabled={busy || !sellerName.trim()}
                className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "Loading terms…" : "Hear the terms →"}
              </button>
              {error && (
                <p className="font-mono text-xs text-[#b54a3a]">{error}</p>
              )}
            </div>
          </Card>
        )}

        {stage === "recitation" && recitation && deal && (
          <Card tone="indigo" padding="loose" shadow>
            <Eyebrow tone="indigo">
              Vera reads {deal.buyer.firstName}&rsquo;s terms
            </Eyebrow>
            <p className="mt-5 font-display text-xl font-medium leading-relaxed">
              &ldquo;{recitation}&rdquo;
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={agree}
                disabled={busy}
                className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "…" : "I agree →"}
              </button>
              <button
                type="button"
                onClick={() => setStage("countering")}
                disabled={busy}
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6] disabled:opacity-40"
              >
                Propose changes
              </button>
              <button
                type="button"
                onClick={decline}
                disabled={busy}
                className="rounded-md border border-[#b54a3a]/40 bg-white px-4 py-2 text-sm font-medium text-[#b54a3a] transition-colors hover:bg-[rgba(181,74,58,0.06)] disabled:opacity-40"
              >
                Decline
              </button>
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </Card>
        )}

        {stage === "countering" && (
          <Card padding="loose" shadow>
            <Eyebrow tone="indigo">Vera · what would you change?</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              What&rsquo;s different?
            </h2>
            <textarea
              value={counter}
              onChange={(e) => setCounter(e.target.value)}
              rows={4}
              placeholder="The price was £380, not £400 — she said she'd take £20 off for the scuff."
              className="mt-4 w-full resize-none rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStage("recitation")}
                disabled={busy}
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6] disabled:opacity-40"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={sendCounter}
                disabled={busy || !counter.trim()}
                className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "Sending…" : "Send counter →"}
              </button>
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </Card>
        )}

        {stage === "committed" && deal && (
          <Card tone="success" padding="loose">
            <Eyebrow tone="success">AGREED · joint sign-off pending</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              Locked in. Both of you do the joint sign-off together.
            </h2>
            <a
              href={`/deal/${deal.reference}/signoff`}
              className="mt-6 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
            >
              Go to joint sign-off →
            </a>
          </Card>
        )}

        {stage === "countered" && (
          <Card tone="warning" padding="loose">
            <Eyebrow tone="warning">Counter sent</Eyebrow>
            <p className="mt-3 text-base text-[#2a2924]">
              I&rsquo;ll send the updated terms back to {deal?.buyer.firstName}. They&rsquo;ll confirm or come back to you.
            </p>
          </Card>
        )}

        {stage === "declined" && (
          <Card tone="danger" padding="loose">
            <Eyebrow tone="danger">Declined</Eyebrow>
            <p className="mt-3 text-base text-[#2a2924]">
              No money has been locked. You can both pick this back up when you&rsquo;re ready.
            </p>
          </Card>
        )}
      </div>
    </main>
  );
}
