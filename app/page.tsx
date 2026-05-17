import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="vouch-waveform size-hero" aria-hidden>
          <span /><span /><span /><span /><span />
          <span /><span /><span /><span /><span />
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60">
            Coming soon · ElevenHacks 2026
          </p>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
            You should receive
            <br />
            your money{" "}
            <span className="bg-gradient-to-br from-white via-violet-300 to-stripe-purple bg-clip-text italic text-transparent">
              on time.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Voice-recorded escrow for freelancers and high-value peer-to-peer sales.
            Built on Stripe + ElevenLabs.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/new"
            className="rounded-md bg-stripe-purple px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-stripe-purple-hover"
          >
            Start a deal →
          </Link>
          <Link
            href="/demo"
            className="rounded-md border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/[0.08]"
          >
            See the demo
          </Link>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
          Vouch · Voice-recorded escrow on Stripe + ElevenLabs
        </p>
      </div>
    </main>
  );
}
