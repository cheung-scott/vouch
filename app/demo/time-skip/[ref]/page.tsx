"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  DemoModeBanner,
  Eyebrow,
} from "@/components/ui";

/**
 * The time-skip moment of the /demo walkthrough.
 *
 * After the joint sign-off locks the escrow, the demo needs a clear
 * "imagine 5 days pass" moment before the receipt confirmation. This is
 * a small cinematic beat — calendar pages fanning, day counter ticking,
 * something to signal time-passing without literally waiting.
 *
 * Final visual design is PENDING — needs v0/Figma iteration.
 */
export default function DemoTimeSkipPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = use(params);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-6 py-12 text-[#2a2924]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <Eyebrow>Vouch · Time skip</Eyebrow>
          <Link
            href={`/deal/${ref}`}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8a8478] hover:text-[#5a5548]"
          >
            View deal →
          </Link>
        </header>

        <DemoModeBanner />

        <Card padding="loose">
          <Eyebrow>Placeholder time-skip · 3 second auto-advance</Eyebrow>
          <p className="mt-4 font-display text-2xl font-semibold leading-tight">
            <span className="italic text-[#5266eb]">5 days later</span>…
          </p>
          <p className="mt-3 text-sm text-[#5a5548]">
            Marcus shipped the iPhone via Royal Mail tracked. Sarah&rsquo;s
            tracking shows it arrived this morning. Vera will check in.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {done ? (
              <Link
                href={`/deal/${ref}/signoff`}
                className="rounded-md bg-[#635bff] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5048e5]"
              >
                Continue to receipt confirmation →
              </Link>
            ) : (
              <p className="font-mono text-xs text-[#8a8478]">
                advancing…
              </p>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
