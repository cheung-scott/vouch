import { Eyebrow } from "@/components/ui";

export const metadata = {
  title: "Privacy — Vouch",
  description:
    "Vouch privacy policy. Covers the Chrome extension's data handling, the Vouch web app, and our use of third-party services.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <article className="mx-auto w-full max-w-2xl space-y-8">
        <header>
          <Eyebrow>Vouch · Privacy</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
            Privacy policy
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
            Effective 19 May 2026 · Last updated 19 May 2026
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-[#3d3a32]">
          <p>
            Vouch is a voice-recorded escrow service for peer-to-peer sales. This
            policy explains what data Vouch collects, why, and how it&rsquo;s
            used. It covers three surfaces: the Chrome extension, the Vouch web
            app at <span className="font-mono">vouch.fund</span>, and the
            third-party services Vouch builds on (Stripe, ElevenLabs, Vercel,
            Upstash).
          </p>
        </section>

        <Section title="The Chrome extension">
          <p>
            The Vouch Chrome extension injects a &ldquo;Pay with Vouch&rdquo;
            button onto eBay product listing pages. When you click the button:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              The extension reads the listing&rsquo;s title, price, currency, and
              seller username directly from the page&rsquo;s visible DOM
            </li>
            <li>
              These values are passed as query-string parameters to{" "}
              <span className="font-mono">vouch.fund/new</span>, which
              pre-populates the deal intake form
            </li>
            <li>
              The extension itself does not store, transmit, or sync any data
              elsewhere. There is no background service worker, no analytics, no
              telemetry, no cookies
            </li>
            <li>
              The extension only runs on eBay listing URLs
              (ebay.co.uk/itm/* and ebay.com/itm/*) and has no access to other
              websites
            </li>
          </ul>
          <p>
            If you uninstall the extension, no residual data exists since the
            extension stores nothing locally or remotely.
          </p>
        </Section>

        <Section title="The Vouch web app (vouch.fund)">
          <p>
            When you create a deal on Vouch, we collect:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Deal terms</strong> &mdash; item, price, currency, delivery
              method, parties&rsquo; names. Provided by you via voice or form
            </li>
            <li>
              <strong>Voice recordings</strong> &mdash; the audio of your
              conversation with Vera (our AI mediator). Used as the legally
              binding agreement record and replayed in dispute resolution
            </li>
            <li>
              <strong>Account identifiers</strong> &mdash; your email and the
              identifier issued by Stripe Connect when you onboard as a seller
            </li>
            <li>
              <strong>Payment metadata</strong> &mdash; transaction IDs and
              status updates from Stripe. We do not store card numbers, CVV, or
              bank account details &mdash; those live with Stripe under their
              PCI-compliant infrastructure
            </li>
          </ul>
          <p>
            Voice recordings and deal records are retained for the lifetime of
            the deal plus 7 years to comply with UK financial-services record
            retention standards. You can request deletion at any time after a
            deal closes by emailing the address below.
          </p>
        </Section>

        <Section title="Third-party services">
          <p>Vouch relies on the following providers:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Stripe Connect</strong> &mdash; payment processing,
              identity verification, payouts. Subject to{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-[#5266eb] underline underline-offset-2"
              >
                Stripe&rsquo;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>ElevenLabs</strong> &mdash; voice synthesis and
              real-time conversational AI. Voice samples are processed by
              ElevenLabs for transcription and Vera&rsquo;s responses. Subject
              to{" "}
              <a
                href="https://elevenlabs.io/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-[#5266eb] underline underline-offset-2"
              >
                ElevenLabs&rsquo; privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Vercel</strong> &mdash; hosting and request logging
              (anonymised IP addresses retained 30 days for security
              monitoring). Subject to{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="text-[#5266eb] underline underline-offset-2"
              >
                Vercel&rsquo;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Upstash Redis</strong> &mdash; deal state storage. Subject
              to{" "}
              <a
                href="https://upstash.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-[#5266eb] underline underline-offset-2"
              >
                Upstash&rsquo;s privacy policy
              </a>
              .
            </li>
          </ul>
        </Section>

        <Section title="What Vouch does not do">
          <ul className="list-disc space-y-1 pl-6">
            <li>We do not sell your data</li>
            <li>We do not run analytics or advertising trackers</li>
            <li>We do not share voice recordings with anyone other than the parties to that specific deal and our payment processor (Stripe) in the event of a dispute</li>
            <li>We do not contact you outside the context of an active deal</li>
          </ul>
        </Section>

        <Section title="Your rights">
          <p>
            Under UK GDPR you can request access to, correction of, or deletion
            of your data, and you can object to processing. Contact{" "}
            <a
              href="mailto:privacy@vouch.fund"
              className="text-[#5266eb] underline underline-offset-2"
            >
              privacy@vouch.fund
            </a>{" "}
            for any request.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We&rsquo;ll update this page if practices change, and surface a
            notice on the Vouch app for material updates. The &ldquo;Last
            updated&rdquo; date at the top reflects the most recent change.
          </p>
        </Section>

        <footer className="border-t border-[rgba(50,30,5,0.12)] pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478]">
          Vouch &middot; Voice-recorded escrow &middot; Built for ElevenHacks
          2026
        </footer>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 text-sm leading-relaxed text-[#3d3a32]">
      <h2 className="font-display text-xl font-semibold tracking-tight text-[#2a2924]">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
