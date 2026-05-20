import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "How Vouch works",
  description:
    "Voice-recorded escrow that holds the buyer's money safe until the item arrives — and proves the seller's commitment in their own voice.",
};

/**
 * Server-side check that the screenshot referenced by `src` actually exists
 * under /public. While the demo stills are still being captured, missing
 * images render as an on-brand cream placeholder card with a hint about
 * what should land here. Once a real PNG is dropped at the same path, the
 * placeholder is replaced automatically — no page edits required.
 */
function publicAssetExists(src: string): boolean {
  if (!src.startsWith("/")) return false;
  const abs = path.join(process.cwd(), "public", src.slice(1));
  try {
    return fs.statSync(abs).isFile();
  } catch {
    return false;
  }
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <article className="mx-auto w-full max-w-3xl space-y-16">
        {/* Hero */}
        <header>
          <Eyebrow>Vouch · How it works</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            How <span className="italic text-[#5266eb]">Vouch</span> works.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#5a5548]">
            Voice-recorded escrow that holds the buyer&rsquo;s money safe until
            the item arrives — and proves the seller&rsquo;s commitment in their
            own voice. No upfront signup. No leaving the marketplace.
          </p>
        </header>

        {/* For buyers */}
        <section>
          <Eyebrow tone="indigo">For buyers</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
            See an item, lock the deal, get protected.
          </h2>

          <ol className="mt-10 space-y-12">
            <Step
              number="01"
              title="See an item on eBay you want to buy."
              body="Browse listings normally. The Vouch Chrome extension injects a 'Pay with Vouch' button next to 'Buy It Now' on every product page."
              image={{
                src: "/images/how-it-works/buyer-01-ebay.png",
                alt: "eBay listing with the Pay with Vouch button injected",
              }}
              hint="eBay listing with the Pay with Vouch button injected next to Buy It Now"
            />
            <Step
              number="02"
              title="Click the button. Tell Vera what you expect."
              body="Vera, our AI mediator, captures the deal in 30 seconds via voice. She already knows what you're buying — she just needs to know when you expect it to arrive."
              image={{
                src: "/images/how-it-works/buyer-02-new.png",
                alt: "Vouch deal-intake page with Vera asking when delivery is expected",
              }}
              hint="/new page with Vera asking 'When do you expect it to arrive by?'"
            />
            <Step
              number="03"
              title="Share the link with the seller."
              body="Once they agree and you both sign off together, your money locks safely with Stripe — not with the seller, not with us — until the item arrives."
              image={{
                src: "/images/how-it-works/buyer-03-signoff.png",
                alt: "Joint sign-off screen showing buyer and seller about to confirm",
              }}
              hint="Joint sign-off page in 'ready' stage — both parties about to confirm"
            />
          </ol>
        </section>

        {/* For sellers */}
        <section>
          <Eyebrow tone="indigo">For sellers</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
            No signup. No fees until you sell.
          </h2>

          <ol className="mt-10 space-y-12">
            <Step
              number="01"
              title="You get a link from the buyer."
              body="They send you a Vouch deal link via email, WhatsApp, SMS — whatever's natural. No account creation, no app download."
              image={{
                src: "/images/how-it-works/seller-01-link.png",
                alt: "Seller receiving a Vouch deal link in a chat",
              }}
              hint="Phone chat (iMessage/WhatsApp) showing a vouch.fund deal link"
            />
            <Step
              number="02"
              title="Vera reads the buyer's terms back to you."
              body="You hear exactly what they agreed to. Agree, counter, or decline — all by voice. Vera captures your fulfilment commitment: how you're shipping it, and when."
              image={{
                src: "/images/how-it-works/seller-02-intake.png",
                alt: "Seller intake page with Vera reading the buyer's terms",
              }}
              hint="/deal/[ref]/seller — name entered, Vera reading buyer's terms"
            />
            <Step
              number="03"
              title="Connect your bank with Stripe — 30 seconds."
              body="Stripe Express handles the verification. No upfront onboarding required — it's just-in-time, when you're actually about to receive money."
              image={{
                src: "/images/how-it-works/seller-03-onboard.png",
                alt: "Stripe Connect Express onboarding embedded in Vouch",
              }}
              hint="/onboard?deal_id=… with embedded Stripe Connect Express iframe"
            />
            <Step
              number="04"
              title="Both of you sign off. Money locks in escrow."
              body="The buyer's money sits with Stripe until they confirm the item arrived. Once they do, funds release to your bank automatically."
              image={{
                src: "/images/how-it-works/seller-04-signoff.png",
                alt: "Joint sign-off complete; money locked in escrow",
              }}
              hint="/deal/[ref]/signoff in IN_ESCROW — green locked card with £400 amount"
            />
          </ol>
        </section>

        {/* Disputes */}
        <section>
          <Eyebrow>If something goes wrong</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
            The recording <span className="italic text-[#5266eb]">is</span> the
            evidence.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5a5548]">
            If the item doesn&rsquo;t match what was promised, Vera plays back
            the seller&rsquo;s original commitment in their own voice. The
            recording is the evidence. Most disputes resolve in under an hour —
            no &ldquo;he-said-she-said&rdquo; over messenger.
          </p>
          <ScreenshotOrPlaceholder
            src="/images/how-it-works/dispute-replay.png"
            alt="Vera replaying the seller's voice commitment during a dispute"
            hint="Dispute · Vera replay UI (mock — Figma spec in docs/dispute-card-spec.md)"
          />
        </section>

        {/* FAQ */}
        <section>
          <Eyebrow>Frequently asked</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
            Quick answers.
          </h2>

          <dl className="mt-8 space-y-8">
            <Faq
              q="Do I need a Vouch account before using the extension?"
              a="No. Buyers tap the button on any eBay listing. Sellers onboard naturally when they receive a Vouch deal link — Stripe Express setup takes about 30 seconds, when it's actually relevant."
            />
            <Faq
              q="Where does the money go?"
              a="Stripe holds it in escrow. We never touch buyer payment details — Stripe is PCI-compliant infrastructure built for marketplaces."
            />
            <Faq
              q="What if the seller never delivers?"
              a="Vouch refunds the buyer automatically after the agreed acceptance window expires. The whole point is that you never send money to a stranger without recourse."
            />
            <Faq
              q="What if I bought the wrong size, or changed my mind?"
              a="Use the same dispute flow. Vera helps both sides reach a fair outcome — sometimes a partial refund, sometimes a return, sometimes both parties agree to let it stand. Voice recordings keep everyone honest."
            />
          </dl>
        </section>

        {/* Footer CTA */}
        <footer className="border-t border-[rgba(50,30,5,0.12)] pt-10">
          <p className="text-sm text-[#5a5548]">
            Ready to try it?{" "}
            <Link
              href="/"
              className="font-medium text-[#5266eb] underline underline-offset-2 hover:text-[#4253d4]"
            >
              Back to Vouch
            </Link>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}

function Step({
  number,
  title,
  body,
  image,
  hint,
}: {
  number: string;
  title: string;
  body: string;
  image: { src: string; alt: string };
  hint: string;
}) {
  return (
    <li className="grid items-start gap-6 sm:grid-cols-[80px_1fr]">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8478]">
        Step {number}
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-[#5a5548]">{body}</p>
        <div className="mt-5">
          <ScreenshotOrPlaceholder
            src={image.src}
            alt={image.alt}
            hint={hint}
          />
        </div>
      </div>
    </li>
  );
}

/**
 * Renders next/image if the file exists under /public; otherwise renders an
 * on-brand cream placeholder card with a short hint. Used so the page looks
 * intentional while demo stills are being captured — when a real PNG lands
 * at the same path, Next.js picks it up on the next request.
 */
function ScreenshotOrPlaceholder({
  src,
  alt,
  hint,
}: {
  src: string;
  alt: string;
  hint: string;
}) {
  const exists = publicAssetExists(src);
  if (exists) {
    return (
      <div className="overflow-hidden rounded-lg border border-[rgba(50,30,5,0.10)] bg-white">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={750}
          className="h-auto w-full"
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className="relative flex aspect-[1200/750] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[rgba(50,30,5,0.18)] bg-[#fbfaf6]"
    >
      {/* Soft indigo glow corner — keeps placeholder on-brand */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 80% 20%, rgba(82,102,235,0.10) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 px-6 text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a8478]">
          Screenshot coming
        </span>
        <p className="font-display text-lg font-medium leading-snug text-[#2a2924]">
          {hint}
        </p>
        <code className="rounded bg-white px-2 py-1 font-mono text-[10px] text-[#5a5548]">
          {src}
        </code>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <dt className="font-display text-lg font-semibold text-[#2a2924]">{q}</dt>
      <dd className="mt-2 text-base leading-relaxed text-[#5a5548]">{a}</dd>
    </div>
  );
}
