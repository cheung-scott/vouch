"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

type DealDetail = {
  id: string;
  reference: string;
  status: string;
  buyer: { firstName: string; email?: string; committedAt?: string };
  seller: { firstName: string; email?: string; committedAt?: string };
  terms: {
    item: string;
    quantity: number;
    amountMinor: number;
    currency: string;
    deliveryMethod?: string;
    notes?: string;
  };
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  createdAt: string;
  updatedAt: string;
  lockedAt?: string;
  releasedAt?: string;
};

function fmtMoney(minor: number, currency: string): string {
  if (!minor) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
  }).format(minor / 100);
}

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
          <p className="font-mono text-sm text-[#b54a3a]">Couldn&rsquo;t load deal {ref}: {error}</p>
          <Link href="/deals" className="mt-4 inline-block text-sm text-[#5266eb] underline">
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
  const events: { label: string; at?: string; tone: "muted" | "active" }[] = [
    {
      label: "Deal drafted",
      at: deal.createdAt,
      tone: "active",
    },
    {
      label: `${deal.buyer.firstName} committed`,
      at: deal.buyer.committedAt,
      tone: deal.buyer.committedAt ? "active" : "muted",
    },
    {
      label: `${deal.seller.firstName} committed`,
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
              {deal.buyer.firstName} → {deal.seller.firstName} ·{" "}
              {fmtMoney(deal.terms.amountMinor, deal.terms.currency)}
            </p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            {status}
          </span>
        </header>

        <ActionPanel deal={deal} />

        <section className="rounded-2xl border border-[rgba(50,30,5,0.10)] bg-white p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
            Terms
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">Item</dt>
            <dd>{deal.terms.item || <span className="text-[#8a8478]">—</span>}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">Quantity</dt>
            <dd>{deal.terms.quantity}</dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">Amount</dt>
            <dd style={{ fontVariantNumeric: "tabular-nums" }} className="font-medium">
              {fmtMoney(deal.terms.amountMinor, deal.terms.currency)}
            </dd>

            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">Delivery</dt>
            <dd>
              {deal.terms.deliveryMethod || <span className="text-[#8a8478]">—</span>}
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
        </section>

        <section className="rounded-2xl border border-[rgba(50,30,5,0.10)] bg-white p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
            Timeline
          </p>
          <ol className="mt-5 flex flex-col gap-4">
            {events.map((event, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-1 inline-block h-2 w-2 rounded-full ${
                    event.tone === "active" ? "bg-[#5266eb]" : "bg-[rgba(50,30,5,0.18)]"
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
        </section>

        {(deal.stripePaymentIntentId || deal.stripeTransferId) && (
          <section className="rounded-2xl border border-[rgba(50,30,5,0.10)] bg-white p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
              Stripe references
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-y-2 text-xs sm:grid-cols-[180px_1fr]">
              {deal.stripePaymentIntentId && (
                <>
                  <dt className="font-mono uppercase tracking-[0.12em] text-[#5a5548]">PaymentIntent</dt>
                  <dd className="font-mono">{deal.stripePaymentIntentId}</dd>
                </>
              )}
              {deal.stripeTransferId && (
                <>
                  <dt className="font-mono uppercase tracking-[0.12em] text-[#5a5548]">Transfer</dt>
                  <dd className="font-mono">{deal.stripeTransferId}</dd>
                </>
              )}
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}

function ActionPanel({ deal }: { deal: DealDetail }) {
  const { status, reference } = deal;
  const counterReceived =
    status === "DRAFT" && !!deal.buyer.committedAt;

  if (counterReceived) {
    return <CounterReconfirmPanel deal={deal} />;
  }

  if (status === "DRAFT") {
    return (
      <section className="rounded-2xl border border-[#c98a42]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#c98a42]">
          Deal in draft
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Continue capturing terms with Vera.
        </h2>
        <Link
          href="/new"
          className="mt-4 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
        >
          Continue draft →
        </Link>
      </section>
    );
  }

  if (status === "AWAITING_SELLER") {
    return (
      <section className="rounded-2xl border border-[#c98a42]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#c98a42]">
          Awaiting the other party
        </p>
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
      </section>
    );
  }

  if (status === "AGREED") {
    return (
      <section className="rounded-2xl border border-[#c98a42]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#c98a42]">
          Ready for joint sign-off
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Both parties: do the final sign-off together.
        </h2>
        <Link
          href={`/deal/${reference}/signoff`}
          className="mt-4 inline-block rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
        >
          Go to joint sign-off →
        </Link>
      </section>
    );
  }

  if (status === "IN_ESCROW") {
    return (
      <section className="rounded-2xl border border-[#7a6ce8]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7a6ce8]">
          Money is in escrow
        </p>
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
      </section>
    );
  }

  if (status === "RELEASED") {
    return (
      <section className="rounded-2xl border border-[#2f7d57]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2f7d57]">
          Released
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          The seller has been paid.
        </h2>
      </section>
    );
  }

  if (status === "DISPUTED" || status === "REVIEWING") {
    return (
      <section className="rounded-2xl border border-[#b54a3a]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#b54a3a]">
          {status === "DISPUTED" ? "Dispute open" : "Under review"}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Money stays in escrow until resolved.
        </h2>
        <Link
          href={`/deal/${reference}/dispute`}
          className="mt-4 inline-block rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6]"
        >
          View dispute →
        </Link>
      </section>
    );
  }

  return null;
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
      <section className="rounded-2xl border border-[#2f7d57]/40 bg-white p-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#2f7d57]">
          Re-confirmed · AWAITING_SELLER
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold leading-tight">
          Sent back to {deal.seller.firstName} for final agreement.
        </h2>
        <p className="mt-3 text-sm text-[#5a5548]">
          Refresh this page to see the updated state.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#c98a42]/40 bg-white p-7">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#c98a42]">
        {deal.seller.firstName} proposed changes
      </p>
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
    </section>
  );
}
