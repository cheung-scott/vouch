"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Card, Eyebrow, MoneyAmount } from "@/components/ui";
import { VeraAnalysisCard } from "@/components/VeraAnalysisCard";
import { SellerRepBadge } from "@/components/SellerRepBadge";
import { displayPartyName } from "@/lib/utils";

type DealDetail = {
  id: string;
  reference: string;
  status: string;
  buyer: { firstName: string; committedAt?: string };
  seller: { firstName: string; committedAt?: string; stripeAccountId?: string };
  terms: {
    item: string;
    quantity: number;
    amountMinor: number;
    currency: string;
    deliveryMethod?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
  releasedAt?: string;
  stripeIssuingCardStatus?: "frozen" | "active" | "canceled";
  veraSummary?: string;
  veraEvalResults?: Record<
    string,
    { result: "success" | "failure" | "unknown"; rationale: string }
  >;
};

function fmtTimestamp(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [deal, setDeal] = useState<DealDetail | null>(null);
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

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f5f2] px-6 text-[#2a2924]">
        <div className="text-center">
          <p className="font-mono text-sm text-[#b54a3a]">
            Couldn&rsquo;t load deal {ref}: {error}
          </p>
          <Link
            href="/deals"
            className="mt-4 inline-block text-sm text-[#5266eb] underline"
          >
            ← All deals
          </Link>
        </div>
      </main>
    );
  }

  if (!deal) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f5f2] px-6">
        <p className="text-sm text-[#8a8478]">Loading deal…</p>
      </main>
    );
  }

  const status = deal.status;
  const buyerDisplay = displayPartyName(deal.buyer.firstName, "Buyer");
  const sellerDisplay = displayPartyName(deal.seller.firstName, "Seller");
  const events: { label: string; at?: string; tone: "muted" | "active" }[] = [
    { label: "Deal drafted", at: deal.createdAt, tone: "active" },
    {
      label: `${buyerDisplay} committed`,
      at: deal.buyer.committedAt,
      tone: deal.buyer.committedAt ? "active" : "muted",
    },
    {
      label: `${sellerDisplay} committed`,
      at: deal.seller.committedAt,
      tone: deal.seller.committedAt ? "active" : "muted",
    },
    {
      label: "Money locked in escrow",
      at: deal.lockedAt,
      tone: deal.lockedAt ? "active" : "muted",
    },
    {
      label: "Money released",
      at: deal.releasedAt,
      tone: deal.releasedAt ? "active" : "muted",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-start justify-between">
          <div>
            <Link
              href="/deals"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5266eb] hover:underline"
            >
              ← All deals
            </Link>
            <h1 className="mt-3 font-mono text-2xl font-semibold tracking-[-0.01em]">
              {deal.reference}
            </h1>
            <p className="mt-1 text-sm text-[#5a5548]">
              {buyerDisplay} → {sellerDisplay} ·{" "}
              <MoneyAmount
                amountMinor={deal.terms.amountMinor}
                currency={deal.terms.currency}
              />
            </p>
            {deal.seller.stripeAccountId && (
              <div className="mt-2 flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                  Seller rep
                </span>
                <SellerRepBadge
                  accountId={deal.seller.stripeAccountId}
                  sellerFirstName={deal.seller.firstName}
                />
              </div>
            )}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            {status}
          </span>
        </header>

        {/* Persistent reminder: deal URLs are bearer tokens in v1. If the
            user loses this URL, they can't recover it. */}
        {!["RELEASED", "REFUNDED", "CANCELLED"].includes(deal.status) && (
          <div className="rounded-md border border-[#5266eb]/30 bg-[#5266eb]/6 px-4 py-2 text-xs leading-relaxed text-[#5a5548]">
            <span className="font-mono uppercase tracking-[0.14em] text-[#5266eb]">
              Keep this URL
            </span>
            <span className="mx-2 text-[#8a8478]">·</span>
            Bookmark or email yourself this page — it&rsquo;s your access to
            this deal until it&rsquo;s complete.
          </div>
        )}

        <ActionPanel deal={deal} />

        {deal.stripeIssuingCardStatus && (
          <IssuingCardBadge status={deal.stripeIssuingCardStatus} />
        )}

        <VeraAnalysisCard
          summary={deal.veraSummary}
          evalResults={deal.veraEvalResults}
        />

        <Card>
          <Eyebrow>Terms</Eyebrow>
          <dl className="mt-4 grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Item
            </dt>
            <dd>{deal.terms.item || <span className="text-[#8a8478]">—</span>}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Quantity
            </dt>
            <dd>{deal.terms.quantity}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Amount
            </dt>
            <dd>
              <MoneyAmount
                amountMinor={deal.terms.amountMinor}
                currency={deal.terms.currency}
                bold
              />
            </dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              Delivery
            </dt>
            <dd>
              {deal.terms.deliveryMethod || (
                <span className="text-[#8a8478]">—</span>
              )}
            </dd>

            {deal.terms.notes && (
              <>
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  Notes
                </dt>
                <dd className="text-[#5a5548]">{deal.terms.notes}</dd>
              </>
            )}
          </dl>
        </Card>

        <Card>
          <Eyebrow>Timeline</Eyebrow>
          <ol className="mt-5 flex flex-col gap-4">
            {events.map((event, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-1 inline-block h-2 w-2 rounded-full ${
                    event.tone === "active"
                      ? "bg-[#5266eb]"
                      : "bg-[rgba(50,30,5,0.18)]"
                  }`}
                />
                <span
                  className={
                    event.tone === "active" ? "text-[#2a2924]" : "text-[#8a8478]"
                  }
                >
                  {event.label}
                </span>
                <span className="ml-auto font-mono text-xs text-[#8a8478]">
                  {fmtTimestamp(event.at)}
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </main>
  );
}

function ActionPanel({ deal }: { deal: DealDetail }) {
  const { status, reference } = deal;
  const counterReceived = status === "DRAFT" && !!deal.buyer.committedAt;

  if (counterReceived) {
    return <CounterReconfirmPanel deal={deal} />;
  }

  if (status === "DRAFT") {
    return (
      <Card tone="warning">
        <Eyebrow tone="warning">Deal in draft</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Continue capturing terms with Vera.
        </h2>
        <Link
          href="/new"
          className="mt-4 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
        >
          Continue draft →
        </Link>
      </Card>
    );
  }

  if (status === "AWAITING_SELLER") {
    return (
      <Card tone="warning">
        <Eyebrow tone="warning">Awaiting the other party</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Share the seller invitation link.
        </h2>
        <a
          href={`/deal/${reference}/seller`}
          className="mt-4 block rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 font-mono text-sm text-[#5266eb] hover:bg-white"
        >
          {typeof window !== "undefined"
            ? `${window.location.origin}/deal/${reference}/seller`
            : `/deal/${reference}/seller`}
        </a>
      </Card>
    );
  }

  if (status === "AGREED") {
    return (
      <Card tone="warning">
        <Eyebrow tone="warning">Ready for joint sign-off</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Both parties: do the final sign-off together.
        </h2>
        <Link
          href={`/deal/${reference}/signoff`}
          className="mt-4 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
        >
          Go to joint sign-off →
        </Link>
      </Card>
    );
  }

  if (status === "IN_ESCROW") {
    return (
      <Card tone="locked">
        <Eyebrow tone="locked">Money is in escrow</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Confirm receipt to release — or open a dispute.
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/deal/${reference}/signoff`}
            className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
          >
            Confirm receipt →
          </Link>
          <Link
            href={`/deal/${reference}/dispute`}
            className="rounded-md border border-[#b54a3a]/40 bg-white px-4 py-2 text-sm font-medium text-[#b54a3a] transition-colors hover:bg-[rgba(181,74,58,0.06)]"
          >
            Open a dispute
          </Link>
        </div>
      </Card>
    );
  }

  if (status === "RELEASED") {
    return (
      <Card tone="success">
        <Eyebrow tone="success">Released</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          The seller has been paid.
        </h2>
      </Card>
    );
  }

  if (status === "DISPUTED" || status === "REVIEWING") {
    return (
      <Card tone="danger">
        <Eyebrow tone="danger">
          {status === "DISPUTED" ? "Dispute open" : "Under review"}
        </Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Money stays in escrow until resolved.
        </h2>
        <p className="mt-3 text-sm text-[#5a5548]">
          In v1, disputes are escalated to human review after Vera gathers
          evidence (typically resolved within an hour). For the demo, use the
          button below to issue the verdict directly.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/deal/${reference}/dispute`}
            className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6]"
          >
            View dispute →
          </Link>
          <DemoVerdictButton dealId={deal.id} />
        </div>
      </Card>
    );
  }

  return null;
}

/**
 * Demo-only verdict button — calls /api/vera/refund-deal to issue the
 * "refund to buyer" verdict on a disputed deal. In a real product the
 * verdict would come from human review after the seller's side is
 * collected; for the hackathon demo this lets judges see the full
 * dispute → refund visual chain without waiting for off-screen review.
 */
function DemoVerdictButton({ dealId }: { dealId: string }) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<
    | { kind: "idle" }
    | { kind: "ok"; refundId: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function issueVerdict() {
    if (
      !confirm(
        "Issue verdict: refund the buyer in full?\n\nThis is a demo-only override that simulates human review concluding in the buyer's favour. The deal status will flip to REFUNDED and the buyer's money will be reversed from Stripe.",
      )
    ) {
      return;
    }
    setBusy(true);
    setResult({ kind: "idle" });
    try {
      const res = await fetch("/api/vera/refund-deal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          deal_id: dealId,
          reason: "demo_verdict_refund_buyer",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? json.message ?? "verdict_failed");
      }
      setResult({ kind: "ok", refundId: json.refund_id ?? "ok" });
      // Hard reload so the deal page re-renders the REFUNDED state cleanly.
      window.location.reload();
    } catch (err) {
      setResult({
        kind: "error",
        message: err instanceof Error ? err.message : "unknown",
      });
    } finally {
      setBusy(false);
    }
  }

  if (result.kind === "ok") {
    return (
      <span className="rounded-md bg-[#2f7a4e] px-4 py-2 text-sm font-medium text-white">
        Refunded · reloading…
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={issueVerdict}
        disabled={busy}
        className="rounded-md bg-[#b54a3a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#9d3e2f] disabled:opacity-60"
        title="Demo: simulate human review concluding in buyer's favour"
      >
        {busy ? "Issuing verdict…" : "Demo: Issue verdict (refund buyer)"}
      </button>
      {result.kind === "error" && (
        <p className="basis-full font-mono text-xs text-[#b54a3a]">
          {result.message}
        </p>
      )}
    </>
  );
}

function CounterReconfirmPanel({ deal }: { deal: DealDetail }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recitation, setRecitation] = useState<string | null>(null);
  const [reconfirmed, setReconfirmed] = useState(false);

  async function loadCounter() {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  async function reconfirm() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/commit-buyer-side", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: deal.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "commit_failed");
      setReconfirmed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown");
    } finally {
      setBusy(false);
    }
  }

  if (reconfirmed) {
    return (
      <Card tone="success">
        <Eyebrow tone="success">Re-confirmed · AWAITING_SELLER</Eyebrow>
        <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
          Sent back to {displayPartyName(deal.seller.firstName, "Seller")} for final agreement.
        </h2>
        <p className="mt-3 text-sm text-[#5a5548]">
          Refresh this page to see the updated state.
        </p>
      </Card>
    );
  }

  return (
    <Card tone="warning">
      <Eyebrow tone="warning">{displayPartyName(deal.seller.firstName, "Seller")} proposed changes</Eyebrow>
      <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
        Review the updated terms below — re-confirm or push back.
      </h2>

      {!recitation && (
        <button
          type="button"
          onClick={loadCounter}
          disabled={busy}
          className="mt-4 rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
        >
          {busy ? "Loading…" : "Hear the counter →"}
        </button>
      )}

      {recitation && (
        <>
          <p className="mt-5 font-display text-lg font-medium leading-relaxed">
            &ldquo;{recitation}&rdquo;
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reconfirm}
              disabled={busy}
              className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
            >
              {busy ? "Re-confirming…" : "I confirm the new terms →"}
            </button>
            <Link
              href="/new"
              className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6]"
            >
              Push back / edit
            </Link>
          </div>
        </>
      )}
      {error && (
        <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
      )}
    </Card>
  );
}

function IssuingCardBadge({
  status,
}: {
  status: "frozen" | "active" | "canceled";
}) {
  const config = {
    frozen: {
      tone: "indigo" as const,
      label: "Virtual card minted",
      sub: "Frozen — unfreezes on voice-confirmed receipt",
      icon: "🧊",
      border: "border-[#5266eb]/30",
      bg: "bg-[#5266eb]/5",
      text: "text-[#5266eb]",
    },
    active: {
      tone: "success" as const,
      label: "Virtual card active",
      sub: "Seller can spend the released amount immediately",
      icon: "✓",
      border: "border-[#2f7d57]/30",
      bg: "bg-[#2f7d57]/5",
      text: "text-[#2f7d57]",
    },
    canceled: {
      tone: "danger" as const,
      label: "Virtual card cancelled",
      sub: "Deal disputed or refunded — card terminated",
      icon: "✕",
      border: "border-[#b54a3a]/30",
      bg: "bg-[#b54a3a]/5",
      text: "text-[#b54a3a]",
    },
  }[status];

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border ${config.border} ${config.bg} px-5 py-4`}
    >
      <span className={`grid h-10 w-10 place-items-center rounded-full text-lg ${config.text}`}>
        {config.icon}
      </span>
      <div className="flex flex-1 flex-col">
        <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${config.text}`}>
          Stripe Issuing
        </span>
        <span className={`mt-1 font-display text-base font-semibold ${config.text}`}>
          {config.label}
        </span>
        <span className="mt-0.5 text-xs text-[#5a5548]">{config.sub}</span>
      </div>
    </div>
  );
}
