"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Eyebrow } from "@/components/ui";
import { VeraVoiceSession } from "@/components/VeraVoiceSession";

type Prefill = {
  source: string;
  item?: string;
  counterparty?: string;
  amount?: string;
  ref?: string;
};

const CURRENCY_SYMBOL: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

function formatAmount(price: string, currency: string): string {
  if (!price) return "";
  const symbol = CURRENCY_SYMBOL[currency];
  if (symbol) return `${symbol}${price}`;
  if (currency) return `${currency} ${price}`;
  return price;
}

type QuestionId = "item" | "counterparty" | "amount" | "delivery" | "extras";

type Question = {
  id: QuestionId;
  prompt: string;
  veraLine: string;
  placeholder: string;
};

const QUESTIONS: Question[] = [
  {
    id: "item",
    prompt: "What you're buying",
    veraLine:
      "What are you buying or paying for? Tell me model, condition, quantity — whatever matters.",
    placeholder: "iPhone 15, 256GB, white, unlocked",
  },
  {
    id: "counterparty",
    prompt: "The other party",
    veraLine: "Who's the other party? Just their first name and email or phone.",
    placeholder: "Marcus, m.adebayo@gmail.com",
  },
  {
    id: "amount",
    prompt: "Amount + currency",
    veraLine: "How much, in what currency?",
    placeholder: "£400",
  },
  {
    id: "delivery",
    prompt: "Delivery",
    veraLine: "When and how is it being delivered?",
    placeholder: "Royal Mail tracked, by Friday",
  },
  {
    id: "extras",
    prompt: "Anything else",
    veraLine:
      "Anything else that matters? Returns policy, what counts as 'received', anything you want on the record?",
    placeholder: "(optional)",
  },
];

type Stage = "preflight" | "questions" | "recitation" | "committed" | "error";

export default function NewDealPage() {
  const [stage, setStage] = useState<Stage>("preflight");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [dealId, setDealId] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({
    item: "",
    counterparty: "",
    amount: "",
    delivery: "",
    extras: "",
  });
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractText, setContractText] = useState<string | null>(null);
  const [notifyMethod, setNotifyMethod] = useState<"email" | "sms" | "none" | null>(null);
  const [prefill, setPrefill] = useState<Prefill | null>(null);

  // Read query params on mount (e.g. from the Chrome extension on an eBay listing).
  // If source=ebay (or any other extension source), pre-populate the captured terms
  // so Sarah only needs to confirm + answer Q4 (delivery) and Q5 (extras).
  //
  // Note: this is a one-shot effect (empty deps) that reads a browser-only global
  // and seeds state. It cannot loop. The react-hooks/set-state-in-effect rule
  // would prefer a lazy useState initializer, but lazy initializers run during
  // SSR too where `window` is undefined — leading to a hydration mismatch when
  // the client picks up the URL params. A guarded useEffect is the cleanest
  // pattern here.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const source = params.get("source");
    if (!source) return;

    const item = params.get("item") ?? undefined;
    const seller = params.get("seller") ?? undefined;
    const price = params.get("price") ?? "";
    const currency = params.get("currency") ?? "";
    const ref = params.get("ref") ?? undefined;
    const amount = formatAmount(price, currency);

    setPrefill({
      source,
      item: item || undefined,
      counterparty: seller || undefined,
      amount: amount || undefined,
      ref,
    });

    setAnswers((prev) => ({
      ...prev,
      ...(item ? { item } : {}),
      ...(seller ? { counterparty: seller } : {}),
      ...(amount ? { amount } : {}),
    }));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  async function startDeal() {
    if (!buyerName.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          buyer: {
            firstName: buyerName.trim(),
            email: buyerEmail.trim() || undefined,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? "create_failed");
      setDealId(json.id);
      setReference(json.reference);

      // If we have extension pre-fills, send them through extract-terms so the
      // backend deal state matches, then jump straight to Q4 (delivery).
      if (prefill) {
        const prefillStrings: string[] = [];
        if (prefill.item) prefillStrings.push(prefill.item);
        if (prefill.counterparty) prefillStrings.push(prefill.counterparty);
        if (prefill.amount) prefillStrings.push(prefill.amount);
        for (const utterance of prefillStrings) {
          await fetch("/api/vera/extract-terms", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ deal_id: json.id, user_input: utterance }),
          });
        }
        // Jump to delivery question (index 3) — first three are pre-filled
        setStep(3);
      }

      setStage("questions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function submitAnswer() {
    if (!draft.trim() || !dealId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/vera/extract-terms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: dealId, user_input: draft.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? "extract_failed");
      setAnswers((prev) => ({ ...prev, [current.id]: draft.trim() }));
      setDraft("");
      if (!isLast) {
        setStep(step + 1);
      } else {
        await hearContract();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function hearContract() {
    if (!dealId) return;
    setBusy(true);
    try {
      const res = await fetch("/api/vera/read-contract-back", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: dealId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? "recitation_failed");
      setContractText(json.spoken_text);
      setStage("recitation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!dealId) return;
    setBusy(true);
    try {
      const res = await fetch("/api/vera/commit-buyer-side", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: dealId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? "commit_failed");
      // Fire-and-forget seller-invitation notification. Failure here doesn't
      // block the buyer — they always get the link on-screen to share manually.
      fetch("/api/notify/seller-invitation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ deal_id: dealId }),
      })
        .then((r) => r.json())
        .then((r) => setNotifyMethod(r.method ?? "none"))
        .catch(() => setNotifyMethod("none"));
      setStage("committed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setBusy(false);
    }
  }

  function previous() {
    if (step === 0) return;
    setStep(step - 1);
    setDraft(answers[QUESTIONS[step - 1].id]);
  }

  // Pull the latest deal state and reflect any progress Vera made via her
  // server tools (extract_terms, commit_buyer_side, etc.). Called after a
  // voice session ends.
  const refreshFromServer = useCallback(async () => {
    if (!dealId) return;
    try {
      const res = await fetch(`/api/deals/${dealId}`, { cache: "no-store" });
      if (!res.ok) return;
      const { deal } = (await res.json()) as {
        deal: {
          status: string;
          terms: { item?: string; amountMinor?: number; currency?: string };
          seller: { firstName?: string };
        };
      };
      if (deal.status === "AWAITING_SELLER" || deal.status === "AGREED") {
        setStage("committed");
        return;
      }
      // Re-hydrate the answers strip from server terms so the next typed
      // answer continues from whatever Vera already captured.
      setAnswers((prev) => ({
        ...prev,
        item: deal.terms.item ?? prev.item,
        counterparty: deal.seller.firstName ?? prev.counterparty,
        amount:
          deal.terms.amountMinor && deal.terms.currency
            ? formatAmount(
                (deal.terms.amountMinor / 100).toString(),
                deal.terms.currency,
              )
            : prev.amount,
      }));
    } catch {
      // Best-effort refresh — failure is non-fatal, the user can keep typing.
    }
  }, [dealId]);

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <Eyebrow>
            Vouch · New deal {reference ? `· ${reference}` : ""}
          </Eyebrow>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            {stage === "questions"
              ? `Question ${step + 1} of ${QUESTIONS.length}`
              : stage === "preflight"
                ? "Pre-flight"
                : stage === "recitation"
                  ? "Read-back"
                  : "Committed"}
          </p>
        </header>

        {stage === "preflight" && prefill && (
          <Card tone="indigo" padding="loose" shadow>
            <Eyebrow tone="indigo">
              Continuing from {prefill.source === "ebay" ? "eBay" : prefill.source}
            </Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              I&rsquo;ve <span className="italic text-[#5266eb]">captured the basics</span>.
            </h2>
            <p className="mt-2 text-sm text-[#5a5548]">
              Confirm your name below and I&rsquo;ll skip ahead to delivery.
            </p>
            <dl className="mt-5 divide-y divide-[rgba(50,30,5,0.10)] rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
              {prefill.item && (
                <div className="grid grid-cols-[110px_1fr] gap-4 px-5 py-3 text-sm">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Item
                  </dt>
                  <dd className="text-[#2a2924]">{prefill.item}</dd>
                </div>
              )}
              {prefill.amount && (
                <div className="grid grid-cols-[110px_1fr] gap-4 px-5 py-3 text-sm">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Amount
                  </dt>
                  <dd className="text-[#2a2924]">{prefill.amount}</dd>
                </div>
              )}
              {prefill.counterparty && (
                <div className="grid grid-cols-[110px_1fr] gap-4 px-5 py-3 text-sm">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                    Seller
                  </dt>
                  <dd className="text-[#2a2924]">{prefill.counterparty}</dd>
                </div>
              )}
            </dl>
          </Card>
        )}

        {stage === "preflight" && (
          <Card padding="loose" shadow>
            <Eyebrow tone="indigo">Before Vera joins</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
              What&rsquo;s your <span className="italic text-[#5266eb]">first name?</span>
            </h1>
            <p className="mt-3 text-sm text-[#5a5548]">
              Vera will greet you by name and read terms back as you go. Email is optional and used to send the signoff link.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Sarah"
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
              />
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="sarah@example.com (optional)"
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
              />
              <button
                type="button"
                onClick={startDeal}
                disabled={busy || !buyerName.trim()}
                className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "Starting…" : "Start with Vera →"}
              </button>
              {error && (
                <p className="font-mono text-xs text-[#b54a3a]">{error}</p>
              )}
            </div>
          </Card>
        )}

        {stage === "questions" && (
          <>
            <ol className="flex gap-2">
              {QUESTIONS.map((q, i) => (
                <li
                  key={q.id}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < step
                      ? "bg-[#5266eb]"
                      : i === step
                        ? "bg-[#7a6ce8]"
                        : "bg-[rgba(50,30,5,0.12)]"
                  }`}
                  aria-current={i === step ? "step" : undefined}
                />
              ))}
            </ol>

            <Card padding="loose" shadow>
              <Eyebrow tone="indigo">Vera · question {step + 1}</Eyebrow>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
                {current.veraLine}
              </h2>

              <div className="mt-6">
                <VeraVoiceSession
                  sessionType="BUYER_ONBOARDING"
                  userFirstName={buyerName}
                  dealId={dealId ?? undefined}
                  disabled={!buyerName.trim()}
                  startLabel={`Talk to Vera about question ${step + 1}`}
                  onSessionEnd={refreshFromServer}
                />
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                  Or type your answer
                </p>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={current.placeholder}
                  rows={3}
                  className="w-full resize-none rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
                />
                <div className="flex items-center justify-end">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={previous}
                      disabled={step === 0 || busy}
                      className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium text-[#2a2924] transition-colors hover:bg-[#fbfaf6] disabled:opacity-40"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={submitAnswer}
                      disabled={!draft.trim() || busy}
                      className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
                    >
                      {busy ? "…" : isLast ? "Hear contract →" : "Next →"}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="font-mono text-xs text-[#b54a3a]">{error}</p>
                )}
              </div>
            </Card>

            <CapturedSummary answers={answers} questions={QUESTIONS} />
          </>
        )}

        {stage === "recitation" && contractText && (
          <Card tone="indigo" padding="loose" shadow>
            <Eyebrow tone="indigo">Vera reads back · contract voice</Eyebrow>
            <p className="mt-5 font-display text-xl font-medium leading-relaxed text-[#2a2924]">
              &ldquo;{contractText}&rdquo;
            </p>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setStage("questions")}
                disabled={busy}
                className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-[#fbfaf6] disabled:opacity-40"
              >
                ← Edit terms
              </button>
              <button
                type="button"
                onClick={confirm}
                disabled={busy}
                className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
              >
                {busy ? "Committing…" : "I confirm — send to other party →"}
              </button>
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
            )}
          </Card>
        )}

        {stage === "committed" && reference && (
          <Card tone="success" padding="loose" shadow>
            <Eyebrow tone="success">Locked in · AWAITING_SELLER</Eyebrow>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              Now <span className="italic text-[#5266eb]">share this link</span> with the other party.
            </h2>
            <p className="mt-2 text-sm text-[#5a5548]">
              The seller listens to your terms, then agrees, counters, or asks to clarify. When they agree, both of you do a quick joint sign-off.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`/deal/${reference}/seller`}
                className="block rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 font-mono text-sm text-[#5266eb] hover:bg-white"
              >
                {typeof window !== "undefined"
                  ? `${window.location.origin}/deal/${reference}/seller`
                  : `/deal/${reference}/seller`}
              </a>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
                {notifyMethod === "email"
                  ? "Notification stub: server logged an email-send to the other party. Real provider wires in Day 4+."
                  : notifyMethod === "sms"
                    ? "Notification stub: server logged an SMS-send to the other party. Real provider wires in Day 4+."
                    : notifyMethod === "none"
                      ? "No email or phone on the other party — share the link above with them directly."
                      : "Day 2 demo · email/SMS notification stub wires in once messaging provider is picked"}
              </p>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}

function CapturedSummary({
  answers,
  questions,
}: {
  answers: Record<QuestionId, string>;
  questions: Question[];
}) {
  return (
    <section>
      <Eyebrow>Captured so far</Eyebrow>
      <dl className="mt-3 divide-y divide-[rgba(50,30,5,0.10)] rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
        {questions.map((q) => (
          <div
            key={q.id}
            className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm"
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
              {q.prompt}
            </dt>
            <dd className={answers[q.id] ? "text-[#2a2924]" : "text-[#8a8478]"}>
              {answers[q.id] || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
