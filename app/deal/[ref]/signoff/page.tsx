"use client";

import { use, useCallback, useEffect, useState } from "react";
import { Card, Eyebrow, MoneyAmount } from "@/components/ui";
import { VeraVoiceSession } from "@/components/VeraVoiceSession";
import { displayPartyName, statusDisplay } from "@/lib/utils";

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
  // Who's currently sitting at this screen? The joint sign-off is a
  // shared session and Vera's greeting + counterparty inference need to
  // know the actual speaker. Default to buyer (URL path arrives here
  // from /new) but allow swap before starting voice.
  const [speaker, setSpeaker] = useState<"buyer" | "seller">("buyer");

  const refreshDeal = useCallback(async () => {
    const res = await fetch(`/api/deals/${ref}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "deal_not_found");
    setDeal(json.deal);
    return json.deal as DealView;
  }, [ref]);

  // After a voice session ends, pull fresh deal state and let any escrow
  // advancement (Vera called lock_escrow / release_escrow) reflect in the UI.
  // If Vera ended the call WITHOUT advancing escrow (e.g. she hung up after
  // reading the contract without the user's confirmation phrase landing
  // clearly), drop the user into the on-screen recitation flow so they have
  // a visible "tick + lock" path forward — otherwise the page just sits
  // there with no apparent next step. Same for VOICE_RECEIPT in IN_ESCROW
  // stage: if release didn't fire, the manual "Tap to release" button is
  // already on-screen so we just leave the stage as-is.
  const refreshAndReflectStage = useCallback(async () => {
    try {
      const d = await refreshDeal();
      if (d.status === "IN_ESCROW") {
        setStage("in_escrow");
        return;
      }
      if (d.status === "RELEASED") {
        setStage("released");
        return;
      }
      if (d.status === "AGREED" && stage === "ready") {
        // Vera ended the joint sign-off without lock_escrow firing. Pre-load
        // the recitation text and surface the tickbox + manual lock UI so
        // the parties can finish manually.
        try {
          const res = await fetch("/api/vera/read-contract-back", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ deal_id: d.id }),
          });
          const json = await res.json();
          if (res.ok && json.spoken_text) {
            setRecitation(json.spoken_text);
            setStage("recitation");
          }
        } catch {
          // Non-fatal — user can tap "Read the agreement on-screen" manually.
        }
      }
    } catch {
      // Non-fatal: leave the page on its current stage.
    }
  }, [refreshDeal, stage]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await refreshDeal();
        if (cancelled) return;
        if (d.status === "IN_ESCROW") setStage("in_escrow");
        else if (d.status === "RELEASED") setStage("released");
        else if (d.status === "AGREED") setStage("ready");
        else if (d.status === "AWAITING_SELLER") {
          setError(
            `${displayPartyName(d.seller.firstName, "the seller")} hasn't agreed to the terms yet. Share the seller invitation link with them first — once they say "I agree", come back here for the joint sign-off.`,
          );
          setStage("error");
        } else if (d.status === "DRAFT") {
          setError(
            "This deal isn't ready for sign-off yet. Finish capturing terms with Vera first.",
          );
          setStage("error");
        } else {
          setError(`Deal is ${d.status} — sign-off isn't available.`);
          setStage("error");
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
      if (!res.ok) {
        // 409 invalid_state is expected when Vera already locked the deal
        // via voice (the page didn't refresh in time) — refresh and, if
        // the deal really is IN_ESCROW, treat the click as a no-op and
        // advance the UI rather than surfacing a scary "invalid_state"
        // error to the user.
        if (res.status === 409) {
          const d = await refreshDeal();
          if (d.status === "IN_ESCROW") {
            setStage("in_escrow");
            return;
          }
          if (d.status === "RELEASED") {
            setStage("released");
            return;
          }
        }
        throw new Error(json.error ?? "lock_failed");
      }
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
          <Eyebrow>Vouch · Joint sign-off · {ref}</Eyebrow>
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

        {deal && (stage === "ready" || stage === "recitation") && (
          <Card padding="loose" shadow>
            <Eyebrow tone="indigo">Vera · final agreement</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              {displayPartyName(deal.buyer.firstName, "Buyer")} and {displayPartyName(deal.seller.firstName, "Seller")}, here it is.
            </h1>
            <p className="mt-2 font-mono text-sm text-[#5a5548]">
              <MoneyAmount
                amountMinor={deal.terms.amountMinor}
                currency={deal.terms.currency}
              />{" "}
              for {deal.terms.item}
            </p>

            {stage === "ready" && (
              <div className="mt-8 flex flex-col gap-3">
                <SpeakerPicker
                  buyerName={displayPartyName(deal.buyer.firstName, "Buyer")}
                  sellerName={displayPartyName(deal.seller.firstName, "Seller")}
                  value={speaker}
                  onChange={setSpeaker}
                />
                <VeraVoiceSession
                  sessionType="JOINT_SIGNOFF"
                  userFirstName={
                    speaker === "buyer"
                      ? displayPartyName(deal.buyer.firstName, "Buyer")
                      : displayPartyName(deal.seller.firstName, "Seller")
                  }
                  dealId={deal.id}
                  startLabel="Have Vera mediate the joint sign-off"
                  autoStart
                  onSessionEnd={refreshAndReflectStage}
                />
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                  or
                </p>
                <button
                  type="button"
                  onClick={startRecitation}
                  disabled={busy}
                  className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
                >
                  {busy ? "…" : "Read the agreement on-screen"}
                </button>
              </div>
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
                        {displayPartyName(deal.buyer.firstName, "Buyer")} agrees
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
                        {displayPartyName(deal.seller.firstName, "Seller")} agrees
                      </span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={bothConfirmed}
                    disabled={busy || !buyerAgreed || !sellerAgreed}
                    className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
                  >
                    {busy ? (
                      "Locking funds…"
                    ) : (
                      <>
                        Lock{" "}
                        <MoneyAmount
                          amountMinor={deal.terms.amountMinor}
                          currency={deal.terms.currency}
                        />{" "}
                        safely →
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </Card>
        )}

        {stage === "in_escrow" && deal && (
          <Card tone="locked" padding="loose">
            <Eyebrow tone="locked">Money held · awaiting receipt</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              <MoneyAmount
                amountMinor={deal.terms.amountMinor}
                currency={deal.terms.currency}
              />{" "}
              <span className="italic text-[#7a6ce8]">is locked</span>.
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">
              {displayPartyName(deal.seller.firstName, "Seller")}, ship the item or do the work. {displayPartyName(deal.buyer.firstName, "Buyer")},
              I&rsquo;ll be here when it&rsquo;s time to release the money.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <VeraVoiceSession
                sessionType="VOICE_RECEIPT"
                userFirstName={displayPartyName(deal.buyer.firstName, "Buyer")}
                dealId={deal.id}
                startLabel={`${displayPartyName(deal.buyer.firstName, "Buyer")} — confirm receipt by voice`}
                autoStart
                onSessionEnd={refreshAndReflectStage}
              />
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                Receipt confirmation is buyer-only by design — Vera releases
                the money only when the buyer says so.
              </p>
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                or
              </p>
              <button
                type="button"
                onClick={confirmReceipt}
                disabled={busy}
                className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy
                  ? "Releasing…"
                  : `Tap to release →`}
              </button>
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </Card>
        )}

        {stage === "released" && deal && (
          <Card tone="success" padding="loose">
            <Eyebrow tone="success">
              RELEASED · {displayPartyName(deal.seller.firstName, "Seller")} paid
            </Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              <MoneyAmount
                amountMinor={deal.terms.amountMinor}
                currency={deal.terms.currency}
              />{" "}
              <span className="italic text-[#2f7d57]">released</span> to{" "}
              {displayPartyName(deal.seller.firstName, "Seller")}.
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">Thanks for using Vouch.</p>
          </Card>
        )}
      </div>
    </main>
  );
}

function SpeakerPicker({
  buyerName,
  sellerName,
  value,
  onChange,
}: {
  buyerName: string;
  sellerName: string;
  value: "buyer" | "seller";
  onChange: (next: "buyer" | "seller") => void;
}) {
  const options: { id: "buyer" | "seller"; label: string }[] = [
    { id: "buyer", label: buyerName },
    { id: "seller", label: sellerName },
  ];
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#5a5548]">
        Who&rsquo;s speaking now?
      </p>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex-1 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              value === opt.id
                ? "border-[#5266eb] bg-[#e2e6fb] text-[#2a2924]"
                : "border-[rgba(50,30,5,0.18)] bg-white text-[#5a5548] hover:bg-[#fbfaf6]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
