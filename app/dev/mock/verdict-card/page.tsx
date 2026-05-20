/**
 * Dev-only mock page rendering the Beat 11 dispute verdict card.
 * Glassmorphism backdrop blur per demo-video-script-v4.md spec:
 * "Verdict card slides up · glassmorphism backdrop blur 22px saturate 170%".
 *
 * Visit /dev/mock/verdict-card → screenshot the card.
 */

export const metadata = {
  title: "Mock · Verdict card",
  robots: { index: false, follow: false },
};

export default function VerdictCardMockPage() {
  return (
    <main
      className="min-h-screen px-6 py-16 text-[#2a2924]"
      style={{
        background:
          "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(82, 102, 235, 0.10) 0%, transparent 70%), #f6f5f2",
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-8 items-center">
        <header className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
            Mock · Beat 11 verdict card
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold leading-tight">
            Dispute resolved · refund issued
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#5a5548]">
            Screenshot the card below. The cream gradient backdrop replicates
            the Beat 11 stage background so the card's glassmorphism reads
            correctly.
          </p>
        </header>

        {/* The verdict card */}
        <div
          className="relative overflow-hidden rounded-2xl px-10 py-8"
          style={{
            width: 720,
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(22px) saturate(170%)",
            WebkitBackdropFilter: "blur(22px) saturate(170%)",
            border: "1px solid rgba(82, 102, 235, 0.20)",
            boxShadow:
              "0 8px 32px rgba(82, 102, 235, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <p
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              color: "#5266eb",
            }}
          >
            Vera · ruling
          </p>
          <h2
            className="mt-4 font-display font-semibold leading-tight"
            style={{ fontSize: 32, color: "#2a2924" }}
          >
            Refund to{" "}
            <span className="italic" style={{ color: "#5266eb" }}>
              Sarah
            </span>
            .
          </h2>
          <p
            className="mt-3 leading-relaxed"
            style={{ fontSize: 16, color: "#5a5548" }}
          >
            Marcus&rsquo;s recording committed to{" "}
            <span style={{ color: "#2a2924", fontWeight: 500 }}>no scratches, original box</span>.
            Sarah&rsquo;s evidence shows otherwise. £609.89 returns to the buyer.
          </p>
          <div
            className="mt-6 flex items-center gap-3 rounded-md px-4 py-3"
            style={{
              background: "rgba(181, 74, 58, 0.06)",
              border: "1px solid rgba(181, 74, 58, 0.20)",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.14em",
                color: "#b54a3a",
              }}
            >
              ⚐  Marcus&rsquo;s rep flagged · 1 dispute on record
            </span>
          </div>
        </div>
        <code className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5266eb]">
          b11-verdict-card.png · capture just the card, not the page chrome
        </code>
      </div>
    </main>
  );
}
