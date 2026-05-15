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
