"use client";

import { useEffect, useState } from "react";

type Stats = {
  completed: number;
  refunded: number;
  in_flight: number;
  disputed: number;
  total: number;
  dispute_rate: number;
  total_amount_minor: number;
  new_to_vouch: boolean;
};

/**
 * Compact reputation badge for a seller, keyed off their Stripe Connect
 * account ID. Shows: completed deal count, dispute rate (if any), "new
 * to Vouch" framing for first-time sellers.
 *
 * The pitch this enables (per submission framing): the voice recording
 * is the protection that bridges trust from deal 1; the deal count
 * becomes the rep accumulator from there.
 */
export function SellerRepBadge({
  accountId,
  sellerFirstName,
  variant = "inline",
}: {
  accountId?: string | null;
  sellerFirstName?: string;
  variant?: "inline" | "card";
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) {
      setStats(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/seller-stats?account_id=${encodeURIComponent(accountId)}`,
          { cache: "no-store" },
        );
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(json.error ?? "stats_failed");
          return;
        }
        setStats(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "unknown");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  if (!accountId || error) return null;

  if (!stats) {
    return (
      <span
        className={
          variant === "card"
            ? "block animate-pulse rounded-md border border-[rgba(50,30,5,0.10)] bg-white px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]"
            : "inline-block animate-pulse font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]"
        }
      >
        Loading rep…
      </span>
    );
  }

  if (stats.new_to_vouch) {
    if (variant === "card") {
      return (
        <div className="rounded-md border border-[rgba(50,30,5,0.10)] bg-white px-3 py-2 text-xs">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
            Vouch reputation
          </p>
          <p className="mt-1 leading-relaxed text-[#5a5548]">
            {sellerFirstName
              ? `${sellerFirstName} is new to Vouch.`
              : "New to Vouch."}{" "}
            The voice recording on this deal is your protection.
          </p>
        </div>
      );
    }
    return (
      <span className="inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
        New to Vouch · voice is the protection
      </span>
    );
  }

  const completedLabel = `${stats.completed} completed deal${
    stats.completed === 1 ? "" : "s"
  }`;
  const disputeLabel =
    stats.dispute_rate > 0
      ? `${Math.round(stats.dispute_rate * 100)}% disputed`
      : "no disputes";

  if (variant === "card") {
    return (
      <div className="rounded-md border border-[#5266eb]/30 bg-[#5266eb]/6 px-3 py-2 text-xs">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5266eb]">
          Vouch reputation
        </p>
        <p className="mt-1 leading-relaxed text-[#2a2924]">
          <span className="font-semibold">{completedLabel}</span>
          <span className="mx-1.5 text-[#8a8478]">·</span>
          <span>{disputeLabel}</span>
          {stats.total_amount_minor > 0 && (
            <>
              <span className="mx-1.5 text-[#8a8478]">·</span>
              <span>£{(stats.total_amount_minor / 100).toFixed(0)} moved</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#5266eb]/30 bg-[#5266eb]/8 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#5266eb]">
      <span>{stats.completed}</span>
      <span className="text-[#8a8478]">·</span>
      <span>{disputeLabel}</span>
    </span>
  );
}
