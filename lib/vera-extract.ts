import type { Currency } from "@/types/deal";

const CURRENCY_SYMBOLS: Record<string, Currency> = {
  "£": "GBP",
  $: "USD",
  "€": "EUR",
};
const CURRENCY_WORDS: Record<string, Currency> = {
  pound: "GBP",
  pounds: "GBP",
  gbp: "GBP",
  sterling: "GBP",
  dollar: "USD",
  dollars: "USD",
  usd: "USD",
  euro: "EUR",
  euros: "EUR",
  eur: "EUR",
};

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(\+?\d[\d\s-]{7,}\d)/;
const AMOUNT_SYMBOL_RE = /([£$€])\s*([\d,]+(?:\.\d{1,2})?)/;
const AMOUNT_WORD_RE =
  /([\d,]+(?:\.\d{1,2})?)\s*(pound|pounds|gbp|dollar|dollars|usd|euro|euros|eur|sterling)/i;
const QUANTITY_RE = /\b(\d+)\s*(units?|pieces?|items?|copies?|of them)\b/i;

export type ParsedTerms = {
  item?: string;
  quantity?: number;
  condition?: string;
  counterparty_name?: string;
  counterparty_email?: string;
  counterparty_phone?: string;
  amount_minor?: number;
  currency?: Currency;
  deadline_hint?: string;
  delivery_method?: string;
  notes?: string;
};

export function extractTermsFromUtterance(input: string): ParsedTerms {
  const trimmed = input.trim();
  if (!trimmed) return {};

  const out: ParsedTerms = {};

  const amountSymbol = trimmed.match(AMOUNT_SYMBOL_RE);
  if (amountSymbol) {
    const major = parseFloat(amountSymbol[2].replace(/,/g, ""));
    if (!Number.isNaN(major)) {
      out.amount_minor = Math.round(major * 100);
      out.currency = CURRENCY_SYMBOLS[amountSymbol[1]];
    }
  } else {
    const amountWord = trimmed.match(AMOUNT_WORD_RE);
    if (amountWord) {
      const major = parseFloat(amountWord[1].replace(/,/g, ""));
      if (!Number.isNaN(major)) {
        out.amount_minor = Math.round(major * 100);
        out.currency = CURRENCY_WORDS[amountWord[2].toLowerCase()];
      }
    }
  }

  const email = trimmed.match(EMAIL_RE);
  if (email) out.counterparty_email = email[0];

  const phone = trimmed.match(PHONE_RE);
  if (phone && !out.counterparty_email) {
    const digitsOnly = phone[1].replace(/\D/g, "");
    if (digitsOnly.length >= 8) out.counterparty_phone = phone[1].trim();
  }

  const quantity = trimmed.match(QUANTITY_RE);
  if (quantity) out.quantity = parseInt(quantity[1], 10);

  if (/\b(by|on|before)\s+([a-z]+day|\d{1,2}(st|nd|rd|th)?\s+[a-z]+|tomorrow|next week|this week)\b/i.test(trimmed)) {
    const match = trimmed.match(
      /\b(?:by|on|before)\s+([a-z]+day|\d{1,2}(?:st|nd|rd|th)?\s+[a-z]+|tomorrow|next week|this week)\b/i,
    );
    if (match) out.deadline_hint = match[1];
  }

  if (/\b(royal mail|dpd|fedex|ups|usps|tracked|courier|hand[- ]?delivery|in person|pickup|pick[- ]?up|collection)\b/i.test(trimmed)) {
    const match = trimmed.match(
      /\b(royal mail(?:\s+tracked)?|dpd|fedex|ups|usps|tracked|courier|hand[- ]?delivery|in person|pickup|pick[- ]?up|collection)\b/i,
    );
    if (match) out.delivery_method = match[1].toLowerCase();
  }

  const namedFor = trimmed.match(
    /\b(?:from|sold by|called|named|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\b/,
  );
  if (namedFor) out.counterparty_name = namedFor[1];

  if (!out.amount_minor && !out.counterparty_email && !out.counterparty_phone) {
    out.item = trimmed.length > 200 ? trimmed.slice(0, 200) : trimmed;
  } else if (
    out.amount_minor &&
    !out.counterparty_email &&
    !out.counterparty_phone &&
    trimmed.length > 0
  ) {
    const stripped = trimmed
      .replace(AMOUNT_SYMBOL_RE, "")
      .replace(AMOUNT_WORD_RE, "")
      .trim();
    if (stripped.length > 3) out.notes = stripped;
  }

  return out;
}
