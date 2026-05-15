"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eyebrow, MoneyAmount, StatusPill } from "@/components/ui";
import type { DealStatus } from "@/types/deal";

type DealRow = {
  id: string;
  reference: string;
  status: DealStatus;
  amount: number;
  currency: string;
  item: string;
  buyerName: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
};

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/deals", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "failed");
        if (cancelled) return;
        setDeals(json.deals);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "unknown");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex items-end justify-between">
          <div>
            <Eyebrow>Vouch · Deals</Eyebrow>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight">
              Your <span className="italic text-[#5266eb]">deals</span>.
            </h1>
          </div>
          <Link
            href="/new"
            className="rounded-md bg-[#635bff] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
          >
            New deal →
          </Link>
        </header>

        {loading && <p className="text-sm text-[#8a8478]">Loading…</p>}
        {error && (
          <p className="font-mono text-sm text-[#b54a3a]">
            Couldn&rsquo;t load deals: {error}
          </p>
        )}
        {!loading && deals.length === 0 && (
          <section className="rounded-2xl border border-[rgba(50,30,5,0.10)] bg-white p-12 text-center">
            <Eyebrow>No deals yet</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              Start your first <span className="italic text-[#5266eb]">handshake</span>.
            </h2>
            <Link
              href="/new"
              className="mt-6 inline-block rounded-md bg-[#635bff] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
            >
              Speak a deal →
            </Link>
          </section>
        )}

        {!loading && deals.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[rgba(235,232,224,0.4)] text-left">
                <tr>
                  <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Reference
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Item
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Parties
                  </th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Amount
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Status
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => (
                  <tr
                    key={d.id}
                    className="border-t border-[rgba(50,30,5,0.10)] transition-colors hover:bg-[rgba(251,250,246,0.6)]"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/deal/${d.reference}`}
                        className="font-mono text-xs text-[#5266eb] hover:underline"
                      >
                        {d.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      {d.item || <span className="text-[#8a8478]">—</span>}
                    </td>
                    <td className="px-5 py-3 text-[#5a5548]">
                      {d.buyerName} → {d.sellerName}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <MoneyAmount
                        amountMinor={d.amount}
                        currency={d.currency}
                        bold
                      />
                    </td>
                    <td className="px-5 py-3">
                      <StatusPill
                        status={d.status}
                        pulse={d.status === "IN_ESCROW"}
                      />
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-[#8a8478]">
                      {relative(d.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
