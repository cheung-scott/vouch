import { cn } from "@/lib/utils";

type EyebrowTone =
  | "muted"
  | "indigo"
  | "warning"
  | "danger"
  | "success"
  | "locked";

const TONE_CLASSES: Record<EyebrowTone, string> = {
  muted: "text-[#5a5548]",
  indigo: "text-[#5266eb]",
  warning: "text-[#c98a42]",
  danger: "text-[#b54a3a]",
  success: "text-[#2f7d57]",
  locked: "text-[#7a6ce8]",
};

interface EyebrowProps {
  tone?: EyebrowTone;
  className?: string;
  children: React.ReactNode;
}

/**
 * The mono uppercase label that sits above section headlines.
 * 11px, letter-spacing 0.16em, color-coded by tone.
 * Per DESIGN.md §3: "Eyebrow labels are always JetBrains Mono."
 */
export function Eyebrow({ tone = "muted", className, children }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.16em]",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
