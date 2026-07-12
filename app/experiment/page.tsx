import Link from "next/link";

/* ────────────────────────────────────────────────────────────────
   VOUCH / EXPERIMENT — "Notary Ledger"
   Side exploration living at /experiment, alongside the production
   landing (app/page.tsx). Not a replacement.

   Direction: trust as PAPERWORK, not polish. The voice record is
   treated as a physical artifact: a manila deal ticket, ink rules,
   a banker's-green hold, a vermilion rubber stamp. The Stripe
   test-mode disclosure is styled as a banknote SPECIMEN mark,
   which keeps the honesty requirement AND the aesthetic.

   Hard rules carried over from production (design feedback 1-5):
   - No "escrow" anywhere. "Held by Stripe" / "on hold".
   - No italic+gradient text. Emphasis = stamps and ink rules.
   - No em-dashes in copy.
   - One pricing tier: 2.9%, zero markup on Stripe. Nothing else.
   - Comparison table, never invented testimonials.
   - No overclaiming: this runs in Stripe test mode and says so.

   Server component. All motion is CSS, gated on
   prefers-reduced-motion in experiment.css.
   ──────────────────────────────────────────────────────────────── */

export default function ExperimentPage() {
  return (
    <main className="min-h-screen">
      <TopBar />
      <Hero />
      <Loop />
      <Replay />
      <Terms />
      <Colophon />
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════
   TOP BAR — a form header, not a navbar
   ════════════════════════════════════════════════════════════════ */

function TopBar() {
  return (
    <header className="xp-rule-b">
      <div className="mx-auto flex max-w-[1200px] items-stretch justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/experiment"
          className="xp-display flex items-center py-4 text-[22px] tracking-tight"
        >
          VOUCH
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
          <a href="#loop" className="xp-label hover:text-[var(--xp-green)]">
            How it works
          </a>
          <a href="#replay" className="xp-label hover:text-[var(--xp-green)]">
            The record
          </a>
          <a href="#terms" className="xp-label hover:text-[var(--xp-green)]">
            Terms
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <span className="xp-label hidden text-[var(--xp-ink-soft)] lg:inline">
            Form V-1 · Payment protection
          </span>
          <Link href="/new" className="xp-btn xp-btn--primary xp-btn--sm my-3">
            Start a deal
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO — the claim, and the artifact that backs it up
   ════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section aria-labelledby="xp-hero-heading" className="xp-rule-b">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-20">
        {/* left: claim */}
        <div>
          <p className="xp-label mb-6 text-[var(--xp-ink-soft)]">
            Voice-confirmed payments for P2P sellers and freelancers
          </p>

          <h1 id="xp-hero-heading" className="xp-display text-[clamp(44px,7.5vw,92px)]">
            Your word
            <br />
            is the
            <br />
            contract.
          </h1>

          <div className="mt-6">
            <span className="xp-stamp xp-stamp--red">Every deal, kept</span>
          </div>

          <p className="mt-8 max-w-[46ch] text-[17px] leading-[1.65] text-[var(--xp-ink-soft)]">
            Vera, a voice agent, takes the deal down in both your voices. Stripe
            holds the buyer&apos;s money until the goods arrive as promised. And
            if anyone backs out, the recording settles it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/new" className="xp-btn xp-btn--primary">
              Start a deal
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/demo" className="xp-btn xp-btn--ghost">
              Watch the demo
            </Link>
          </div>

          {/* facts strip: honest, mono, on the record */}
          <dl className="xp-mono mt-12 grid max-w-[560px] grid-cols-1 gap-x-8 gap-y-3 text-[12.5px] sm:grid-cols-3">
            <div className="xp-rule pt-3">
              <dt className="xp-label text-[var(--xp-ink-soft)]">Fee</dt>
              <dd className="mt-1 font-semibold">2.9% per deal, nothing else</dd>
            </div>
            <div className="xp-rule pt-3">
              <dt className="xp-label text-[var(--xp-ink-soft)]">Custody</dt>
              <dd className="mt-1 font-semibold">Funds held by Stripe</dd>
            </div>
            <div className="xp-rule pt-3">
              <dt className="xp-label text-[var(--xp-ink-soft)]">Status</dt>
              <dd className="mt-1 font-semibold text-[var(--xp-red)]">
                Specimen · Stripe test mode
              </dd>
            </div>
          </dl>
        </div>

        {/* right: the deal record ticket */}
        <div className="lg:pt-2">
          <DealTicket />
        </div>
      </div>
    </section>
  );
}

function DealTicket() {
  // Deterministic bar heights: rendered on the server, no hydration drift.
  const bars = [18, 46, 72, 95, 60, 84, 38, 22, 66, 30, 52, 88, 44, 70, 26, 58, 92, 34, 76, 48];

  return (
    <figure className="xp-card mx-auto max-w-[440px] -rotate-1">
      <figcaption className="sr-only">
        Example of a Vouch deal record: spoken terms, amount held by Stripe,
        and the voice waveform that serves as evidence.
      </figcaption>

      {/* ticket header */}
      <div className="xp-rule-b flex items-baseline justify-between px-5 py-3.5">
        <span className="xp-label">Vouch · Deal record</span>
        <span className="xp-mono text-[12px] font-semibold">Nº 000412</span>
      </div>

      {/* parties + item */}
      <div className="space-y-4 px-5 py-5">
        <TicketRow label="Seller" value="Marcus W." />
        <TicketRow label="Buyer" value="Priya S." />
        <TicketRow label="Item" value="iPhone 14 Pro, 256 GB" />
        <TicketRow label="Amount" value="$400.00 USD" strong />
      </div>

      {/* spoken terms */}
      <div className="xp-rule px-5 py-5">
        <p className="xp-label mb-2 text-[var(--xp-ink-soft)]">
          Terms, as spoken
        </p>
        <blockquote className="text-[17px] font-semibold leading-snug">
          &ldquo;No scratches. Original box. Ships Tuesday.&rdquo;
        </blockquote>
        <div className="xp-wave xp-wave--green mt-4" aria-hidden="true">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="xp-mono mt-2 text-[11px] text-[var(--xp-ink-soft)]">
          Recorded at agreement · Scribe v2 transcript · immutable
        </p>
      </div>

      {/* perforation + status */}
      <div className="xp-perf flex items-center justify-between px-5 py-4">
        <span className="xp-stamp xp-stamp--green">Funds held</span>
        <p className="xp-mono max-w-[19ch] text-right text-[11px] leading-snug text-[var(--xp-ink-soft)]">
          Held by Stripe until receipt is voice-confirmed
        </p>
      </div>
    </figure>
  );
}

function TicketRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="xp-label text-[var(--xp-ink-soft)]">{label}</span>
      <span
        className={`xp-mono text-[14px] ${strong ? "text-[17px] font-semibold" : "font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   LOOP — how a deal gets kept, as ledger entries
   State tags are the real server-side state machine, verbatim.
   ════════════════════════════════════════════════════════════════ */

const STEPS = [
  {
    n: "01",
    title: "Speak it.",
    body: "Buyer and seller each talk the deal through with Vera. Price, condition, timing: the terms leave your mouth and land in the record, in your own voice.",
    state: "DRAFT → AGREED",
  },
  {
    n: "02",
    title: "Hold it.",
    body: "Stripe authorises the buyer's card and puts the money on hold. The seller ships knowing the funds exist. The buyer pays knowing they haven't left yet.",
    state: "MONEY_HELD",
  },
  {
    n: "03",
    title: "Confirm it.",
    body: "The item arrives. The buyer says so, out loud, to Vera. That confirmation joins the record next to the original promise.",
    state: "RECEIPT CONFIRMED",
  },
  {
    n: "04",
    title: "Release it.",
    body: "Stripe pays the seller. The deal record files itself away, in case anyone ever asks what was agreed.",
    state: "RELEASED",
  },
] as const;

function Loop() {
  return (
    <section id="loop" aria-labelledby="xp-loop-heading" className="xp-rule-b">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 id="xp-loop-heading" className="xp-h2 max-w-[16ch] text-[clamp(32px,4.5vw,52px)]">
            How a deal gets kept.
          </h2>
          <p className="xp-label text-[var(--xp-ink-soft)]">
            Ledger · four entries per deal
          </p>
        </div>

        <ol className="list-none">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="xp-rule grid grid-cols-[56px_1fr] gap-x-5 gap-y-3 py-7 sm:grid-cols-[90px_1fr_auto] sm:gap-x-8 lg:py-9"
            >
              <span
                aria-hidden="true"
                className="xp-display text-[clamp(30px,3.5vw,44px)] text-[var(--xp-green)]"
              >
                {step.n}
              </span>
              <div className="max-w-[58ch]">
                <h3 className="xp-h2 text-[22px] sm:text-[26px]">{step.title}</h3>
                <p className="mt-2 text-[15.5px] leading-[1.65] text-[var(--xp-ink-soft)]">
                  {step.body}
                </p>
              </div>
              <span className="xp-mono col-start-2 self-start border-2 border-[var(--xp-ink)] px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] sm:col-start-3 sm:justify-self-end">
                {step.state}
              </span>
            </li>
          ))}
        </ol>

        <p className="xp-rule xp-mono pt-6 text-[13px] font-medium">
          Deal goes sideways instead? <span aria-hidden="true">↓</span> That is
          what the record is for.
        </p>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   REPLAY — disputes end where they started: the recording
   Dark banker's-green plate. The one theatrical moment.
   ════════════════════════════════════════════════════════════════ */

function Replay() {
  const bars = [30, 64, 88, 42, 96, 58, 74, 24, 50, 82, 36, 68, 90, 46, 20, 62, 78, 40];

  return (
    <section
      id="replay"
      aria-labelledby="xp-replay-heading"
      className="xp-rule-b bg-[var(--xp-green-deep)] text-[var(--xp-paper)]"
    >
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-24">
        <div>
          <p className="xp-label mb-6 text-[var(--xp-paper)]/60">
            When a deal is disputed
          </p>
          <h2
            id="xp-replay-heading"
            className="xp-h2 max-w-[14ch] text-[clamp(32px,4.5vw,52px)]"
          >
            Disputes end where they started: the recording.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[16px] leading-[1.65] text-[var(--xp-paper)]/75">
            No screenshots. No he-said, she-said. Vera replays what was
            actually promised, in the voice that promised it, then resolves
            against the record.
          </p>
          <ul className="xp-mono mt-8 flex flex-wrap gap-3 text-[12px] font-medium">
            {["REFUND THE BUYER", "PAY THE SELLER", "SPLIT IT"].map((o) => (
              <li key={o} className="border-2 border-[var(--xp-paper)]/40 px-3 py-1.5">
                {o}
              </li>
            ))}
          </ul>
        </div>

        {/* evidence playback card */}
        <figure className="xp-card rotate-1 self-start text-[var(--xp-ink)] lg:mt-4">
          <figcaption className="sr-only">
            Example of dispute evidence playback: the original recorded
            commitment replayed inside a dispute.
          </figcaption>

          <div className="xp-rule-b flex items-baseline justify-between px-5 py-3.5">
            <span className="xp-label">Dispute Nº 0231</span>
            <span className="xp-mono text-[12px] font-semibold">Evidence playback</span>
          </div>

          <div className="px-5 py-6">
            <blockquote className="xp-h2 text-[clamp(22px,2.6vw,30px)]">
              &ldquo;No scratches. Original box. Ships Tuesday.&rdquo;
            </blockquote>
            <p className="xp-mono mt-3 text-[12px] text-[var(--xp-ink-soft)]">
              Marcus W. · recorded at agreement · 14:32 UTC
            </p>

            <div className="xp-wave mt-6" aria-hidden="true">
              {bars.map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>

            {/* static playback position: decorative */}
            <div aria-hidden="true" className="mt-4">
              <div className="h-[6px] w-full border-2 border-[var(--xp-ink)]">
                <div className="h-full w-[38%] bg-[var(--xp-green)]" />
              </div>
              <p className="xp-mono mt-2 text-[11px] text-[var(--xp-ink-soft)]">
                00:12 / 00:31
              </p>
            </div>
          </div>

          <div className="xp-perf flex items-center justify-between px-5 py-4">
            <span className="xp-stamp xp-stamp--red">Resolved from the record</span>
            <span className="xp-mono text-[11px] text-[var(--xp-ink-soft)]">
              Outcome: refund
            </span>
          </div>
        </figure>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   TERMS — one honest number, then the comparison table
   ════════════════════════════════════════════════════════════════ */

function Terms() {
  return (
    <section id="terms" aria-labelledby="xp-terms-heading" className="xp-rule-b">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:py-24">
        <h2 id="xp-terms-heading" className="xp-h2 text-[clamp(32px,4.5vw,52px)]">
          The terms, plainly.
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* pricing: one tier, no games */}
          <div>
            <p className="xp-display text-[clamp(72px,10vw,120px)] text-[var(--xp-green)]">
              2.9<span className="text-[0.55em]">%</span>
            </p>
            <p className="xp-mono mt-1 text-[13px] font-semibold">
              per deal · zero markup on Stripe&apos;s rate
            </p>
            <p className="mt-5 max-w-[38ch] text-[15.5px] leading-[1.65] text-[var(--xp-ink-soft)]">
              That is Stripe&apos;s processing fee, passed through. No
              subscription, no listing fee, no percentage games. Every deal
              includes:
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "The agreement, recorded in both voices",
                "Funds held by Stripe until receipt",
                "Voice-confirmed release to the seller",
                "Dispute mediation by replaying the record",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] font-medium">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="mt-[3px] h-4 w-4 shrink-0"
                    fill="none"
                    stroke="var(--xp-green)"
                    strokeWidth="3.2"
                    strokeLinecap="square"
                  >
                    <path d="M4 12.5 10 18.5 20 5.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* comparison, not testimonials */}
          <div className="min-w-0">
            <p className="xp-label mb-4 text-[var(--xp-ink-soft)]">
              Against the usual options
            </p>
            <div className="overflow-x-auto">
              <table className="xp-table min-w-[560px] text-[14px]">
                <caption className="sr-only">
                  Comparison of Vouch with PayPal Goods and Services and a
                  direct bank transfer.
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[30%]">
                      <span className="sr-only">Feature</span>
                    </th>
                    <th scope="col" className="xp-col-vouch">Vouch</th>
                    <th scope="col">PayPal G&amp;S</th>
                    <th scope="col">Bank transfer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="xp-label text-[var(--xp-ink-soft)]">
                      Fee per deal
                    </th>
                    <td className="xp-col-vouch xp-mono">2.9%</td>
                    <td className="xp-mono">2.99% + $0.30</td>
                    <td className="xp-mono">0%</td>
                  </tr>
                  <tr>
                    <th scope="row" className="xp-label text-[var(--xp-ink-soft)]">
                      Money held until receipt
                    </th>
                    <td className="xp-col-vouch">Yes, by Stripe</td>
                    <td>Buyer side only</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <th scope="row" className="xp-label text-[var(--xp-ink-soft)]">
                      Terms on record
                    </th>
                    <td className="xp-col-vouch">Both voices, recorded</td>
                    <td>Chat logs, if kept</td>
                    <td>Nothing</td>
                  </tr>
                  <tr>
                    <th scope="row" className="xp-label text-[var(--xp-ink-soft)]">
                      When it goes wrong
                    </th>
                    <td className="xp-col-vouch">Replay the recording</td>
                    <td>Weeks of claim forms</td>
                    <td>Good luck</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/new" className="xp-btn xp-btn--primary">
                Start a deal
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/demo" className="xp-btn xp-btn--ghost">
                Watch the demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   COLOPHON — honest footer, plus the way back
   ════════════════════════════════════════════════════════════════ */

function Colophon() {
  return (
    <footer className="bg-[var(--xp-ink)] text-[var(--xp-paper)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <p className="xp-mono text-[12px] leading-relaxed text-[var(--xp-paper)]/70">
          VOUCH · EVERY DEAL, KEPT · BUILT ON STRIPE + ELEVENLABS
          <br />
          Hackathon build. Runs in Stripe test mode. MIT licensed.
        </p>
        <p className="xp-mono text-[12px]">
          <span className="text-[var(--xp-paper)]/50">
            This page is a design experiment.{" "}
          </span>
          <Link href="/" className="underline underline-offset-4 hover:text-[var(--xp-paper)]/80">
            See the current landing
          </Link>
        </p>
      </div>
    </footer>
  );
}
