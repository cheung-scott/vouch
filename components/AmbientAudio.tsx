"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface AmbientAudioProps {
  /** Path to the audio file (loops). Defaults to /audio/landing-loop.mp3 */
  src?: string;
  /** Volume when unmuted, 0-1. Default 0.16 (HN++ default — subtle). */
  volume?: number;
  className?: string;
}

/**
 * Ambient audio toggle — HN++ pattern.
 *
 * Loads audio muted by default (autoplay-safe).
 * User clicks to unmute. Fixed bottom-right corner (or override via className).
 * Graceful failure — if /audio/landing-loop.mp3 doesn't exist, button still
 * renders and the loop just silently doesn't play.
 *
 * Used only on the marketing landing — not in the app.
 */
export function AmbientAudio({
  src = "/audio/landing-loop.mp3",
  volume = 0.16,
  className,
}: AmbientAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);

  const ensureAudio = () => {
    if (audioRef.current) return audioRef.current;
    const a = new Audio(src);
    a.loop = true;
    a.volume = volume;
    a.muted = true;
    a.play().catch(() => {
      // autoplay blocked or file missing — silent fail
    });
    audioRef.current = a;
    return a;
  };

  const toggle = () => {
    const a = ensureAudio();
    const next = !muted;
    a.muted = next;
    if (!next) a.play().catch(() => {});
    setMuted(next);
  };

  return (
    <button
      onClick={toggle}
      type="button"
      aria-label={muted ? "Unmute ambient audio" : "Mute ambient audio"}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "border border-white/20 bg-black/55 text-white backdrop-blur-md",
        "transition-all hover:scale-[1.08] hover:bg-black/75",
        muted && "text-white/55",
        className,
      )}
    >
      {muted ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </button>
  );
}
