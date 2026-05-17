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

export interface VeraVoiceSessionProps {
  sessionType: SessionType;
  userFirstName: string;
  dealId?: string;
  locale?: string;
  /** Disable the start button (e.g. before the user has typed their name). */
  disabled?: boolean;
  /** Optional copy override for the cold-start CTA. */
  startLabel?: string;
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
function VeraVoiceSessionInner({
  sessionType,
  userFirstName,
  dealId,
  locale,
  disabled = false,
  startLabel = "Talk to Vera",
  onSessionEnd,
  onTranscript,
  className,
}: VeraVoiceSessionProps) {
  const [local, setLocal] = useState<LocalStatus>("idle");
  const [error, setError] = useState<string | null>(null);

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
      const role = source === "user" ? "user" : "agent";
      onTranscriptRef.current?.(role, message);
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
  }, [conversation, dealId, disabled, locale, sessionType, userFirstName]);

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
                Push-to-talk · powered by ElevenLabs ConvAI
              </span>
            </span>
          </span>
          <kbd className="rounded border border-white/30 bg-white/10 px-2 py-1 font-mono text-[10px]">
            HOLD
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
                Live · tap End when you&rsquo;re done
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
              className="flex items-center gap-2 rounded-md border border-[rgba(50,30,5,0.18)] bg-white px-3 py-2 text-sm font-medium text-[#2a2924] transition-colors hover:bg-[#fbfaf6]"
            >
              <Square className="h-3.5 w-3.5" /> End
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 font-mono text-xs text-[#b54a3a]">{error}</p>
      )}
    </div>
  );
}
