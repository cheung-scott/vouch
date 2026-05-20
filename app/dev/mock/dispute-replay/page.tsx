import Image from "next/image";

/**
 * Dev-only mock page that renders the b10 dispute replay UI per
 * `docs/dispute-card-spec.md`. The dispute UI doesn't ship in product v1
 * but the /how-it-works page + demo-video Beat 10 both need a high-fidelity
 * still of what it would look like — building it inline using the real
 * design tokens beats hand-mocking in Figma.
 *
 * Usage: visit /dev/mock/dispute-replay → screenshot the cards (or the
 * full 1200×750 canvas) → save as public/images/how-it-works/dispute-replay.png.
 *
 * Not OWNER_TOKEN-gated because it renders nothing sensitive — just static
 * visual mockup. Crawler-noindex via the route prefix /dev/* matching the
 * existing convention.
 */

export const metadata = {
  title: "Mock · Dispute replay",
  robots: { index: false, follow: false },
};

export default function DisputeReplayMockPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
          Mock · dispute replay · 1200 × 750 canvas below
        </p>

        {/* The actual 1200×750 canvas — this is what gets screenshotted. */}
        <div
          className="relative flex w-[1200px] flex-col items-center justify-center gap-[60px] overflow-hidden bg-[#f6f5f2] px-[240px] py-[30px]"
          style={{ height: 750 }}
        >
          {/* TOP CARD — Vera replay UI (highlighted, indigo border) */}
          <article
            className="w-[720px] rounded-xl border bg-white px-6 py-6"
            style={{
              borderColor: "#5266eb",
              minHeight: 320,
              boxShadow: "0 4px 14px rgba(82, 102, 235, 0.10)",
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "#5266eb",
              }}
            >
              VERA · REPLAY · DAY 5
            </p>
            <h2
              className="mt-3 font-display font-semibold leading-snug"
              style={{ fontSize: 24, color: "#2a2924" }}
            >
              Marcus said:{" "}
              <span className="italic">
                &ldquo;
                <span
                  className="px-1 py-0.5"
                  style={{
                    backgroundColor: "rgba(181, 74, 58, 0.10)",
                    borderRadius: 4,
                  }}
                >
                  no scratches
                </span>
                , original box.&rdquo;
              </span>
            </h2>

            {/* Waveform — 5 bars, bar 4 (the "scratches" bar) tall + pulsed */}
            <div className="mt-6">
              <Waveform />
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p
                className="font-mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: "#8a8478",
                }}
              >
                0:18 · captured during SELLER_ONBOARDING
              </p>
              <PlayButton />
            </div>
          </article>

          {/* BOTTOM CARD — Evidence (cream border, supporting) */}
          <article
            className="w-[720px] rounded-xl border bg-white px-6 py-6"
            style={{
              borderColor: "rgba(50, 30, 5, 0.10)",
              minHeight: 320,
            }}
          >
            <p
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "#8a8478",
              }}
            >
              EVIDENCE · DAY 5
            </p>
            <h2
              className="mt-3 font-display font-semibold"
              style={{ fontSize: 20, color: "#2a2924" }}
            >
              What Sarah received
            </h2>

            <div className="mt-5 flex items-center gap-5">
              {/* Real cracked-iPhone photo — same asset used by demo-video
                  Beat 9. Stored at /public/images/cracked-iphone.png so
                  both surfaces reference the single source. */}
              <div
                className="relative shrink-0 overflow-hidden rounded-lg"
                style={{
                  width: 280,
                  height: 180,
                  border: "1px solid rgba(50, 30, 5, 0.10)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                }}
              >
                <Image
                  src="/images/cracked-iphone.png"
                  alt="Cracked iPhone screen, photo evidence from Sarah"
                  fill
                  sizes="280px"
                  className="object-cover"
                  priority
                />
              </div>

              <div
                className="leading-relaxed"
                style={{
                  fontSize: 14,
                  color: "#5a5548",
                  lineHeight: 1.5,
                }}
              >
                Cracked screen.
                <br />
                Box wasn&rsquo;t sealed.
              </div>
            </div>

            <p
              className="mt-5 font-mono"
              style={{
                fontSize: 10,
                letterSpacing: "0.06em",
                color: "#8a8478",
              }}
            >
              delivered 5 days after lock · photo timestamp 14:22 GMT
            </p>
          </article>
        </div>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
          screenshot the framed canvas above · 1200×750 · save as{" "}
          <span className="text-[#5266eb]">
            public/images/how-it-works/dispute-replay.png
          </span>
        </p>
      </div>
    </main>
  );
}

/**
 * 5-bar audio waveform. Bar 4 (the "scratches" bar) is taller + deeper
 * indigo with a concentric pulse ring around it.
 */
function Waveform() {
  const bars = [
    { h: 40, color: "#5266eb" },
    { h: 40, color: "#5266eb" },
    { h: 40, color: "#5266eb" },
    { h: 60, color: "#4253d4", emphasised: true },
    { h: 40, color: "#5266eb" },
  ];
  return (
    <div>
      <div className="flex items-end gap-1 pl-1">
        {bars.map((b, i) => (
          <div key={i} className="relative" style={{ width: 8, height: 60 }}>
            <div
              className="absolute bottom-0 w-full"
              style={{
                height: b.h,
                background: b.color,
                borderRadius: 2,
              }}
            />
            {b.emphasised && (
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #5266eb",
                  opacity: 0.3,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div
        className="mt-2 h-px"
        style={{
          background: "rgba(50, 30, 5, 0.08)",
        }}
      />
    </div>
  );
}

function PlayButton() {
  return (
    <button
      type="button"
      aria-label="Play recording"
      className="grid h-8 w-8 place-items-center rounded-full"
      style={{ background: "#5266eb" }}
    >
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
        <path d="M0 0L10 6L0 12V0Z" fill="white" />
      </svg>
    </button>
  );
}

