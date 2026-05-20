/**
 * Dev-only mock page rendering Beat 12 brand assets: Vouch wordmark in
 * isolation, and the "Every deal, kept." tagline lockup with italic
 * gradient on "kept". These are the closing-frame assets for the demo
 * video render.
 *
 * Visit /dev/mock/brand-lockup → screenshot each labeled section.
 */

export const metadata = {
  title: "Mock · Brand lockup",
  robots: { index: false, follow: false },
};

export default function BrandLockupMockPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="mx-auto flex max-w-3xl flex-col gap-12">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Mock · Beat 12 brand assets
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Wordmark + tagline lockup
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Both rendered on cream so they composite cleanly into the
            final frame. Use these as static keyframes; Claude Design /
            Remotion can re-stage the word-by-word reveal animation.
          </p>
        </header>

        {/* Vouch wordmark on dark BG (matches landing hero) */}
        <section className="flex flex-col gap-3">
          <div
            className="grid place-items-center rounded-md"
            style={{ width: 600, height: 220, background: "#0c0c14" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="relative grid place-items-center rounded-full"
                style={{ width: 40, height: 40, background: "#635bff" }}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: 14, height: 14 }}
                />
              </div>
              <span
                className="text-white"
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 56,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Vouch
              </span>
            </div>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b12-vouch-wordmark.png · dark BG, hero variant
          </code>
        </section>

        {/* Vouch wordmark on cream BG (alt for light scenes) */}
        <section className="flex flex-col gap-3">
          <div
            className="grid place-items-center rounded-md"
            style={{ width: 600, height: 220, background: "#f6f5f2" }}
          >
            <div className="flex items-center gap-4">
              <div
                className="relative grid place-items-center rounded-full"
                style={{ width: 40, height: 40, background: "#5266eb" }}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: 14, height: 14 }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 56,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "#2a2924",
                }}
              >
                Vouch
              </span>
            </div>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b12-vouch-wordmark-light.png · cream BG alt
          </code>
        </section>

        {/* Tagline lockup — "Every deal, kept." with italic gradient on "kept" */}
        <section className="flex flex-col gap-3">
          <div
            className="grid place-items-center rounded-md"
            style={{ width: 720, height: 260, background: "#f6f5f2" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 64,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "#2a2924",
                textAlign: "center",
              }}
            >
              Every deal,{" "}
              <span
                className="italic"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #5266eb 0%, #7a6ce8 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                kept.
              </span>
            </h2>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b12-tagline-lockup.png · italic gradient on &lsquo;kept&rsquo;
          </code>
        </section>

        {/* Tagline alt — "Receive your money, on time." for Beat 1+5 */}
        <section className="flex flex-col gap-3">
          <div
            className="grid place-items-center rounded-md"
            style={{ width: 720, height: 260, background: "#0c0c14" }}
          >
            <h2
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              Receive your money,
              <br />
              <span
                className="italic"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #7a6ce8 0%, #b3a8f3 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                on time.
              </span>
            </h2>
          </div>
          <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
            b1-tagline-on-time.png · Act 1 anchor tagline, dark BG
          </code>
        </section>
      </div>
    </main>
  );
}
