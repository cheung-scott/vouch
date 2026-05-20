"use client";

import { use, useCallback, useEffect, useState } from "react";
import { Card, Eyebrow } from "@/components/ui";
import { VeraVoiceSession } from "@/components/VeraVoiceSession";
import { SellerRepBadge } from "@/components/SellerRepBadge";
import { displayPartyName, isPlaceholderName, statusDisplay } from "@/lib/utils";

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
  seller: { firstName: string; stripeAccountId?: string };
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
  // Two-step gate on the intake screen: the seller types their name into the
  // input, then presses Continue (or Enter) to lock it in. Only AFTER that
  // does Vera auto-start. Without this, autoStart used to fire the instant
  // `sellerName.trim()` became truthy — i.e. after the first keystroke —
  // and Vera began greeting the seller before they'd finished typing.
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [recitation, setRecitation] = useState<string | null>(null);
  const [counter, setCounter] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDeal = useCallback(
    async (opts: { silent?: boolean } = {}) => {
      try {
        const res = await fetch(`/api/deals/${ref}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "deal_not_found");
        setDeal(json.deal);
        // Don't clobber a name the seller just typed. Also don't pre-fill
        // with placeholder strings ("Seller", "the other party") or
        // marketplace handles (e.g. "mrclearances") — those signal "no real
        // name yet" and we want the seller to type their actual first name.
        const PLACEHOLDER_NAMES = new Set([
          "", "seller", "buyer", "the seller", "the buyer", "the other party",
        ]);
        const incomingName = json.deal.seller.firstName ?? "";
        const incomingLower = incomingName.toLowerCase().trim();
        const incomingIsPlaceholder = PLACEHOLDER_NAMES.has(incomingLower);
        const looksLikeMarketplaceHandle =
          /^[a-z0-9_-]{4,}$/.test(incomingName) && !/\s/.test(incomingName);
        const isPrefillable =
          !incomingIsPlaceholder && !looksLikeMarketplaceHandle;
        setSellerName(
          (prev) => prev || (isPrefillable ? incomingName : ""),
        );
        // DRAFT deals are now allowed through to the seller flow — Vera can
        // read whatever buyer terms were captured even before commit_buyer_side
        // fires. Only block if the deal has nothing captured at all.
        if (
          json.deal.status === "DRAFT" &&
          !json.deal.terms?.item &&
          !json.deal.terms?.amountMinor
        ) {
          setError(
            `${displayPartyName(json.deal.buyer.firstName, "The buyer")} hasn't captured any terms yet. Check back once they begin the deal.`,
          );
          setStage("error");
        } else if (
          ["AGREED", "IN_ESCROW", "RELEASED"].includes(json.deal.status)
        ) {
          setStage("committed");
        } else if (!opts.silent) {
          setStage("preflight");
        }
      } catch (err) {
        const raw = err instanceof Error ? err.message : "unknown";
        setError(
          raw === "deal_not_found"
            ? `We couldn't find deal ${ref}. Check the link.`
            : `Couldn't load the deal: ${raw}`,
        );
        setStage("error");
      }
    },
    [ref],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadDeal();
    })();
    return () => {
      cancelled = true;
    };
  }, [loadDeal]);

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
            {deal?.status ? statusDisplay(deal.status) : stage}
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
              Hi — {displayPartyName(deal.buyer.firstName, "the buyer")} set up a deal{" "}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" && sellerName.trim()) {
                    e.preventDefault();
                    setNameConfirmed(true);
                  }
                }}
                placeholder="Your first name"
                disabled={nameConfirmed}
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30 disabled:opacity-60"
              />
              {!nameConfirmed && (
                <button
                  type="button"
                  onClick={() => setNameConfirmed(true)}
                  disabled={!sellerName.trim()}
                  className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
                >
                  Continue →
                </button>
              )}
              {nameConfirmed && (
                <>
                  <VeraVoiceSession
                    sessionType="SELLER_ONBOARDING"
                    userFirstName={sellerName}
                    dealId={deal.id}
                    startLabel="Have Vera read the terms to you"
                    autoStart
                    onSessionEnd={() => loadDeal({ silent: true })}
                  />
                  <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                    or
                  </p>
                  <button
                    type="button"
                    onClick={listenToTerms}
                    disabled={busy}
                    className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-5 py-3 text-sm font-medium text-[#5266eb] transition-colors hover:bg-[#fbfaf6] disabled:opacity-40"
                  >
                    {busy ? "Loading terms…" : "Read the terms on-screen →"}
                  </button>
                </>
              )}
              {error && (
                <p className="font-mono text-xs text-[#b54a3a]">{error}</p>
              )}
            </div>
          </Card>
        )}

        {stage === "recitation" && recitation && deal && (
          <Card tone="indigo" padding="loose" shadow>
            <Eyebrow tone="indigo">
              Vera reads {displayPartyName(deal.buyer.firstName, "the buyer")}&rsquo;s terms
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

        {stage === "committed" && deal && !deal.seller.stripeAccountId && (
          <Card tone="indigo" padding="loose">
            <Eyebrow tone="indigo">Connect your bank · 1 step left</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              Almost there{!isPlaceholderName(deal.seller.firstName) ? `, ${deal.seller.firstName}` : ""}.
            </h2>
            <p className="mt-3 text-sm text-[#5a5548]">
              Connect your bank to receive payments. Stripe Express setup takes
              about 30 seconds — the same flow you&rsquo;d use for any marketplace.
              No signup needed before this point; it&rsquo;s how Vouch keeps the
              extension working on any eBay listing.
            </p>
            <a
              href={`/onboard?deal_id=${deal.id}`}
              className="mt-6 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
            >
              Connect bank with Stripe →
            </a>
          </Card>
        )}

        {stage === "committed" && deal && deal.seller.stripeAccountId && (
          <Card tone="success" padding="loose">
            <Eyebrow tone="success">AGREED · joint sign-off pending</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              Locked in. Both of you do the joint sign-off together.
            </h2>
            <div className="mt-4">
              <SellerRepBadge
                accountId={deal.seller.stripeAccountId}
                sellerFirstName={deal.seller.firstName}
                variant="card"
              />
            </div>
            <a
              href={`/deal/${deal.reference}/signoff`}
              className="mt-6 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
            >
              Go to joint sign-off →
            </a>
            <div className="mt-6 rounded-md border border-[#5266eb]/40 bg-[#5266eb]/8 p-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5266eb]">
                ⚠ Bookmark this deal
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#5a5548]">
                Save your deal URL (
                <span className="font-mono">/deal/{deal.reference}</span>) — it&rsquo;s
                how you&rsquo;ll come back to track delivery and receive
                payout. When {displayPartyName(deal.buyer.firstName, "the buyer")} confirms receipt, the
                money lands in your Stripe Express account automatically.
                View payouts at{" "}
                <a
                  href="https://dashboard.stripe.com/test/connect/accounts"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#5266eb] underline"
                >
                  Stripe Express dashboard
                </a>
                .
              </p>
            </div>
          </Card>
        )}

        {stage === "countered" && (
          <Card tone="warning" padding="loose">
            <Eyebrow tone="warning">Counter sent</Eyebrow>
            <p className="mt-3 text-base text-[#2a2924]">
              I&rsquo;ll send the updated terms back to {displayPartyName(deal?.buyer.firstName, "the buyer")}. They&rsquo;ll confirm or come back to you.
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
