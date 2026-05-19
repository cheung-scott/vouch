"use client";

import { useState } from "react";
import { Eyebrow } from "@/components/ui";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; what: string }
  | { kind: "ok"; what: string; payload: unknown }
  | { kind: "error"; what: string; message: string };

export default function OnboardPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function startConnect() {
    setStatus({ kind: "loading", what: "connect" });
    try {
      const res = await fetch("/api/connect/create-account", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, country: "GB" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? json.error ?? "failed");
      setStatus({ kind: "ok", what: "connect", payload: json });
      if (json.onboarding_url) window.location.href = json.onboarding_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      setStatus({ kind: "error", what: "connect", message });
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f6f5f2] px-6 py-16 text-[#2a2924]">
      <div className="w-full max-w-md">
        <Eyebrow>Vouch · Day 1 onboarding harness</Eyebrow>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
          Set up your <span className="italic text-[#5266eb]">account</span>.
        </h1>
        <p className="mt-4 text-sm text-[#5a5548]">
          Test the Stripe Connect Express + Identity flows. Both will redirect
          you to Stripe-hosted pages when you click below.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-medium">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-3 py-2 text-sm outline-none focus:border-[#5266eb] focus:ring-2 focus:ring-[#5266eb]/30"
            />
          </label>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={startConnect}
              disabled={!email || status.kind === "loading"}
              className="rounded-md bg-[#635bff] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5048e5] disabled:opacity-40"
            >
              {status.kind === "loading" && status.what === "connect"
                ? "Creating account..."
                : "Start Stripe Connect Express onboarding →"}
            </button>
          </div>

          {status.kind === "error" && (
            <div className="mt-4 rounded-md border border-[rgba(181,74,58,0.4)] bg-[rgba(181,74,58,0.08)] p-3 font-mono text-xs text-[#b54a3a]">
              {status.what} error: {status.message}
            </div>
          )}
          {status.kind === "ok" && (
            <p className="mt-4 text-sm text-[#5a5548]">
              Redirecting you to Stripe&hellip;
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
