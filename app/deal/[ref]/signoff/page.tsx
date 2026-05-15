"use client";

import { use, useEffect, useState } from "react";

type DealView = {
  id: string;
  reference: string;
  status: string;
  buyer: { firstName: string };
  seller: { firstName: string };
  terms: { amountMinor: number; currency: string; item: string };
};

type Stage =
  | "loading"
  | "ready"
  | "recitation"
  | "buyer_agreed"
  | "seller_agreed"
  | "both_agreed"
  | "in_escrow"
  | "released"
  | "error";

function formatMoney(minor: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(minor / 100);
}

export default function SignoffPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [deal, setDeal] = useState<DealView | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [recitation, setRecitation] = useState<string | null>(null);
  const [buyerAgreed, setBuyerAgreed] = useState(false);
  const [sellerAgreed, setSellerAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshDeal() {
    const res = await fetch(`/api/deals/${ref}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "deal_not_found");
    setDeal(json.deal);
    return json.deal as DealView;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await refreshDeal();
        if (cancelled) return;
        if (d.status === "IN_ESCROW") setStage("in_escrow");
        else if (d.status === "RELEASED") setStage("released");
        else setStage("ready");
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "unknown");
        setStage("error");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  async function startRecitation() {
    if (!deal) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/read-contract-back", {
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

  async function bothConfirmed() {
    if (!deal) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/lock-escrow", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "lock_failed");
      await refreshDeal();
      setStage("in_escrow");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  async function confirmReceipt() {
    if (!deal) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/release-escrow", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "release_failed");
      await refreshDeal();
      setStage("released");
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
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
            Vouch · Joint sign-off · {ref}
          </p>
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

        {deal && (stage === "ready" || stage === "recitation") && (
          <section className="rounded-2xl border border-[rgba(50,30,5,0.10)] bg-white p-8 shadow-[0_4px_16px_rgba(40,20,5,0.04)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5266eb]">
              Vera · final agreement
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              {deal.buyer.firstName} and {deal.seller.firstName}, here it is.
            </h1>
            <p className="mt-2 font-mono text-sm text-[#5a5548]">
              {formatMoney(deal.terms.amountMinor, deal.terms.currency)} for {deal.terms.item}
            </p>

            {stage === "ready" && (
              <button
                type="button"
                onClick={startRecitation}
                disabled={busy}
                className="mt-8 rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "…" : "Hear the agreement"}
              </button>
            )}

            {stage === "recitation" && recitation && (
              <>
                <p className="mt-6 font-display text-lg font-medium leading-relaxed">
                  &ldquo;{recitation}&rdquo;
                </p>
                <div className="mt-8 space-y-4">
                  <p className="text-sm text-[#5a5548]">
                    Both of you say &ldquo;I agree&rdquo; — tick below.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <label
                      className={`flex flex-1 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
                        buyerAgreed
                          ? "border-[#5266eb] bg-[#e2e6fb]"
                          : "border-[rgba(50,30,5,0.18)] bg-white hover:bg-[#fbfaf6]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={buyerAgreed}
                        onChange={(e) => setBuyerAgreed(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">
                        {deal.buyer.firstName} agrees
                      </span>
                    </label>
                    <label
                      className={`flex flex-1 cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
                        sellerAgreed
                          ? "border-[#5266eb] bg-[#e2e6fb]"
                          : "border-[rgba(50,30,5,0.18)] bg-white hover:bg-[#fbfaf6]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={sellerAgreed}
                        onChange={(e) => setSellerAgreed(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-medium">
                        {deal.seller.firstName} agrees
                      </span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={bothConfirmed}
                    disabled={busy || !buyerAgreed || !sellerAgreed}
                    className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
                  >
                    {busy
                      ? "Locking escrow…"
                      : "Lock " + formatMoney(deal.terms.amountMinor, deal.terms.currency) + " in escrow →"}
                  </button>
                </div>
              </>
            )}
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </section>
        )}

        {stage === "in_escrow" && deal && (
          <section className="rounded-2xl border border-[#7a6ce8]/40 bg-white p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7a6ce8]">
              IN_ESCROW · money is held
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              {formatMoney(deal.terms.amountMinor, deal.terms.currency)}{" "}
              <span className="italic text-[#7a6ce8]">is locked</span>.
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">
              {deal.seller.firstName}, ship the item or do the work. {deal.buyer.firstName},
              I&rsquo;ll be here when it&rsquo;s time to release the money.
            </p>
            <button
              type="button"
              onClick={confirmReceipt}
              disabled={busy}
              className="mt-6 rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
            >
              {busy
                ? "Releasing…"
                : `${deal.buyer.firstName} confirms receipt — release →`}
            </button>
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </section>
        )}

        {stage === "released" && deal && (
          <section className="rounded-2xl border border-[#2f7d57]/40 bg-white p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2f7d57]">
              RELEASED · {deal.seller.firstName} paid
            </p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              {formatMoney(deal.terms.amountMinor, deal.terms.currency)}{" "}
              <span className="italic text-[#2f7d57]">released</span> to {deal.seller.firstName}.
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">
              Thanks for using Vouch.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
