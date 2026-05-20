/**
 * Dev-only mock page rendering each StatusPill variant in isolation on a
 * clean cream background, sized large enough to crop cleanly with Snipping
 * Tool. Used by demo-video Beats 5/8/11 where individual status pills
 * cascade in animation.
 *
 * Visit /dev/mock/status-pills → screenshot each labeled pill section.
 */

import { StatusPill } from "@/components/ui/StatusPill";

export const metadata = {
  title: "Mock · Status pills",
  robots: { index: false, follow: false },
};

const PILLS: { status: string; filename: string; description: string }[] = [
  { status: "AWAITING_SELLER", filename: "b5-pill-awaiting-seller.png", description: "Beat 5 cascade · pre-lock" },
  { status: "AGREED", filename: "b5-pill-agreed.png", description: "Beat 5 cascade · post-handshake" },
  { status: "IN_ESCROW", filename: "b5-pill-in-escrow.png", description: "Beat 5 cascade · final · pulses in motion" },
  { status: "RELEASED", filename: "b8-pill-released.png", description: "Beat 8 payoff · money to seller" },
  { status: "REFUNDED", filename: "b11-pill-refunded.png", description: "Beat 11 verdict · money back to buyer" },
];

export default function StatusPillsMockPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Mock · status pills · isolated for demo capture
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
            5 pill states · screenshot each box
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Each pill sits centered in a 320×80 frame on cream, scaled 2x so
            it crops to a clean isolated asset for Remotion / Claude Design.
            Use the filename below each frame as the target.
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {PILLS.map((p) => (
            <section key={p.filename} className="flex flex-col gap-2">
              <div
                className="flex items-center justify-center bg-[#f6f5f2]"
                style={{ width: 320, height: 80 }}
              >
                <div style={{ transform: "scale(2)" }}>
                  <StatusPill
                    status={p.status}
                    pulse={p.status === "IN_ESCROW"}
                  />
                </div>
              </div>
              <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
                {p.filename}
              </code>
              <span className="font-mono text-[9px] uppercase tracking-[0.10em] text-[#8a8478]">
                {p.description}
              </span>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
