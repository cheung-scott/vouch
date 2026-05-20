"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Waveform } from "./Waveform";

type SessionType =
  | "BUYER_ONBOARDING"
  | "SELLER_ONBOARDING"
  | "JOINT_SIGNOFF"
  | "VOICE_RECEIPT"
  | "DISPUTE";

/**
 * Extension-supplied terms forwarded to the conversation-token mint endpoint
 * so the auto-created deal is seeded non-blank and Vera can skip to Q4.
 * Mirrors the server-side `PrefilledTermsSchema`.
 */
export interface PrefilledTerms {
  item?: string;
  amount_minor?: number;
  currency?: "GBP" | "USD" | "EUR";
  seller_name?: string;
  source?: "ebay" | "direct";
}

export interface VeraVoiceSessionProps {
  sessionType: SessionType;
  userFirstName: string;
  dealId?: string;
  locale?: string;
  /** Disable the start button (e.g. before the user has typed their name). */
  disabled?: boolean;
  /** Optional copy override for the cold-start CTA. */
  startLabel?: string;
  /** Extension-provided pre-fill (eBay listing capture etc.). */
  prefilledTerms?: PrefilledTerms;
  /**
   * Auto-start the session once on mount, provided !disabled, status is idle,
   * and userFirstName is non-empty. Use on voice-first pages (seller intake,
   * joint sign-off) where the user has no reason to tap before Vera speaks.
   * Mic permission persists per-origin, so first-time visitors will see the
   * browser permission prompt fire automatically. Do NOT use on /new — the
   * name+email form must be filled first.
   */
  autoStart?: boolean;
  /**
   * Fired after the session ends. The page should refetch the deal to pick
   * up any state changes Vera made via her server tools (extract_terms,
   * commit_buyer_side, lock_escrow, etc.).
   */
  onSessionEnd?: () => void;
  /**
   * Fired on every transcript message (user + agent). Useful for showing a
   * running caption strip alongside the mic UI.
   */
  onTranscript?: (role: "user" | "agent", message: string) => void;
  className?: string;
}

type LocalStatus = "idle" | "starting" | "live" | "error";

/**
 * Public wrapper — provides the ConversationProvider context the @elevenlabs/react
 * useConversation hook requires. Each page-level usage gets its own provider so
 * voice state never leaks across pages.
 */
export function VeraVoiceSession(props: VeraVoiceSessionProps) {
  return (
    <ConversationProvider>
      <VeraVoiceSessionInner {...props} />
    </ConversationProvider>
  );
}

/**
 * Vera push-to-talk session — wraps @elevenlabs/react's useConversation hook
 * and the server-side conversation-token mint route. The agent ID and API
 * key never leave the server (S-007 pattern).
 *
 * ConvAI's voice mode is VAD-based, so "push-to-talk" is the user-facing
 * label rather than a literal walkie-talkie gate. Tap to start, tap End to
 * stop. The mic-mute toggle is available mid-session if the user needs to
 * pause without ending the conversation.
 */
type CaptionLine = { role: "user" | "agent"; message: string; at: number };

function VeraVoiceSessionInner({
  sessionType,
  userFirstName,
  dealId,
  locale,
  disabled = false,
  startLabel = "Talk to Vera",
  prefilledTerms,
  autoStart = false,
  onSessionEnd,
  onTranscript,
  className,
}: VeraVoiceSessionProps) {
  const [local, setLocal] = useState<LocalStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  // Rolling caption strip — last 2 lines. ConvAI v2.2 uses Scribe v2 Realtime
  // as the ASR by default, so user transcripts arrive on every utterance.
  // This is the Day 5 Beat 4 caption work — the Polish line that morphs to
  // English in the demo video draws straight off this state.
  const [captions, setCaptions] = useState<CaptionLine[]>([]);

  // Keep the latest onSessionEnd / onTranscript in refs so the conversation
  // callbacks can fire stable references without retriggering the hook.
  const onSessionEndRef = useRef(onSessionEnd);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onSessionEndRef.current = onSessionEnd;
  }, [onSessionEnd]);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const conversation = useConversation({
    onMessage: ({ source, message }: { source: string; message: string }) => {
      const role: "user" | "agent" = source === "user" ? "user" : "agent";
      // Strip EL audio tags like [warmly], [Patiently], [confidently] —
      // they're prosody hints for the TTS engine, not user-visible text.
      // Collapse the resulting double-spaces.
      const cleaned = message
        .replace(/\[[^\]]+\]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      setCaptions((prev) =>
        [...prev, { role, message: cleaned, at: Date.now() }].slice(-2),
      );
      onTranscriptRef.current?.(role, cleaned);
    },
    onError: (msg: unknown) => {
      const text = typeof msg === "string" ? msg : "conversation_error";
      setError(text);
      setLocal("error");
    },
    onDisconnect: () => {
      setLocal("idle");
      onSessionEndRef.current?.();
    },
  });

  const { status, isSpeaking, isMuted, setMuted, endSession } = conversation;

  const start = useCallback(async () => {
    if (disabled) return;
    setError(null);
    setCaptions([]);
    setLocal("starting");
    try {
      // Browser must explicitly request mic — startSession will also do this
      // but doing it here surfaces a cleaner error message if denied.
      if (
        typeof navigator !== "undefined" &&
        navigator.mediaDevices?.getUserMedia
      ) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const res = await fetch("/api/vera/conversation-token", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          session_type: sessionType,
          user_first_name: userFirstName,
          deal_id: dealId,
          locale,
          prefilled_terms: prefilledTerms,
        }),
      });
      const json = (await res.json()) as {
        token?: string;
        dynamic_variables?: Record<string, string>;
        error?: string;
      };
      if (!res.ok || !json.token) {
        throw new Error(json.error ?? "token_failed");
      }

      await conversation.startSession({
        conversationToken: json.token,
        connectionType: "webrtc",
        dynamicVariables: json.dynamic_variables ?? {},
      });
      setLocal("live");
    } catch (err) {
      const text =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone access denied. Use the text input below instead."
          : err instanceof Error
            ? err.message
            : "unknown_error";
      setError(text);
      setLocal("error");
    }
  }, [
    conversation,
    dealId,
    disabled,
    locale,
    prefilledTerms,
    sessionType,
    userFirstName,
  ]);

  const stop = useCallback(() => {
    // Don't optimistically flip to "idle" here — let onDisconnect own
    // the transition. Otherwise the user can re-tap "Talk to Vera"
    // before WebRTC has torn down, racing a fresh startSession against
    // the in-flight endSession on the same conversation object (SDK
    // throws — T1 H-1).
    void endSession();
  }, [endSession]);

  // Belt-and-braces: end any live session on unmount so navigation away from
  // a page never leaves Vera talking to an empty room.
  useEffect(() => {
    return () => {
      if (status === "connected") void endSession();
    };
  }, [endSession, status]);

  // Auto-start on mount for voice-first pages. Guarded by a ref so it only
  // fires once — after the user ends the session, they're back to a manual
  // TAP if they want another round (avoids loops if endSession → idle → fire
  // → endSession). Waits for userFirstName because SELLER_ONBOARDING reads
  // the name into Vera's opener.
  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStartedRef.current) return;
    if (!autoStart) return;
    if (disabled) return;
    if (local !== "idle") return;
    if (!userFirstName.trim()) return;
    autoStartedRef.current = true;
    // Defer to a microtask so React doesn't see a synchronous setState
    // inside the effect body (react-hooks/set-state-in-effect). start()
    // itself flips local → "starting" immediately, which would otherwise
    // trip the cascading-render lint rule.
    queueMicrotask(() => {
      void start();
    });
  }, [autoStart, disabled, local, userFirstName, start]);

  const live = local === "live" || status === "connected";
  const starting = local === "starting" || status === "connecting";
  const mode = isSpeaking ? "Vera is speaking" : "Vera is listening";

  return (
    <div
      className={cn(
        "rounded-xl border border-[rgba(50,30,5,0.10)] bg-white p-4",
        className,
      )}
    >
      {!live && !starting && (
        <button
          type="button"
          onClick={start}
          disabled={disabled}
          className={cn(
            "group flex w-full items-center justify-between gap-4 rounded-lg",
            "bg-[#5266eb] px-5 py-4 text-left text-white transition-colors",
            "hover:bg-[#4253d4] disabled:cursor-not-allowed disabled:opacity-40",
          )}
        >
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <Mic className="h-4 w-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">{startLabel}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/70">
                Powered by ElevenLabs ConvAI
              </span>
            </span>
          </span>
          <kbd className="rounded border border-white/30 bg-white/10 px-2 py-1 font-mono text-[10px]">
            TAP
          </kbd>
        </button>
      )}

      {starting && (
        <div className="flex items-center gap-3 px-2 py-3 text-sm text-[#5a5548]">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#5266eb]/10">
            <Mic className="h-4 w-4 animate-pulse text-[#5266eb]" />
          </span>
          <span>Connecting Vera…</span>
        </div>
      )}

      {live && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full",
                isSpeaking
                  ? "bg-[#5266eb] text-white"
                  : "bg-[#5266eb]/10 text-[#5266eb]",
              )}
            >
              <Waveform size="mini" bars={5} />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold text-[#2a2924]">
                {mode}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8478]">
                Live · tap End to continue when Vera&rsquo;s finished
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted(!isMuted)}
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border transition-colors",
                isMuted
                  ? "border-[#b54a3a]/40 bg-[rgba(181,74,58,0.06)] text-[#b54a3a]"
                  : "border-[rgba(50,30,5,0.18)] bg-white text-[#5a5548] hover:bg-[#fbfaf6]",
              )}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
            <button
              type="button"
              onClick={stop}
              className="flex items-center gap-2 rounded-md border border-[#5266eb] bg-[#5266eb] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4253d4]"
              title="End the conversation and continue"
            >
              <Square className="h-3.5 w-3.5" /> End &amp; continue
            </button>
          </div>
          </div>

          {captions.length > 0 && (
            <div
              className="flex flex-col gap-1 rounded-md bg-[#fbfaf6] px-3 py-2 font-mono text-xs"
              aria-live="polite"
              data-testid="vera-caption-strip"
            >
              {captions.map((line) => (
                <div
                  key={line.at}
                  className={cn(
                    "flex gap-2",
                    line.role === "user"
                      ? "text-[#2a2924]"
                      : "text-[#5266eb]",
                  )}
                >
                  <span className="shrink-0 uppercase tracking-[0.14em] text-[10px] opacity-60">
                    {line.role === "user" ? "you" : "vera"}
                  </span>
                  <span className="break-words">{line.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
      )}
    </div>
  );
}
