import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Compose Tailwind class names — handles conflicts (e.g. `p-2 p-4` → `p-4`)
 * and conditional classes. Standard shadcn/ui pattern.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a money amount in pence/cents (Stripe convention) as a localised string.
 * @example formatMoney(40000) → "£400.00"
 */
export function formatMoney(
  amountInMinorUnits: number,
  currency: "GBP" | "USD" | "EUR" = "GBP",
): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountInMinorUnits / 100);
}

/**
 * Vouch's brand abbreviation for a deal: VCH_xxxxxx.
 * Used as the human-facing deal reference.
 */
export function dealReference(id: string): string {
  const hash = id.replace(/[^A-Za-z0-9]/g, "").slice(0, 6).toUpperCase();
  return `VCH_${hash}`;
}

/**
 * Render a party's first name for UI surfaces, swapping any persisted
 * placeholder string ("the other party", "Seller", "") for a clean role
 * label. The placeholders leak into the deal record when a deal is
 * created before Vera knows the counterparty's name (e.g. /new with no
 * extension prefill) — without this guard, the timeline reads "the other
 * party committed" instead of "Seller committed".
 */
const PARTY_PLACEHOLDER_NAMES = new Set([
  "",
  "seller",
  "buyer",
  "the seller",
  "the buyer",
  "the other party",
]);

export function isPlaceholderName(name?: string | null): boolean {
  if (!name) return true;
  return PARTY_PLACEHOLDER_NAMES.has(name.toLowerCase().trim());
}

export function displayPartyName(
  name: string | undefined | null,
  fallback: string = "Seller",
): string {
  return isPlaceholderName(name) ? fallback : (name as string);
}

/**
 * Friendly display label for a deal status. The internal enum keeps
 * developer-friendly SHOUTY_SNAKE_CASE (DRAFT, AWAITING_SELLER, IN_ESCROW,
 * etc.) but those leak into UI surfaces and look engineered. This helper
 * maps the enum to short copy we actually want users to read.
 *
 * In particular: "IN_ESCROW" becomes "MONEY HELD" everywhere — the word
 * "escrow" is a US-finance jargon term that doesn't add clarity for the
 * marketplace buyer/seller persona.
 */
const STATUS_DISPLAY_LABELS: Record<string, string> = {
  DRAFT: "DRAFT",
  AWAITING_SELLER: "AWAITING SELLER",
  AGREED: "AGREED",
  IN_ESCROW: "MONEY HELD",
  RELEASED: "RELEASED",
  REFUNDED: "REFUNDED",
  DISPUTED: "DISPUTED",
  REVIEWING: "REVIEWING",
  CANCELLED: "CANCELLED",
};

export function statusDisplay(status: string): string {
  return STATUS_DISPLAY_LABELS[status] ?? status;
}
