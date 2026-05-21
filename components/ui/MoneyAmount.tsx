import { cn } from "@/lib/utils";

interface MoneyAmountProps {
  /** Amount in minor units (pence/cents) per Stripe convention. */
  amountMinor: number;
  /** ISO 4217 currency code. Defaults to USD. */
  currency?: string;
  /** Locale for formatting. Defaults to en-US. */
  locale?: string;
  /** Show "—" instead of formatted zero. Default true. */
  dashOnZero?: boolean;
  /** Use bold weight (medium 500). Default false. */
  bold?: boolean;
  className?: string;
}

/**
 * Renders money in tabular numerals per DESIGN.md §3 + §2:
 * "Tabular numerals are mandatory on every money figure."
 *
 * Always uses font-variant-numeric: tabular-nums to align decimals across rows.
 */
export function MoneyAmount({
  amountMinor,
  currency = "USD",
  locale = "en-US",
  dashOnZero = true,
  bold = false,
  className,
}: MoneyAmountProps) {
  if (dashOnZero && !amountMinor) {
    return (
      <span
        className={cn("text-[#8a8478]", className)}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        —
      </span>
    );
  }
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amountMinor / 100);
  return (
    <span
      className={cn(bold && "font-medium", className)}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {formatted}
    </span>
  );
}
