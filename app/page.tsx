import Link from "next/link";

// Landing-page sections — Stripe × A24 marketing mode per DESIGN.md §1.
// Pure black canvas, oversized italic serif headlines, Stripe purple as the
// only CTA, A24 red as a one-per-page accent. Cinematic-but-trust-preserving.

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Hero />
      <MoatBand />
      <HowItWorks />
      <ICPs />
      <DisputeMoment />
      <BuiltOn />
      <ClosingCTA />
      <Footer />
    </main>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Hero
// ──────────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 px-6 pb-32 pt-28 md:pt-36">
      {/* Ambient blob layers (lightweight version of DESIGN.md §7.1) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-12 h-[420px] w-[420px] rounded-full bg-[#635bff] opacity-30 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-40 h-[320px] w-[320px] rounded-full bg-[#d9351c] opacity-[0.12] blur-[110px]"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10 text-center">
        <Eyebrow tone="white">Coming soon · ElevenHacks 2026</Eyebrow>

        <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
          The handshake,
          <br />
          <span className="bg-gradient-to-br from-white via-violet-300 to-[#635bff] bg-clip-text italic text-transparent">
            on the record.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-white/70 md:text-xl">
          Voice-recorded escrow for freelancers and high-value peer-to-peer
          sales. Vera, our AI mediator, captures the agreement on both sides.
          Stripe holds the money. Every commitment is your voice on the record.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <PrimaryCTA href="/new" label="Start a deal →" />
          <SecondaryCTA href="/demo" label="See the demo" />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
          Built on Stripe Connect + ElevenLabs ConvAI · 5% per deal
        </p>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Moat band — the "evidence is the promise" pitch
// ──────────────────────────────────────────────────────────────────────────

function MoatBand() {
  return (
    <section className="border-b border-white/10 px-6 py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 text-center">
        <Eyebrow tone="red">The moat</Eyebrow>
        <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Other escrow services arbitrate{" "}
          <span className="text-white/40">from text trails.</span>
          <br />
          Vouch arbitrates{" "}
          <span className="bg-gradient-to-br from-white via-violet-300 to-[#635bff] bg-clip-text italic text-transparent">
            from your voice.
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg">
          When something arrives broken, Vera replays the original commitment
          in the seller&rsquo;s own voice. The seller cannot un-say it. The
          evidence is the promise — not a Messenger screenshot.
        </p>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// How it works
// ──────────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    title: "Speak the deal with Vera",
    body: "Both parties answer five short questions in their own voice. Vera captures terms, currencies, and delivery dates as you talk.",
  },
  {
    n: "02",
    title: "Joint sign-off",
    body: 'Vera reads the final agreement back. Both parties say "I agree" in their own voice. The recording is the contract.',
  },
  {
    n: "03",
    title: "Stripe locks the money",
    body: "Payment intent authorised, escrow held by Stripe Connect. A frozen virtual card is minted for the seller, sized to the escrow.",
  },
  {
    n: "04",
    title: "Voice-confirm to release",
    body: 'When the item arrives, the buyer says "yes" to Vera. Stripe captures the payment, routes to the seller, unfreezes the card. If something\'s wrong, the dispute replays the original promise.',
  },
];

function HowItWorks() {
  return (
    <section className="border-b border-white/10 bg-[#0a0a0a] px-6 py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <header className="flex flex-col items-center gap-4 text-center">
          <Eyebrow tone="white">How it works</Eyebrow>
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
            Four steps. <span className="italic text-white/60">No paperwork.</span>
          </h2>
        </header>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur"
            >
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[#635bff]">
                {step.n}
              </span>
              <h3 className="font-display text-xl font-semibold leading-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Two ICPs
// ──────────────────────────────────────────────────────────────────────────

function ICPs() {
  return (
    <section className="border-b border-white/10 px-6 py-24 md:py-32">
      <div className="mx-auto grid w-full max-w-5xl gap-6 md:grid-cols-2">
        <ICPCard
          eyebrow="For high-value sellers"
          headline="Selling something worth £400+ to a stranger?"
          body="Phones, watches, used MacBooks, designer goods, anything where 'Venmo and pray' has burned you. Vouch holds the money in escrow until you both voice-confirm receipt."
          accent="receive your money, on time"
        />
        <ICPCard
          eyebrow="For freelancers"
          headline="Delivered work to a client who might ghost?"
          body="Designers, developers, copywriters — anyone who's chased an invoice after the work shipped. Vouch holds the client's payment before the work begins; voice-recorded acceptance criteria mean every deal is kept."
          accent="every deal, kept"
        />
      </div>
    </section>
  );
}

function ICPCard({
  eyebrow,
  headline,
  body,
  accent,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  accent: string;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur transition-colors hover:border-white/20 hover:bg-white/[0.04]">
      <Eyebrow tone="white">{eyebrow}</Eyebrow>
      <h3 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
        {headline}
      </h3>
      <p className="text-sm leading-relaxed text-white/70">{body}</p>
      <p className="mt-auto font-mono text-[11px] uppercase tracking-[0.14em] text-[#635bff]">
        “{accent}”
      </p>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Dispute moment — the killer demo beat
// ──────────────────────────────────────────────────────────────────────────

function DisputeMoment() {
  return (
    <section className="border-b border-white/10 bg-[#0a0a0a] px-6 py-24 md:py-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <Eyebrow tone="red">The dispute moment</Eyebrow>
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
            “Marcus said: <span className="italic text-[#d9351c]">no scratches.</span>”
          </h2>
          <p className="max-w-2xl text-base text-white/70 md:text-lg">
            When something goes wrong, Vera replays the locked agreement in
            the seller&rsquo;s own voice — at the exact moment they
            committed. Compared to a screenshot of a Facebook Marketplace
            chat, your voice on the record is unambiguous, unforgeable, and
            actionable.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReplayCard
            label="Original recording (Marcus)"
            quote="iPhone 15, 256 gigs, white, unlocked, no scratches, in original box."
            timestamp="2026-05-15 · 14:32"
            tone="dark"
          />
          <ReplayCard
            label="Sarah&rsquo;s evidence"
            quote="The screen has a crack across the bottom right. Not a scratch — a crack."
            timestamp="2026-05-21 · 11:08"
            tone="muted"
          />
        </div>

        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">
            Vera&rsquo;s ruling
          </p>
          <p className="font-display text-xl italic text-white md:text-2xl">
            “Refund to Sarah. Marcus&rsquo;s account flagged for review.”
          </p>
        </div>
      </div>
    </section>
  );
}

function ReplayCard({
  label,
  quote,
  timestamp,
  tone,
}: {
  label: string;
  quote: string;
  timestamp: string;
  tone: "dark" | "muted";
}) {
  const isDark = tone === "dark";
  return (
    <article
      className={`flex flex-col gap-3 rounded-xl border p-6 ${
        isDark
          ? "border-[#635bff]/30 bg-[#635bff]/[0.04]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <header className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
          {label}
        </span>
        <span className="font-mono text-[10px] text-white/30">{timestamp}</span>
      </header>
      <p className="font-display text-lg italic text-white md:text-xl">
        “{quote}”
      </p>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Built on (credibility strip)
// ──────────────────────────────────────────────────────────────────────────

function BuiltOn() {
  return (
    <section className="border-b border-white/10 px-6 py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Eyebrow tone="white">Built on</Eyebrow>
          <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
            Production-grade payments + the world&rsquo;s most natural voices
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StackCard
            label="Stripe"
            primitives={[
              "Connect Express (seller onboarding)",
              "Payment Intents (manual capture escrow)",
              "Issuing (frozen virtual cards, agentic commerce)",
              "Application fees (5% platform fee)",
              "Webhooks (state-machine source of truth)",
            ]}
          />
          <StackCard
            label="ElevenLabs"
            primitives={[
              "ConvAI (Vera live, 80 languages, 5 session types)",
              "Voice Library (Samara X — Vouch brand voice)",
              "Eleven v3 Conversational (expressive audio tags)",
              "Scribe v2 Realtime (legally-binding voice transcription)",
              "TTS (pre-rendered contract recitations)",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function StackCard({
  label,
  primitives,
}: {
  label: string;
  primitives: string[];
}) {
  return (
    <article className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur">
      <h3 className="font-display text-xl font-semibold leading-tight text-[#635bff]">
        {label}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {primitives.map((p) => (
          <li
            key={p}
            className="flex gap-3 text-sm text-white/70"
          >
            <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-[#635bff]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Closing CTA
// ──────────────────────────────────────────────────────────────────────────

function ClosingCTA() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 px-6 py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#635bff] opacity-20 blur-[140px]"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <h2 className="font-display text-4xl font-semibold leading-[0.95] tracking-tight md:text-6xl">
          Trust the handshake.
          <br />
          <span className="bg-gradient-to-br from-white via-violet-300 to-[#635bff] bg-clip-text italic text-transparent">
            Hold the money.
          </span>
        </h2>
        <p className="max-w-xl text-base text-white/70 md:text-lg">
          Stop arbitrating disputes from screenshots. Make every commitment a
          voice recording. The contract is your handshake, on the record.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <PrimaryCTA href="/new" label="Start a deal →" />
          <SecondaryCTA href="/demo" label="See the demo" />
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Footer
// ──────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
          Vouch · Voice-recorded escrow on Stripe + ElevenLabs
        </p>
        <p className="font-mono text-[11px] text-white/30">
          Submitted to{" "}
          <a
            href="https://hacks.elevenlabs.io/hackathons/8"
            className="hover:text-[#635bff]"
          >
            ElevenHacks 2026 Hack #9: Stripe
          </a>{" "}
          · MIT
        </p>
      </div>
    </footer>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Tiny shared primitives (no need for full component lib here)
// ──────────────────────────────────────────────────────────────────────────

function PrimaryCTA({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md bg-[#635bff] px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
    >
      {label}
    </Link>
  );
}

function SecondaryCTA({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/[0.08]"
    >
      {label}
    </Link>
  );
}

function Eyebrow({ tone, children }: { tone: "white" | "red"; children: string }) {
  const color = tone === "red" ? "text-[#d9351c]" : "text-white/60";
  return (
    <p className={`flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-[0.16em] ${color}`}>
      <span className={`h-px w-6 ${tone === "red" ? "bg-[#d9351c]" : "bg-white/30"}`} />
      {children}
    </p>
  );
}
