"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

// v0 components kept verbatim
import { Nav } from "@/components/v0/nav";
import { Bleed, BleedToBlack } from "@/components/v0/bleed";
import { HeroBackground, TrustBadge, WaveformDecoration } from "@/components/v0/hero-decorations";
import { RecordWidget } from "@/components/v0/record-widget";
import { Footer } from "@/components/v0/closing";

// Project components
import { MorphChain } from "@/components/MorphChain";
import { Waveform } from "@/components/Waveform";

// ──────────────────────────────────────────────────────────────────────────
// Vouch landing — production version (promoted from /v0-landing-merged).
//
// Slogan: "Every deal, kept."
// Sections: Hero · PainPivot · MoatBand · HowItWorks · DisputeMoment
//           · ComparisonTable · Pricing · BuiltOn · ClosingPlate · Footer
//
// Conventions held throughout (per design feedback batches 1-5):
// - No "escrow" anywhere visible (use "voice-confirmed payments" / "held")
// - No italic+gradient text (it's an AI tell). Use .emph underline instead.
// - No em-dashes — hyphens or commas
// - Single pricing tier (was 2 with vapor features)
// - ComparisonTable replaces a forged testimonial
// - HowItWorks scroll-pinned with hard phase cuts (no opacity bleed-through)
// ──────────────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = { text: 0.5, reveal: 0.7, morph: 0.8, bgFlip: 0.3, microPop: 0.25 };

export default function HomePage() {
  return (
    <main>
      <MergedHero />
      <Bleed />
      <MergedPainPivot />
      <MoatBand />
      <MergedHowItWorks />
      <DisputeMoment />
      <ComparisonTable />
      <MergedPricing />
      <MergedBuiltOn />
      <BleedToBlack />
      <MergedClosingPlate />
      <Footer />
    </main>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HERO — slogan + voice-confirmed copy + underline emph, no eyebrow
// ══════════════════════════════════════════════════════════════════════════

function MergedHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <HeroBackground />
      <Nav />

      <div className="pointer-events-none absolute right-8 top-32 z-10 hidden md:block">
        <MorphChain size={48} color="rgba(255,255,255,0.55)" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24 pt-32">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-[640px] flex-1">
            <h1
              className="mb-6 text-balance text-[clamp(48px,8vw,96px)] font-semibold leading-[1.05] tracking-[-0.025em] text-white"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              Every deal,
              <br />
              <span className="emph-dark">kept.</span>
            </h1>

            <p
              className="mb-10 max-w-[520px] text-[18px] leading-[1.6] text-white/72"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              Voice-confirmed payments for freelancers and high-value peer-to-peer
              sales. Vera, our AI mediator, captures the agreement on both sides.
              Stripe holds the funds until both confirm.
            </p>

            <div className="mb-12 flex flex-wrap items-center gap-4">
              <Link
                href="/new"
                className="rounded-full bg-[#635bff] px-7 py-3.5 text-[14px] font-medium text-white transition-all hover:shadow-[0_0_24px_6px_rgba(99,91,255,0.35)]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                Start a deal →
              </Link>
              <Link
                href="/demo"
                className="rounded-md border border-white/18 bg-transparent px-7 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-white/[0.06]"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                See the demo
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <TrustBadge color="#635bff" label="Stripe Connect" />
              <TrustBadge color="#635bff" label="ElevenLabs ConvAI" />
              <TrustBadge color="#2f7d57" label="2.9% per deal · Zero markup" />
            </div>
          </div>

          <div className="w-full flex-shrink-0 lg:w-[380px]">
            <RecordWidget />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-8 hidden opacity-[0.42] lg:block">
        <WaveformDecoration />
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PAIN PIVOT — chaos artifacts implode, MorphChain springs in
// ══════════════════════════════════════════════════════════════════════════

const ARTIFACTS = [
  { txt: "you said £500 by Friday",  x: -180, y: -120, rot: -8 },
  { txt: "I owe you £200 - Mike",    x:  140, y: -100, rot:  6 },
  { txt: "🎤 voice note · 0:18",     x: -220, y:   40, rot: -12 },
  { txt: "FB Marketplace · sold",    x:  200, y:   60, rot: 10 },
  { txt: "u still good for it??",    x: -100, y:  140, rot: 5 },
  { txt: "Promise. - J",             x:  160, y:  150, rot: -7 },
  { txt: "❌ no reply 3 days",       x: -160, y:  -40, rot: 9 },
  { txt: "🎤 voice note · 0:42",     x:   80, y: -160, rot: -5 },
];

function MergedPainPivot() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const phase = reduced || inView ? "after" : "before";

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] overflow-hidden"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(217,53,28,0.08) 0%, transparent 70%)",
        }}
        animate={
          phase === "after"
            ? {
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(99,91,255,0.10) 0%, transparent 70%)",
              }
            : {}
        }
        transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[400px] w-[600px]">
          {ARTIFACTS.map((a, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-lg px-4 py-3 shadow-sm"
              style={{
                background: "var(--cream-card-glass-hi)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border-warm)",
                color: "var(--ink-muted)",
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 13,
                x: a.x,
                y: a.y,
                rotate: a.rot,
              }}
              animate={phase === "after" ? { x: 0, y: 0, rotate: 0, opacity: 0, scale: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
            >
              {a.txt}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={phase === "after" ? { opacity: 1, scale: [0, 1.05, 1] } : {}}
          transition={{ duration: 0.55, ease: EASE, delay: 0.55, times: [0, 0.7, 1] }}
        >
          <MorphChain size={72} color="var(--stripe-purple)" />
        </motion.div>

        <motion.div
          className="mb-6 flex items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={phase === "after" ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduced ? 0 : 1, duration: 0.4, ease: EASE }}
        >
          <span className="h-px w-6" style={{ background: "var(--ink-dim)" }} />
          <span
            className="font-mono text-[12px] uppercase tracking-[0.16em]"
            style={{ color: "var(--ink-muted)" }}
          >
            The new way
          </span>
        </motion.div>

        <motion.h2
          className="mb-6 text-balance text-[clamp(36px,5vw,48px)] font-medium leading-[1.15] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--ink)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "after" ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduced ? 0 : 1.1, duration: 0.5, ease: EASE }}
        >
          Every promise, recorded. <span className="emph">Every payment, protected.</span>
        </motion.h2>

        <motion.p
          className="max-w-[580px] text-[18px] leading-[1.6]"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--ink-muted)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "after" ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: reduced ? 0 : 1.3, duration: 0.5, ease: EASE }}
        >
          Replace the broken handshake with a voice-confirmed payment held by
          Stripe and mediated by AI. 2.9% per deal - zero markup on Stripe.
        </motion.p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MOAT BAND — £8B stat hook + true pitch (was "text trails" line)
// ══════════════════════════════════════════════════════════════════════════

function MoatBand() {
  return (
    <section className="relative border-t border-[var(--border-warm)] bg-[var(--cream)] px-6 py-24 text-[var(--ink)] md:py-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-6" style={{ background: "var(--a24-red)" }} />
          <span
            className="font-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "var(--a24-red)" }}
          >
            The problem
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span
            className="tabular font-display font-semibold leading-none tracking-[-0.03em] text-[var(--ink)]"
            style={{ fontSize: "clamp(64px, 12vw, 140px)" }}
          >
            £8 billion
          </span>
          <span className="text-base text-[var(--ink-muted)] md:text-lg">
            lost annually to peer-to-peer payment fraud.
          </span>
        </div>

        <h2 className="mt-4 font-display text-3xl font-medium leading-tight tracking-tight text-[var(--ink)] md:text-5xl">
          When £400 goes missing,{" "}
          <span className="emph">screenshots aren&rsquo;t enough.</span>
        </h2>
        <p className="mx-auto max-w-2xl text-base text-[var(--ink-muted)] md:text-lg">
          Vouch records what was promised, in the other party&rsquo;s voice.
          When something goes wrong, Vera replays the exact commitment - so
          a flaky seller can&rsquo;t pretend they never agreed.
        </p>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// HOW IT WORKS — FIXED scroll-pinned
//
// Bugs fixed vs prior version:
// 1. Chaos cards used % translate which clamps to element size (not container)
//    AND Framer's animate.y was clobbering the transform. Now: pure absolute
//    positioning via x/y motion-value style props, no float animation.
// 2. Phase C handshake was bottom: 0 which scrolled past viewport. Now: card
//    stays centred, handshake renders INSIDE the card area (no offscreen).
// 3. "IN_ESCROW" pill removed (escrow rule). Replaced with "LOCKED" status.
// ══════════════════════════════════════════════════════════════════════════

function MergedHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // HARD PHASE CUTS — no overlap zones. Each transform has explicit endpoints
  // at [0, 1] so useTransform clamps cleanly (no extrapolation past range).
  //
  // Scroll-space layout:
  //   SPEAK     : 0.00 - 0.30   (30% dwell — chaos only)
  //   TRANSITION: 0.30 - 0.34   (4% sharp cut — chaos out, card in)
  //   LOCK      : 0.34 - 0.64   (30% dwell — card with LOCKED)
  //   TRANSITION: 0.64 - 0.68   (4% sharp cut — LOCKED out, RELEASED in)
  //   RELEASE   : 0.68 - 1.00   (32% dwell — card with RELEASED + handshake)
  //
  // Phase caption flips at 0.33 and 0.66 to match.
  const chaosOpacity    = useTransform(scrollYProgress, [0, 0.30, 0.34, 1], [1, 1, 0, 0]);
  const cardOpacity     = useTransform(scrollYProgress, [0, 0.30, 0.34, 1], [0, 0, 1, 1]);
  const cardScale       = useTransform(scrollYProgress, [0, 0.30, 0.34, 1], [0.92, 0.92, 1, 1]);
  // LOCKED pill rises at 0.34, holds, then falls at 0.64
  const lockedOpacity   = useTransform(scrollYProgress, [0, 0.34, 0.36, 0.64, 0.68, 1], [0, 0, 1, 1, 0, 0]);
  // RELEASED pill rises at 0.64 to fully visible at 0.68
  const releasedOpacity = useTransform(scrollYProgress, [0, 0.64, 0.68, 1], [0, 0, 1, 1]);
  // Amount: full opacity throughout, just color shifts at the RELEASE cut
  const amountColor     = useTransform(scrollYProgress, [0, 0.64, 0.68, 1],
                            ["var(--ink)", "var(--ink)", "var(--success)", "var(--success)"]);
  // Handshake line draws across after RELEASE settles, then check appears
  const releaseLine     = useTransform(scrollYProgress, [0, 0.72, 0.88, 1], [0, 0, 1, 1]);
  const releaseCheck    = useTransform(scrollYProgress, [0, 0.86, 0.92, 1], [0, 0, 1, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-[var(--border-warm)] bg-[var(--cream-alt)] text-[var(--ink)]"
      style={{ height: reduced ? "auto" : "300vh" }}
      id="how-it-works"
    >
      <div
        className="sticky top-0 flex items-center"
        style={{
          height: reduced ? "auto" : "100vh",
          paddingTop: reduced ? "6rem" : 0,
          paddingBottom: reduced ? "6rem" : 0,
        }}
      >
        <div className="mx-auto w-full max-w-5xl px-6">
          <PhaseCaption scrollProgress={scrollYProgress} reduced={!!reduced} />

          <div className="relative mx-auto mt-10" style={{ minHeight: 540 }}>
            {/* Phase A: chaos cluster - pointer-events-none so it can't block clicks even at 0 opacity */}
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ opacity: reduced ? 0 : chaosOpacity }}
            >
              <ChaosCluster />
            </motion.div>

            {/* Phase B+C: Deal Record card stays in centre */}
            <motion.div
              className="absolute inset-0 flex items-start justify-center pt-2"
              style={{
                opacity: reduced ? 1 : cardOpacity,
                scale: reduced ? 1 : cardScale,
                pointerEvents: "auto",
              }}
            >
              <MergedDealRecordCard
                lockedOpacity={lockedOpacity}
                releasedOpacity={releasedOpacity}
                amountColor={amountColor}
                releaseLine={releaseLine}
                releaseCheck={releaseCheck}
                reduced={!!reduced}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseCaption({
  scrollProgress,
  reduced,
}: {
  scrollProgress: MotionValue<number>;
  reduced: boolean;
}) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const unsub = scrollProgress.on("change", (p) => {
      const next = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      setPhase(next);
    });
    return unsub;
  }, [scrollProgress, reduced]);

  const phases = [
    {
      label: "01 · Speak",
      desc: "Both parties answer Vera in their own voice. Terms get captured as a tamper-evident audio signature.",
    },
    {
      label: "02 · Lock",
      desc: "Vera reads the terms back. Both say \"I agree\". Stripe authorises the payment and holds the funds.",
    },
    {
      label: "03 · Release",
      desc: "When the buyer voice-confirms delivery, Stripe routes the money to the seller. Done.",
    },
  ];

  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <div className="flex items-center gap-3">
        <span className="h-px w-6" style={{ background: "var(--ink-dim)" }} />
        <span
          className="font-mono text-[12px] uppercase tracking-[0.16em]"
          style={{ color: "var(--ink-muted)" }}
        >
          How it works · {phases[phase].label}
        </span>
      </div>
      <h2 className="font-display text-3xl font-medium leading-tight tracking-tight text-[var(--ink)] md:text-5xl">
        Voice it. Lock it. <span className="emph">Release it.</span>
      </h2>
      <p
        className="max-w-md text-sm text-[var(--ink-muted)] md:text-base"
        style={{ minHeight: 56 }}
      >
        {phases[phase].desc}
      </p>
    </header>
  );
}

const CHAOS_ITEMS = [
  { txt: "FB Marketplace · iPhone",     x: -180, y: -80,  rot: -8 },
  { txt: "🎤 voice note · 0:34",        x:  170, y: -110, rot:  6 },
  { txt: "WhatsApp · £400 ok?",         x: -200, y:  40,  rot:  4 },
  { txt: "Tracking · awaiting label",   x:  190, y:  60,  rot: -6 },
  { txt: "DM · still up?",              x:  -10, y: -150, rot:  2 },
  { txt: "Bank ref · iphone-marcus",    x:   20, y:  120, rot: -3 },
];

function ChaosCluster() {
  return (
    <div className="relative h-full w-full">
      {CHAOS_ITEMS.map((a, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm shadow-sm"
          style={{
            transform: `translate(-50%, -50%) translate(${a.x}px, ${a.y}px) rotate(${a.rot}deg)`,
            background: "var(--cream-card-glass-hi)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid var(--border-warm)",
            color: "var(--ink-muted)",
          }}
        >
          {a.txt}
        </div>
      ))}
    </div>
  );
}

function MergedDealRecordCard({
  lockedOpacity,
  releasedOpacity,
  amountColor,
  releaseLine,
  releaseCheck,
  reduced,
}: {
  lockedOpacity: MotionValue<number>;
  releasedOpacity: MotionValue<number>;
  amountColor: MotionValue<string>;
  releaseLine: MotionValue<number>;
  releaseCheck: MotionValue<number>;
  reduced: boolean;
}) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-7"
      style={{
        background: "var(--cream-card-glass-hi)",
        backdropFilter: "var(--blur)",
        WebkitBackdropFilter: "var(--blur)",
        border: "1px solid var(--glass-edge)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div className="mb-5 flex items-center justify-between">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.16em]"
          style={{ color: "var(--ink-muted)" }}
        >
          Deal Record
        </span>
        {/* Status pills: LOCKED → RELEASED. NO "IN_ESCROW" anywhere.
            lockedOpacity has rise-and-fall built in (0→1 at 0.34, 1→0 at 0.64).
            releasedOpacity rises at 0.64. They crossfade cleanly. */}
        <div className="relative h-6 w-[110px]">
          <motion.span
            className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em]"
            style={{
              background: "var(--locked-soft)",
              color: "var(--locked)",
              opacity: reduced ? 0 : lockedOpacity,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--locked)" }} />
            Locked
          </motion.span>
          <motion.span
            className="absolute right-0 top-0 inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.06em]"
            style={{
              background: "var(--success-soft)",
              color: "var(--success)",
              opacity: reduced ? 1 : releasedOpacity,
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
            Released
          </motion.span>
        </div>
      </div>

      <h3
        className="mb-5 font-display text-xl font-semibold"
        style={{ color: "var(--ink)" }}
      >
        iPhone 15 Pro · 256GB
      </h3>

      <dl className="space-y-2.5 text-sm">
        <div className="flex items-baseline gap-3 border-b border-[var(--border-warm)] pb-2">
          <dt
            className="min-w-[110px] font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "var(--ink-muted)" }}
          >
            Amount
          </dt>
          <dd className="flex-1">
            <motion.span
              className="tabular font-display font-semibold"
              style={{ color: reduced ? "var(--ink)" : amountColor }}
            >
              £400
            </motion.span>
          </dd>
        </div>
        <RowSimple label="Counterparty">Marcus Adebayo · Warsaw, PL</RowSimple>
        <RowSimple label="Delivery">Royal Mail tracked · Fri 24 May</RowSimple>
        <RowSimple label="Voice signature">
          <Waveform size="default" bars={5} />
        </RowSimple>
      </dl>

      {/* Phase C: handshake INSIDE the card, fades in at scroll 0.64 with the
          RELEASED pill so they appear together. Stronger visual weight than the
          previous version — bigger check, success-tinted background highlight. */}
      <motion.div
        className="mt-6 -mx-3 rounded-lg px-3 pb-3 pt-4"
        style={{
          background: "var(--success-soft)",
          borderTop: "1px solid var(--border-warm)",
          opacity: reduced ? 1 : releasedOpacity,
        }}
      >
        <div className="flex items-center justify-between">
          <CompactAvatar initials="SC" label="Sarah" />
          <div className="relative mx-3 h-9 flex-1">
            <svg width="100%" height="36" viewBox="0 0 200 36" preserveAspectRatio="none">
              <motion.path
                d="M 4 18 L 196 18"
                stroke="var(--success)"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                style={{ pathLength: reduced ? 1 : releaseLine }}
              />
            </svg>
            <motion.div
              className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-base font-bold text-white shadow-md"
              style={{
                background: "var(--success)",
                opacity: reduced ? 1 : releaseCheck,
              }}
            >
              ✓
            </motion.div>
          </div>
          <CompactAvatar initials="MA" label="Marcus" />
        </div>
        <p
          className="mt-3 text-center text-[12px] font-semibold uppercase tracking-[0.14em]"
          style={{ fontFamily: "var(--font-jetbrains), monospace", color: "var(--success)" }}
        >
          £400 routed to Marcus
        </p>
      </motion.div>
    </div>
  );
}

function RowSimple({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-[var(--border-warm)] pb-2">
      <dt
        className="min-w-[110px] font-mono text-[10px] uppercase tracking-[0.12em]"
        style={{ color: "var(--ink-muted)" }}
      >
        {label}
      </dt>
      <dd className="flex-1 text-[var(--ink)]">{children}</dd>
    </div>
  );
}

function CompactAvatar({ initials, label }: { initials: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{
          background: "linear-gradient(135deg, var(--indigo) 0%, var(--stripe-purple) 100%)",
          fontFamily: "var(--font-fraunces), serif",
        }}
      >
        {initials}
      </div>
      <span
        className="font-mono text-[10px] uppercase tracking-[0.06em]"
        style={{ color: "var(--ink-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// DISPUTE MOMENT — kept, em-dashes swapped for commas
// ══════════════════════════════════════════════════════════════════════════

function DisputeMoment() {
  return (
    <section className="relative border-t border-[var(--border-warm)] bg-[var(--cream)] px-6 py-24 text-[var(--ink)] md:py-32">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-6" style={{ background: "var(--a24-red)" }} />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--a24-red)" }}
            >
              The dispute moment
            </span>
          </div>
          <h2
            className="font-display text-3xl font-medium leading-tight md:text-5xl"
            style={{ color: "var(--ink)" }}
          >
            &ldquo;Marcus said:{" "}
            <span className="italic" style={{ color: "var(--a24-red)" }}>no scratches.</span>
            &rdquo;
          </h2>
          <p
            className="max-w-2xl text-base md:text-lg"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "var(--ink-muted)" }}
          >
            When something goes wrong, Vera replays the locked agreement in
            the seller&rsquo;s own voice, at the exact moment they committed.
            Compared to a screenshot of a Facebook Marketplace chat, your
            voice on the record is unambiguous, unforgeable, and actionable.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReplayCard
            label="Original recording (Marcus)"
            quote="iPhone 15, 256 gigs, white, unlocked, no scratches, in original box."
            timestamp="2026-05-15 · 14:32"
            featured
          />
          <ReplayCard
            label="Sarah's evidence"
            quote="The screen has a crack across the bottom right. Not a scratch, a crack."
            timestamp="2026-05-21 · 11:08"
          />
        </div>

        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <p
            className="font-mono text-xs uppercase tracking-[0.14em]"
            style={{ color: "var(--ink-muted)" }}
          >
            Vera&rsquo;s ruling
          </p>
          <p
            className="text-xl italic md:text-2xl"
            style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--ink)" }}
          >
            &ldquo;Refund to Sarah. Marcus&rsquo;s account flagged for review.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function ReplayCard({
  label, quote, timestamp, featured,
}: {
  label: string;
  quote: string;
  timestamp: string;
  featured?: boolean;
}) {
  return (
    <article
      className="flex flex-col gap-3 rounded-xl p-6"
      style={{
        background: "var(--cream-card-glass-hi)",
        backdropFilter: "var(--blur)",
        WebkitBackdropFilter: "var(--blur)",
        border: featured ? "1px solid rgba(99,91,255,0.35)" : "1px solid var(--border-warm)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <header className="flex items-center justify-between">
        <span
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
          style={{ color: "var(--ink-muted)" }}
        >
          {label}
        </span>
        <span
          className="font-mono text-[10px]"
          style={{ color: "var(--ink-dim)" }}
        >
          {timestamp}
        </span>
      </header>
      <p
        className="text-lg italic md:text-xl"
        style={{ fontFamily: "var(--font-fraunces), serif", color: "var(--ink)" }}
      >
        &ldquo;{quote}&rdquo;
      </p>
    </article>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// COMPARISON TABLE — replaces forged Lena Park testimonial
// ══════════════════════════════════════════════════════════════════════════

const COMP_COLS = [
  { key: "vouch",  label: "Vouch",         accent: true  },
  { key: "paypal", label: "PayPal G&S",    accent: false },
  { key: "wise",   label: "Wise",          accent: false },
  { key: "direct", label: "Bank transfer", accent: false },
] as const;

type CompCell = string | { ok: true } | { ok: false };

const COMP_ROWS: { feature: string; cells: Record<string, CompCell> }[] = [
  { feature: "Voice-recorded agreement", cells: { vouch: { ok: true }, paypal: { ok: false }, wise: { ok: false }, direct: { ok: false } } },
  { feature: "Funds held until both confirm", cells: { vouch: { ok: true }, paypal: "Partial", wise: { ok: false }, direct: { ok: false } } },
  { feature: "Dispute resolution", cells: { vouch: "Voice replay", paypal: "Text + tickets", wise: "Limited", direct: "None" } },
  { feature: "Multilingual mediation", cells: { vouch: "80 languages", paypal: "English-led", wise: "English-led", direct: "None" } },
  { feature: "Fee per deal", cells: { vouch: "2.9%", paypal: "2.99% + £0.30", wise: "0.5 - 1.5%", direct: "0%" } },
  { feature: "Protection for sellers", cells: { vouch: { ok: true }, paypal: { ok: false }, wise: { ok: false }, direct: { ok: false } } },
];

function ComparisonTable() {
  return (
    <section className="relative border-t border-[var(--border-warm)] bg-[var(--cream)] px-6 py-24 text-[var(--ink)] md:py-32">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6" style={{ background: "var(--ink-dim)" }} />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--ink-muted)" }}
            >
              How Vouch compares
            </span>
          </div>
          <h2 className="mt-6 font-display text-3xl font-medium leading-tight tracking-tight text-[var(--ink)] md:text-5xl">
            What you get vs <span className="emph">what you don&rsquo;t.</span>
          </h2>
        </motion.div>

        <motion.div
          className="w-full overflow-hidden rounded-2xl"
          style={{
            background: "var(--cream-card-glass-hi)",
            backdropFilter: "var(--blur)",
            WebkitBackdropFilter: "var(--blur)",
            border: "1px solid var(--glass-edge)",
            boxShadow: "var(--shadow-md)",
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        >
          <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(235,232,224,0.4)" }}>
                <th
                  className="px-4 py-4 md:px-6"
                  style={{ borderBottom: "1px solid var(--border-warm)" }}
                />
                {COMP_COLS.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-4 text-center font-mono text-[11px] uppercase tracking-[0.12em] md:px-6"
                    style={{
                      borderBottom: "1px solid var(--border-warm)",
                      color: c.accent ? "var(--stripe-purple)" : "var(--ink-muted)",
                      fontWeight: c.accent ? 600 : 500,
                    }}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMP_ROWS.map((row, rowIdx) => (
                <motion.tr
                  key={row.feature}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.25 + rowIdx * 0.06 }}
                  style={{ borderBottom: rowIdx < COMP_ROWS.length - 1 ? "1px solid var(--border-warm)" : "none" }}
                >
                  <td className="px-4 py-4 text-sm font-medium text-[var(--ink)] md:px-6 md:text-base">
                    {row.feature}
                  </td>
                  {COMP_COLS.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-4 text-center text-sm md:px-6 md:text-base"
                      style={{ background: col.accent ? "rgba(99,91,255,0.04)" : "transparent" }}
                    >
                      <CompCellRender value={row.cells[col.key]} accent={col.accent} />
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.p
          className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          PayPal protects buyers but not sellers. Wise just moves money - if it goes wrong, you&rsquo;re on your own.
          Direct transfers have no recourse at all.
        </motion.p>
      </div>
    </section>
  );
}

function CompCellRender({ value, accent }: { value: CompCell; accent: boolean }) {
  if (typeof value === "string") {
    return <span style={{ color: accent ? "var(--ink)" : "var(--ink-muted)" }}>{value}</span>;
  }
  if (value.ok) {
    return (
      <svg
        className="mx-auto"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--success)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label="Yes"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <span aria-label="No" style={{ color: "var(--ink-dim)", fontSize: "18px" }}>
      -
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// PRICING — single tier with 5 honest features
// ══════════════════════════════════════════════════════════════════════════

function MergedPricing() {
  return (
    <section className="relative border-t border-[var(--border-warm)] bg-[var(--cream-alt)] px-6 py-24 text-[var(--ink)] md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 30% at 50% 0%, rgba(99,91,255,0.06) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6" style={{ background: "var(--ink-dim)" }} />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--ink-muted)" }}
            >
              Pricing · one fee, no surprises
            </span>
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight text-[var(--ink)] md:text-5xl">
            2.9% per deal. <span className="emph">Nothing else.</span>
          </h2>
          <p className="mx-auto mt-4 text-base text-[var(--ink-muted)] md:text-lg">
            No subscriptions. No setup fee. Zero markup on Stripe.
          </p>
        </header>

        <motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: EASE }}
          whileHover={{ y: -2 }}
          className="relative mx-auto flex flex-col gap-6 rounded-2xl p-9 md:p-12"
          style={{
            background: "var(--cream-card-glass-hi)",
            backdropFilter: "var(--blur)",
            WebkitBackdropFilter: "var(--blur)",
            border: "1px solid var(--indigo)",
            boxShadow: "0 0 0 1px var(--indigo-soft), 0 0 64px rgba(82,102,235,0.18), var(--shadow-md)",
          }}
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex items-baseline gap-2">
              <span className="tabular font-display text-6xl font-medium leading-none tracking-tight text-[var(--ink)] md:text-7xl">
                2.9%
              </span>
              <span className="text-base text-[var(--ink-muted)] md:text-lg">per deal</span>
            </div>
            <p className="max-w-md text-sm text-[var(--ink-muted)] md:text-base">
              Charged once when the deal releases. Free until then.
            </p>
          </div>

          <ul className="mx-auto flex w-full max-w-md flex-col gap-3 pt-4">
            {[
              "Voice-recorded agreement (both sides)",
              "Stripe holds the funds until both confirm",
              "AI dispute mediation with voice replay",
              "Frozen virtual cards for agentic commerce",
              "Multilingual · 80 languages",
            ].map((b) => (
              <li key={b} className="flex items-start gap-3 text-base text-[var(--ink)]">
                <CheckBubble />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/new"
            className="mt-2 rounded-md bg-[#635bff] px-6 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
          >
            Start a deal
          </Link>
        </motion.article>
      </div>
    </section>
  );
}

function CheckBubble() {
  return (
    <span
      className="mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full"
      style={{ background: "var(--indigo-soft)", color: "var(--indigo)" }}
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// BUILT ON — drop webhooks + TTS, Payment Intents reworded (no "escrow")
// ══════════════════════════════════════════════════════════════════════════

function MergedBuiltOn() {
  return (
    <section className="relative border-t border-[var(--border-warm)] bg-[var(--cream)] px-6 py-20 text-[var(--ink)]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-3">
            <span className="h-px w-6" style={{ background: "var(--ink-dim)" }} />
            <span
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: "var(--ink-muted)" }}
            >
              Built on
            </span>
          </div>
          <h2 className="font-display text-2xl font-medium leading-tight text-[var(--ink)] md:text-3xl">
            Production-grade payments + the world&rsquo;s most natural voices
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StackCard
            label="Stripe"
            primitives={[
              "Connect Express (seller onboarding)",
              "Payment Intents (authorize, then capture on release)",
              "Issuing (frozen virtual cards, agentic commerce)",
              "Application fees (2.9% - zero markup on Stripe)",
            ]}
          />
          <StackCard
            label="ElevenLabs"
            primitives={[
              "ConvAI (Vera live, 80 languages, 5 session types)",
              "Voice Library (Samara X - Vouch brand voice)",
              "Eleven v3 Conversational (expressive audio tags)",
              "Scribe v2 Realtime (legally-binding voice transcription)",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function StackCard({ label, primitives }: { label: string; primitives: string[] }) {
  return (
    <article
      className="flex flex-col gap-5 rounded-xl p-7"
      style={{
        background: "var(--cream-card-glass-hi)",
        backdropFilter: "var(--blur)",
        WebkitBackdropFilter: "var(--blur)",
        border: "1px solid var(--glass-edge)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3 className="font-display text-xl font-medium leading-tight text-[#635bff]">{label}</h3>
      <ul className="flex flex-col gap-2.5">
        {primitives.map((p) => (
          <li key={p} className="flex gap-3 text-sm text-[var(--ink-muted)]">
            <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-[#635bff]" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// CLOSING PLATE — slogan matches hero ("Every deal, kept.")
// ══════════════════════════════════════════════════════════════════════════

function MergedClosingPlate() {
  return (
    <section
      id="start"
      className="relative isolate overflow-hidden bg-black px-6 py-32 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#635bff] opacity-20 blur-[140px]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-[15%] top-[20%] h-[280px] w-[280px] rounded-full bg-[#635bff] opacity-15 blur-[100px]"
        animate={{ x: [0, 40], y: [0, 30] }}
        transition={{ duration: 14, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 50% 35% at 50% 50%, transparent 0%, black 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 35% at 50% 50%, transparent 0%, black 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.5, ease: EASE }}
        >
          <MorphChain size={56} color="rgba(255,255,255,0.85)" />
        </motion.div>

        <motion.h2
          className="font-display text-4xl font-semibold leading-[0.95] tracking-tight md:text-6xl"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          Every deal,
          <br />
          <span className="emph-dark">kept.</span>
        </motion.h2>

        <motion.p
          className="max-w-xl text-base text-white/70 md:text-lg"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Stop arbitrating disputes from screenshots. Every commitment becomes a
          voice recording. The handshake, on the record.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
        >
          <Link
            href="/new"
            className="rounded-full bg-[#635bff] px-8 py-3.5 text-[15px] font-medium text-white shadow-[0_0_32px_rgba(99,91,255,0.35)] transition-all hover:shadow-[0_0_48px_rgba(99,91,255,0.5)]"
          >
            Start a deal →
          </Link>
          <Link
            href="/demo"
            className="rounded-full border border-white/18 bg-transparent px-8 py-3.5 text-[15px] font-medium text-white/90 transition-colors hover:bg-white/[0.05]"
          >
            See the demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
