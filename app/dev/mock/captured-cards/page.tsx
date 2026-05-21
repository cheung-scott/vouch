/**
 * Dev-only mock page rendering single captured-term cards in isolation,
 * mirroring the styling of the CapturedSummary component on /new.
 * Used by demo-video Beat 3 where each card flies into the right panel
 * one at a time as Vera captures the term server-side.
 *
 * Visit /dev/mock/captured-cards → screenshot each labeled card section.
 */

export const metadata = {
  title: "Mock · Captured cards",
  robots: { index: false, follow: false },
};

const CARDS = [
  {
    filename: "b3-captured-card-item.png",
    label: "What you're buying",
    value: "Apple iPhone 15 Pro Max 512GB Blue Titanium",
  },
  {
    filename: "b3-captured-card-seller.png",
    label: "The other party",
    value: "Marcus",
  },
  {
    filename: "b3-captured-card-amount.png",
    label: "Amount + currency",
    value: "$609.89",
  },
  {
    filename: "b3-captured-card-delivery.png",
    label: "Expected by",
    value: "By Friday",
  },
];

const STRIP_EMPTY = [
  { label: "What you're buying", value: "—" },
  { label: "The other party", value: "—" },
  { label: "Amount + currency", value: "—" },
  { label: "Expected by", value: "—" },
  { label: "Anything else", value: "—" },
];

const STRIP_FULL = [
  { label: "What you're buying", value: "Apple iPhone 15 Pro Max 512GB Blue Titanium" },
  { label: "The other party", value: "Marcus" },
  { label: "Amount + currency", value: "$609.89" },
  { label: "Expected by", value: "By Friday" },
  { label: "Anything else", value: "—" },
];

export default function CapturedCardsMockPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Mock · captured cards · isolated for demo capture
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Single cards + full strip states
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Each section is a standalone screenshot target. Cards mirror
            the CapturedSummary component on /new exactly — same fonts,
            colors, spacing.
          </p>
        </header>

        {/* Single cards (b3-captured-card-*) */}
        {CARDS.map((c) => (
          <section key={c.filename} className="flex flex-col gap-2">
            <div className="rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
              <div className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  {c.label}
                </dt>
                <dd className="text-[#2a2924]">{c.value}</dd>
              </div>
            </div>
            <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
              {c.filename}
            </code>
          </section>
        ))}

        {/* Strip empty (b3-captured-strip-empty) */}
        <section className="flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Captured so far
          </p>
          <div className="divide-y divide-[rgba(50,30,5,0.10)] rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
            {STRIP_EMPTY.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  {row.label}
                </dt>
                <dd className="text-[#8a8478]">{row.value}</dd>
              </div>
            ))}
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b3-captured-strip-empty.png
          </code>
        </section>

        {/* Strip full (b3-captured-strip-full) */}
        <section className="flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Captured so far
          </p>
          <div className="divide-y divide-[rgba(50,30,5,0.10)] rounded-xl border border-[rgba(50,30,5,0.10)] bg-white">
            {STRIP_FULL.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3 text-sm"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#5a5548]">
                  {row.label}
                </dt>
                <dd className={row.value === "—" ? "text-[#8a8478]" : "text-[#2a2924]"}>
                  {row.value}
                </dd>
              </div>
            ))}
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b3-captured-strip-full.png
          </code>
        </section>
      </div>
    </main>
  );
}
