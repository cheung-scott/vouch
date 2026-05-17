import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildVeraDynamicVariables,
  getVeraConversationToken,
  type VeraSessionType,
} from "@/lib/elevenlabs";
import { dealStore } from "@/lib/deals";

const SessionTypeEnum = z.enum([
  "BUYER_ONBOARDING",
  "SELLER_ONBOARDING",
  "JOINT_SIGNOFF",
  "VOICE_RECEIPT",
  "DISPUTE",
]);

const RequestSchema = z.object({
  session_type: SessionTypeEnum,
  user_first_name: z.string().min(1).max(80),
  deal_id: z.string().uuid().optional(),
  locale: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/)
    .optional(),
});

/**
 * Mints a short-lived ConvAI conversation token + curated dynamic-variable
 * payload for the calling page. The agent ID and API key never leave the
 * server. The dynamic variables (counterparty name, amount, etc.) are
 * derived from the server's deal record so the client cannot inject a
 * mismatched counterparty into Vera's context.
 *
 * Symmetry with S-002 / S-003 / S-004: the client gives us a deal_id and
 * its own session_type/first-name; we look up the deal server-side and
 * decide what to expose.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const {
    session_type: sessionType,
    user_first_name: userFirstName,
    deal_id: dealId,
    locale,
  } = parsed.data;

  // BUYER_ONBOARDING is allowed without a deal_id (deal is created mid-flow).
  // All other session types require an existing deal — and we derive the
  // counterparty / amount from the server record, not the client.
  let counterpartyName = "";
  let amountSpoken = "";
  if (dealId) {
    const deal = await dealStore.get(dealId);
    if (!deal) {
      return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
    }
    counterpartyName = inferCounterpartyName(deal, sessionType, userFirstName);
    amountSpoken = formatAmountSpoken(
      deal.terms.amountMinor,
      deal.terms.currency,
    );
  } else if (sessionType !== "BUYER_ONBOARDING") {
    return NextResponse.json({ error: "deal_id_required" }, { status: 400 });
  }

  let token: string;
  try {
    token = await getVeraConversationToken();
  } catch (err) {
    console.error("[conversation-token] mint failed", err);
    return NextResponse.json({ error: "convai_unavailable" }, { status: 502 });
  }

  const dynamicVariables = buildVeraDynamicVariables({
    sessionType,
    userFirstName,
    dealId,
    counterpartyName,
    amountSpoken,
    locale,
  });

  return NextResponse.json({ token, dynamic_variables: dynamicVariables });
}

function inferCounterpartyName(
  deal: { buyer: { firstName?: string }; seller: { firstName?: string } },
  sessionType: VeraSessionType,
  userFirstName: string,
): string {
  // For SELLER_ONBOARDING the counterparty is always the buyer.
  // For BUYER_ONBOARDING (with an existing deal, edge case) it's the seller.
  // For JOINT_SIGNOFF / VOICE_RECEIPT / DISPUTE both parties may be present;
  // pick whichever doesn't match the speaker's first name (case-insensitive).
  if (sessionType === "SELLER_ONBOARDING") return deal.buyer.firstName ?? "";
  if (sessionType === "BUYER_ONBOARDING") return deal.seller.firstName ?? "";
  const u = userFirstName.trim().toLowerCase();
  if (u && deal.buyer.firstName?.toLowerCase() === u) {
    return deal.seller.firstName ?? "";
  }
  if (u && deal.seller.firstName?.toLowerCase() === u) {
    return deal.buyer.firstName ?? "";
  }
  return deal.seller.firstName ?? deal.buyer.firstName ?? "";
}

function formatAmountSpoken(amountMinor: number, currency: string): string {
  // Spoken-form helper for Vera's first message. Keeps decimals out of speech
  // when the amount is a round figure ("four hundred pounds" reads better
  // than "four hundred point zero zero pounds").
  if (!amountMinor || !currency) return "";
  const major = amountMinor / 100;
  const word = currencyWord(currency);
  if (Number.isInteger(major)) return `${major} ${word}`;
  return `${major.toFixed(2)} ${word}`;
}

function currencyWord(currency: string): string {
  const c = currency.toUpperCase();
  if (c === "GBP") return "pounds";
  if (c === "USD") return "dollars";
  if (c === "EUR") return "euros";
  return c.toLowerCase();
}
