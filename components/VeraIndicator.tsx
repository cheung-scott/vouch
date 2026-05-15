"use client";

import { cn } from "@/lib/utils";
import { Waveform } from "./Waveform";

interface VeraIndicatorProps {
  /** Position variant: floating button bottom-right, or inline pill */
  variant?: "floating" | "inline";
  /** Status text shown beside the waveform. */
  label?: string;
  /** Click handler — typically opens Vera's voice intake flow */
  onClick?: () => void;
  className?: string;
}

/**
 * Vera the AI mediator's presence indicator.
 *
 * Floating variant: fixed bottom-right, glassmorphic pill ("Talk to Vera ⌘V")
 * Inline variant: smaller status indicator embedded in a card
 *   ("Vera is waiting on Sarah's delivery confirmation")
 *
 * Voice waveform animates when Vera is "active" (listening or speaking).
 *
 * Day 1 stub — wire to ConvAI session opener when product is built.
 */
export function VeraIndicator({
  variant = "floating",
  label = "Talk to Vera",
  onClick,
  className,
}: VeraIndicatorProps) {
  if (variant === "floating") {
    return (
      <button
        onClick={onClick}
        type="button"
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full px-4 py-2.5",
          "glass text-sm font-medium text-ink shadow-[0_4px_16px_rgba(40,20,5,0.08)]",
          "transition-transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(40,20,5,0.12)]",
          className,
        )}
      >
        <Waveform size="mini" bars={5} />
        <span>{label}</span>
        <kbd className="ml-1 rounded border border-ink-muted/20 bg-cream-alt px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
          ⌘ V
        </kbd>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full px-3.5 py-2",
        "bg-indigo/10 text-sm font-medium text-indigo",
        "border border-indigo/20",
        className,
      )}
    >
      <Waveform size="mini" bars={5} />
      <span>{label}</span>
    </div>
  );
}
