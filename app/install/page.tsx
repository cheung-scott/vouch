import Link from "next/link";
import { Card, Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Get the Vouch Chrome extension",
  description:
    "Install the Vouch Chrome extension to add Pay with Vouch to any eBay listing — voice-recorded payment protection that holds the buyer's money safely until the item arrives.",
};

export default function InstallPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <article className="mx-auto w-full max-w-2xl space-y-12">
        <header>
          <Eyebrow>Vouch · Chrome extension</Eyebrow>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight">
            Get the <span className="italic text-[#5266eb]">extension</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#5a5548]">
            The Vouch Chrome extension injects a <span className="font-medium">Pay with Vouch</span> button
            next to <span className="font-mono text-sm">Buy It Now</span> on every eBay listing.
            Voice-recorded payment protection — your money is held safely with Stripe until the
            item arrives.
          </p>
        </header>

        {/* Primary download CTA */}
        <Card padding="loose" shadow>
          <Eyebrow tone="indigo">Download &amp; install</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
            v0.1.1 · ~11 KB · works on Chrome, Edge, Brave
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5a5548]">
            The extension isn&rsquo;t on the Chrome Web Store yet — it&rsquo;s currently
            distributed as an unpacked install for hackathon judges and early testers.
            Three minutes to set up.
          </p>
          <a
            href="/vouch-extension.zip"
            download
            className="mt-6 inline-block rounded-md bg-[#635bff] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
          >
            Download vouch-extension.zip →
          </a>
        </Card>

        {/* Install instructions */}
        <section>
          <Eyebrow>How to install</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
            Three steps. About 60 seconds.
          </h2>

          <ol className="mt-8 space-y-8">
            <InstallStep
              number="01"
              title={<>Download &amp; unzip</>}
              body="Click the download button above, then unzip the file somewhere you can find it (Downloads is fine). You'll see an 'extension' folder containing manifest.json, icons, and a src directory."
            />
            <InstallStep
              number="02"
              title="Open Chrome's extension page"
              body={
                <>
                  Open a new tab and go to{" "}
                  <code className="rounded bg-[rgba(50,30,5,0.06)] px-1.5 py-0.5 font-mono text-[13px]">
                    chrome://extensions
                  </code>
                  . Toggle{" "}
                  <span className="font-medium">Developer mode</span> on (top-right
                  corner).
                </>
              }
            />
            <InstallStep
              number="03"
              title="Load unpacked"
              body={
                <>
                  Click{" "}
                  <span className="font-medium">Load unpacked</span> (top-left, appears
                  once Developer mode is on). Select the{" "}
                  <code className="rounded bg-[rgba(50,30,5,0.06)] px-1.5 py-0.5 font-mono text-[13px]">
                    extension
                  </code>{" "}
                  folder you just unzipped. The Vouch extension will appear in your
                  extensions list, ready to go.
                </>
              }
            />
          </ol>
        </section>

        {/* Try it */}
        <Card tone="indigo" padding="loose">
          <Eyebrow tone="indigo">Try it</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
            Visit any eBay listing.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5a5548]">
            Open any eBay product page (e.g.{" "}
            <a
              href="https://www.ebay.co.uk/itm/"
              target="_blank"
              rel="noreferrer"
              className="text-[#5266eb] underline underline-offset-2"
            >
              ebay.co.uk
            </a>
            ). The extension injects a Pay with Vouch button next to the existing buy
            buttons. Click it to start a voice-mediated deal.
          </p>
        </Card>

        {/* FAQ-ish trust section */}
        <section>
          <Eyebrow>Safe to install</Eyebrow>
          <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
            What the extension does — and doesn&rsquo;t.
          </h2>

          <dl className="mt-8 space-y-6">
            <FaqRow
              q="What it does"
              a="Reads the publicly displayed item title, price, currency, and seller from eBay product pages so it can pre-fill them when you click Pay with Vouch. Injects a single button into the page. That's it."
            />
            <FaqRow
              q="What it doesn't do"
              a="No tracking. No analytics. No access to your eBay account or order history. No data sent anywhere except when you actively click Pay with Vouch (and then only the listing details, to pre-fill the deal on vouch.fund)."
            />
            <FaqRow
              q="Open source"
              a={
                <>
                  All extension code is in the{" "}
                  <a
                    href="https://github.com/cheung-scott/vouch/tree/main/extension"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5266eb] underline underline-offset-2"
                  >
                    Vouch repo on GitHub
                  </a>
                  . Read it before you install if you want.
                </>
              }
            />
          </dl>
        </section>

        <footer className="border-t border-[rgba(50,30,5,0.12)] pt-10">
          <p className="text-sm text-[#5a5548]">
            <Link
              href="/"
              className="font-medium text-[#5266eb] underline underline-offset-2 hover:text-[#4253d4]"
            >
              ← Back to Vouch
            </Link>
          </p>
        </footer>
      </article>
    </main>
  );
}

function InstallStep({
  number,
  title,
  body,
}: {
  number: string;
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <li className="grid items-start gap-6 sm:grid-cols-[80px_1fr]">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8478]">
        Step {number}
      </div>
      <div>
        <h3 className="font-display text-2xl font-semibold leading-tight">{title}</h3>
        <div className="mt-3 text-base leading-relaxed text-[#5a5548]">{body}</div>
      </div>
    </li>
  );
}

function FaqRow({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <div>
      <dt className="font-display text-lg font-semibold text-[#2a2924]">{q}</dt>
      <dd className="mt-2 text-base leading-relaxed text-[#5a5548]">{a}</dd>
    </div>
  );
}
