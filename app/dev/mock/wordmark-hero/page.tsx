/**
 * Dev-only mock page rendering the Vouch wordmark at HERO scale — large
 * enough to screenshot and upload to Claude Design as a brand asset for
 * demo-video renders. Both light (cream BG, dark wordmark) and dark (dark
 * BG, light wordmark) variants stacked vertically, full-bleed.
 *
 * Visit /dev/mock/wordmark-hero → screenshot each labeled frame.
 */

export const metadata = {
  title: "Mock · Wordmark hero",
  robots: { index: false, follow: false },
};

const WORDMARK_SIZE = 220; // px — Fraunces 'Vouch' wordmark font size
const DOT_SIZE = 88;       // px — indigo brand dot diameter
const PULSE_SIZE = 36;     // px — white pulsing centre of the brand dot

export default function WordmarkHeroMockPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] text-[#2a2924]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-8">
        <header className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Mock · Vouch wordmark · hero scale
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Two variants below — screenshot each
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Both frames are 1920×1080 ratio (or close), centred composition,
            ready to upload to Claude Design as brand assets.
          </p>
        </header>

        {/* LIGHT variant (cream BG, dark wordmark) */}
        <section className="flex flex-col gap-3">
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            wordmark-hero-light.png · cream BG (Acts 1–11)
          </code>
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 1200,
              height: 600,
              background: "#f6f5f2",
              border: "1px solid rgba(50, 30, 5, 0.10)",
              borderRadius: 12,
            }}
          >
            <div className="flex items-center gap-8">
              <div
                className="relative grid place-items-center rounded-full"
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  background: "#5266eb",
                  boxShadow: "0 6px 24px rgba(82, 102, 235, 0.30)",
                }}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: PULSE_SIZE, height: PULSE_SIZE }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: WORDMARK_SIZE,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#2a2924",
                  lineHeight: 1,
                }}
              >
                Vouch
              </span>
            </div>
          </div>
        </section>

        {/* DARK variant (dark BG, light wordmark) */}
        <section className="flex flex-col gap-3">
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            wordmark-hero-dark.png · dark BG (Beat 12 brand close)
          </code>
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 1200,
              height: 600,
              background: "#0c0c14",
              borderRadius: 12,
            }}
          >
            <div className="flex items-center gap-8">
              <div
                className="relative grid place-items-center rounded-full"
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  background: "#635bff",
                  boxShadow: "0 6px 24px rgba(99, 91, 255, 0.45)",
                }}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: PULSE_SIZE, height: PULSE_SIZE }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: WORDMARK_SIZE,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                Vouch
              </span>
            </div>
          </div>
        </section>

        {/* DARK variant with tech-stack signature (Beat 12 full close) */}
        <section className="flex flex-col gap-3">
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            wordmark-hero-dark-with-signature.png · Beat 12 full close
          </code>
          <div
            className="relative flex flex-col items-center justify-center gap-12"
            style={{
              width: 1200,
              height: 600,
              background: "#0c0c14",
              borderRadius: 12,
            }}
          >
            <div className="flex items-center gap-8">
              <div
                className="relative grid place-items-center rounded-full"
                style={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  background: "#635bff",
                  boxShadow: "0 6px 24px rgba(99, 91, 255, 0.45)",
                }}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: PULSE_SIZE, height: PULSE_SIZE }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: WORDMARK_SIZE,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                Vouch
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 18,
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.55)",
                textTransform: "uppercase",
              }}
            >
              Built on Stripe Connect + ElevenLabs ConvAI
            </p>
          </div>
        </section>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
          screenshot each framed canvas above · save with the suggested filename
        </p>
      </div>
    </main>
  );
}
