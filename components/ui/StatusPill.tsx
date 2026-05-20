import { cn } from "@/lib/utils";
import type { DealStatus } from "@/types/deal";

type Variant = {
  dot: string;
  bg: string;
  fg: string;
  label: string;
};

const STATUS_VARIANTS: Record<DealStatus, Variant> = {
  DRAFT: {
    dot: "#8a8478",
    bg: "rgba(50,30,5,0.06)",
    fg: "#5a5548",
    label: "DRAFT",
  },
  AWAITING_SELLER: {
    dot: "#c98a42",
    bg: "rgba(201,138,66,0.14)",
    fg: "#c98a42",
    label: "AWAITING SELLER",
  },
  AGREED: {
    dot: "#c98a42",
    bg: "rgba(201,138,66,0.14)",
    fg: "#c98a42",
    label: "AGREED",
  },
  IN_ESCROW: {
    dot: "#7a6ce8",
    bg: "rgba(122,108,232,0.12)",
    fg: "#7a6ce8",
    label: "MONEY HELD",
  },
  RELEASED: {
    dot: "#2f7d57",
    bg: "rgba(47,125,87,0.12)",
    fg: "#2f7d57",
    label: "RELEASED",
  },
  REFUNDED: {
    dot: "#7a6a52",
    bg: "rgba(122,106,82,0.12)",
    fg: "#7a6a52",
    label: "REFUNDED",
  },
  DISPUTED: {
    dot: "#b54a3a",
    bg: "rgba(181,74,58,0.12)",
    fg: "#b54a3a",
    label: "DISPUTED",
  },
  REVIEWING: {
    dot: "#c98a42",
    bg: "rgba(201,138,66,0.14)",
    fg: "#c98a42",
    label: "REVIEWING",
  },
  CANCELLED: {
    dot: "#8a8478",
    bg: "rgba(50,30,5,0.06)",
    fg: "#5a5548",
    label: "CANCELLED",
  },
};

interface StatusPillProps {
  status: DealStatus | string;
  /** Pulse the dot — used for IN_ESCROW per DESIGN.md §4. */
  pulse?: boolean;
  className?: string;
}

/**
 * The mono status pill used on deals tables and detail cards.
 * Per DESIGN.md §4: 10px JetBrains Mono uppercase, 5px prefix dot, 4px radius.
 * Color variants by deal lifecycle status.
 */
export function StatusPill({ status, pulse, className }: StatusPillProps) {
  const variant = STATUS_VARIANTS[status as DealStatus] ?? STATUS_VARIANTS.DRAFT;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded font-mono text-[10px] font-semibold uppercase tracking-[0.06em]",
        className,
      )}
      style={{
        backgroundColor: variant.bg,
        color: variant.fg,
        padding: "3px 9px",
      }}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          pulse && "animate-pulse",
        )}
        style={{ backgroundColor: variant.dot }}
      />
      {variant.label}
    </span>
  );
}
