import { cn } from "@/lib/utils";

type WaveformSize = "mini" | "default" | "hero";

interface WaveformProps {
  /** mini: 12px tall (inline with rows). default: 28px (in cards). hero: 110px (watermark) */
  size?: WaveformSize;
  /** Number of bars to render. 5 for mini, 8 for default, 10 for hero. */
  bars?: number;
  /** Forwarded className for wrapper composition. */
  className?: string;
  /** Whether the waveform is "active" (animated). When false, bars hold a static state. */
  active?: boolean;
}

/**
 * Vouch's signature voice-waveform motif.
 *
 * The visible-everywhere visual cue that this is a voice product.
 * Used inline in deal rows, in cards, as a hero watermark.
 *
 * Styling lives in app/globals.css under `.vouch-waveform`.
 *
 * @example
 * <Waveform size="hero" bars={10} />
 * <Waveform size="mini" bars={5} />
 */
export function Waveform({
  size = "default",
  bars = size === "mini" ? 5 : size === "hero" ? 10 : 8,
  className,
  active = true,
}: WaveformProps) {
  return (
    <span
      className={cn(
        "vouch-waveform",
        size === "mini" && "size-mini",
        size === "hero" && "size-hero",
        !active && "[&_span]:animation-duration-[0s]",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}
