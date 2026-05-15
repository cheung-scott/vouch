import { cn } from "@/lib/utils";

type CardTone =
  | "default"
  | "indigo"
  | "warning"
  | "danger"
  | "success"
  | "locked";

const TONE_BORDER: Record<CardTone, string> = {
  default: "border-[rgba(50,30,5,0.10)]",
  indigo: "border-[#5266eb]/40",
  warning: "border-[#c98a42]/40",
  danger: "border-[#b54a3a]/40",
  success: "border-[#2f7d57]/40",
  locked: "border-[#7a6ce8]/40",
};

interface CardProps {
  tone?: CardTone;
  /** Default p-7 (~28px). Use "loose" for p-8, "tight" for p-5. */
  padding?: "default" | "loose" | "tight";
  /** Add the soft hover lift shadow from DESIGN.md. */
  shadow?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Solid card on cream background — per DESIGN.md §4 "Solid card" pattern.
 * Used for in-app surfaces. NOT the glass card (those use `backdrop-filter`).
 *
 * Tone changes the border color only — content remains on white.
 * Shadow optional (default off; on adds the subtle elevation from DESIGN.md §6).
 */
export function Card({
  tone = "default",
  padding = "default",
  shadow = false,
  className,
  children,
}: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border bg-white",
        TONE_BORDER[tone],
        padding === "loose" && "p-8",
        padding === "default" && "p-7",
        padding === "tight" && "p-5",
        shadow && "shadow-[0_4px_16px_rgba(40,20,5,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
