/**
 * Dev-only mock page rendering Beat 4 multilingual fragments in isolation:
 * Marcus avatar with Warsaw location tag, Polish text frame, English text
 * frame (the letter-by-letter morph keyframes), and the "I agree" button
 * in default + tapped states. Plus a Sarah avatar for Beat 11.
 *
 * Visit /dev/mock/multilingual → screenshot each labeled section.
 */

export const metadata = {
  title: "Mock · Multilingual frames",
  robots: { index: false, follow: false },
};

export default function MultilingualMockPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Mock · Beat 4 multilingual + B11 avatar · isolated for demo capture
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Marcus, Sarah, and the Polish→English morph
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Each section is a standalone screenshot target. The two text
            frames (Polish + English) are the start and end keyframes of
            the letter-by-letter morph animation — capture both, Claude
            Design tweens between them.
          </p>
        </header>

        {/* Marcus avatar with Warsaw location tag (b4) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center bg-[#f6f5f2] py-6" style={{ width: 360, height: 240 }}>
            <div className="flex flex-col items-center gap-3">
              <div
                className="grid place-items-center rounded-full"
                style={{
                  width: 96,
                  height: 96,
                  background: "linear-gradient(135deg, #5266eb 0%, #7a6ce8 100%)",
                  color: "white",
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 36,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(82, 102, 235, 0.25)",
                }}
              >
                M
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-display text-lg font-semibold">Marcus</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5266eb]">
                  Warsaw, PL
                </span>
              </div>
            </div>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b4-marcus-avatar-warsaw.png
          </code>
        </section>

        {/* Polish text frame (b4) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center bg-[#f6f5f2]" style={{ width: 600, height: 120 }}>
            <span
              className="font-mono text-2xl"
              style={{
                color: "#2a2924",
                letterSpacing: "0.02em",
              }}
            >
              Zgadzam się.
            </span>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b4-polish-text.png · morph START keyframe
          </code>
        </section>

        {/* English text frame (b4) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center bg-[#f6f5f2]" style={{ width: 600, height: 120 }}>
            <span
              className="font-mono text-2xl"
              style={{
                color: "#2a2924",
                letterSpacing: "0.02em",
              }}
            >
              I agree.
            </span>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b4-english-text.png · morph END keyframe
          </code>
        </section>

        {/* I agree button default (b4) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center bg-[#f6f5f2]" style={{ width: 360, height: 120 }}>
            <button
              type="button"
              className="rounded-md bg-[#635bff] px-6 py-3 text-sm font-medium text-white"
              style={{ pointerEvents: "none" }}
            >
              I agree →
            </button>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b4-i-agree-button-default.png
          </code>
        </section>

        {/* I agree button tapped/pressed (b4) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center bg-[#f6f5f2]" style={{ width: 360, height: 120 }}>
            <button
              type="button"
              className="rounded-md bg-[#5048e5] px-6 py-3 text-sm font-medium text-white"
              style={{
                pointerEvents: "none",
                transform: "scale(0.98)",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 24px 6px rgba(99, 91, 255, 0.35)",
              }}
            >
              I agree →
            </button>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b4-i-agree-button-tapped.png · pressed + glow
          </code>
        </section>

        {/* Sarah avatar (b11) */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-center bg-[#f6f5f2] py-6" style={{ width: 360, height: 240 }}>
            <div className="flex flex-col items-center gap-3">
              <div
                className="grid place-items-center rounded-full"
                style={{
                  width: 96,
                  height: 96,
                  background: "linear-gradient(135deg, #c98a42 0%, #e0a45a 100%)",
                  color: "white",
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 36,
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(201, 138, 66, 0.25)",
                }}
              >
                S
              </div>
              <span className="font-display text-lg font-semibold">Sarah</span>
            </div>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b11-sarah-avatar.png · for Beat 11 refund landing
          </code>
        </section>
      </div>
    </main>
  );
}
