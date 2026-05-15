"use client";

import { useState } from "react";

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

export default function NewDealPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionId, string>>({
    item: "",
    counterparty: "",
    amount: "",
    delivery: "",
    extras: "",
  });
  const [draft, setDraft] = useState("");
  const [recording, setRecording] = useState(false);

  const current = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function commitAnswer() {
    if (!draft.trim()) return;
    setAnswers((prev) => ({ ...prev, [current.id]: draft.trim() }));
    setDraft("");
    if (!isLast) setStep(step + 1);
  }

  function previous() {
    if (step === 0) return;
    setStep(step - 1);
    setDraft(answers[QUESTIONS[step - 1].id]);
  }

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
        <header className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
            Vouch · New deal
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            Step {step + 1} of {QUESTIONS.length}
          </p>
        </header>

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
              aria-label={q.prompt}
            />
          ))}
        </ol>

        <section className="rounded-2xl border border-[rgba(50,30,5,0.10)] bg-white p-8 shadow-[0_4px_16px_rgba(40,20,5,0.04)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5266eb]">
            Vera · question {step + 1}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-[#2a2924]">
            {current.veraLine}
          </h2>

          <div className="mt-8 flex flex-col gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={current.placeholder}
              rows={3}
              className="w-full resize-none rounded-md border border-[rgba(50,30,5,0.18)] bg-[#fbfaf6] px-4 py-3 text-[15px] outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRecording((r) => !r)}
                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  recording
                    ? "border-[#b54a3a] bg-[rgba(181,74,58,0.08)] text-[#b54a3a]"
                    : "border-[rgba(50,30,5,0.18)] bg-white text-[#2a2924] hover:bg-[#fbfaf6]"
                }`}
                aria-pressed={recording}
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    recording ? "animate-pulse bg-[#b54a3a]" : "bg-[#8a8478]"
                  }`}
                />
                {recording ? "Recording…" : "Push to talk"}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={previous}
                  disabled={step === 0}
                  className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-4 py-2 text-sm font-medium text-[#2a2924] transition-colors hover:bg-[#fbfaf6] disabled:opacity-40"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={commitAnswer}
                  disabled={!draft.trim()}
                  className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
                >
                  {isLast ? "Review terms →" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5a5548]">
            Captured so far
          </p>
          <dl className="mt-3 divide-y divide-[rgba(50,30,5,0.10)] rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
            {QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  {q.prompt}
                </dt>
                <dd
                  className={
                    answers[q.id] ? "text-[#2a2924]" : "text-[#8a8478]"
                  }
                >
                  {answers[q.id] || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
          Day 2 scaffold · push-to-talk + ConvAI wiring lands once the Vera agent is provisioned.
        </p>
      </div>
    </main>
  );
}
