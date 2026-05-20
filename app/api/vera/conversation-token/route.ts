import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildVeraDynamicVariables,
  getVeraConversationToken,
  type VeraSessionType,
} from "@/lib/elevenlabs";
import { dealStore } from "@/lib/deals";
import { checkBuyerOnboardingRateLimit, getClientIp } from "@/lib/ratelimit";

const SessionTypeEnum = z.enum([
  "BUYER_ONBOARDING",
  "SELLER_ONBOARDING",
  "JOINT_SIGNOFF",
  "VOICE_RECEIPT",
  "DISPUTE",
]);

// Pre-filled terms forwarded by the /new page when the buyer arrives via the
// Chrome extension (e.g. eBay listing → ?source=ebay&item=…&price=…). Lets the
// BUYER_ONBOARDING auto-create branch seed a non-blank deal so Vera can skip
// the already-captured questions and jump straight to Q4 (delivery).
const PrefilledTermsSchema = z
  .object({
    item: z.string().max(500).optional(),
    amount_minor: z.number().int().nonnegative().optional(),
    currency: z.enum(["GBP", "USD", "EUR"]).optional(),
    // Seller "name" from a marketplace is usually a username/handle (e.g.
    // "mrclearances"). Stays as a placeholder until SELLER_ONBOARDING captures
    // the real first name. Looser regex than user_first_name on purpose.
    seller_name: z.string().max(120).optional(),
    source: z.enum(["ebay", "direct"]).optional(),
  })
  .optional();

const RequestSchema = z.object({
  session_type: SessionTypeEnum,
  // Tightened (Sec-Review S-108): only allow letters, spaces, hyphens,
  // apostrophes — covers most international names. Blocks control chars
  // + newlines + curly braces that could be used to break out of the
  // dynamic-variable interpolation and inject prompt content into Vera.
  user_first_name: z
    .string()
    .min(1)
    .max(80)
    .regex(/^[\p{L}\s'\-]+$/u, "invalid_name_chars"),
  deal_id: z.string().uuid().optional(),
  locale: z
    .string()
    .regex(/^[a-z]{2}(-[A-Z]{2})?$/)
    .optional(),
  prefilled_terms: PrefilledTermsSchema,
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
    prefilled_terms: prefilledTerms,
  } = parsed.data;

  // BUYER_ONBOARDING is allowed without a deal_id — we auto-create a
  // deal here so Vera has a deal_id from turn 1. Without this,
  // extract_terms calls don't persist (no deal to update) and the
  // subsequent read_contract_back fails with 400 missing_deal_id —
  // exactly the failure mode the dashboard Test panel hit.
  //
  // Two flavours of auto-create:
  //   (a) blank deal — the cold-start /new flow, terms fill in turn-by-turn
  //   (b) pre-filled deal — buyer arrived via the Chrome extension with
  //       ?source=ebay&item=…&price=…; we seed item/amount/currency/seller
  //       up front and tell Vera (via dynamic vars) to skip to Q4 (delivery).
  // For all other session types, an existing deal_id is required.
  let counterpartyName = "";
  let amountSpoken = "";
  let effectiveDealId = dealId;
  let isPrefilled = false;
  let prefilledSummary = "";
  let startQuestion = "Q1_item";

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
  } else if (sessionType === "BUYER_ONBOARDING") {
    // Sec-Review S-103: IP-based ratelimit on the auto-create path.
    // Every other branch above requires a server-validated deal_id; this
    // is the only path that mutates state without one, so it's the only
    // public DoS vector for deal creation + Stripe/ElevenLabs quota burn.
    // 5 req/60s sliding window per IP. Fail-open in dev (no Upstash env);
    // fail-open on Redis errors. See lib/ratelimit.ts for rationale.
    const ip = getClientIp(request);
    const rl = await checkBuyerOnboardingRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "rate_limited", reset: rl.reset },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000))),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rl.reset),
          },
        },
      );
    }

    // Auto-create a deal seeded with the buyer's first name + any
    // extension-provided terms. Anything not provided stays blank and
    // gets filled turn-by-turn as Vera calls extract_terms with this
    // deal_id. The seller party stays a placeholder until SELLER_ONBOARDING
    // unless the extension supplied a seller handle (e.g. eBay username).
    const { randomUUID } = await import("node:crypto");
    const t = prefilledTerms;
    isPrefilled = !!(t && (t.item || t.amount_minor || t.seller_name));
    const sellerFirstName = t?.seller_name ?? "Seller";
    const seededTerms = {
      item: t?.item ?? "",
      quantity: 1,
      amountMinor: t?.amount_minor ?? 0,
      currency: t?.currency ?? ("GBP" as const),
    };
    const created = await dealStore.create({
      buyer: {
        id: randomUUID(),
        role: "BUYER",
        firstName: userFirstName,
        identityVerified: false,
      },
      seller: {
        id: randomUUID(),
        role: "SELLER",
        // Single-word placeholder until BUYER_ONBOARDING Q2 captures the
        // real name via extract_terms. "Seller" reads as a generic role
        // if it leaks into UI, unlike "the other party" which looked
        // like literal natural-language text (T1 H-3). When the extension
        // provides a marketplace handle (e.g. "mrclearances"), use that
        // as the placeholder so Vera can reference it in Q4.
        firstName: sellerFirstName,
        identityVerified: false,
      },
      terms: seededTerms,
    });
    effectiveDealId = created.id;
    if (isPrefilled) {
      counterpartyName = sellerFirstName;
      amountSpoken = formatAmountSpoken(
        seededTerms.amountMinor,
        seededTerms.currency,
      );
      prefilledSummary = formatPrefilledSummary(t);
      startQuestion = "Q4_delivery";
    }
  } else {
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
    dealId: effectiveDealId,
    counterpartyName,
    amountSpoken,
    locale,
    prefilled: isPrefilled,
    prefilledSummary,
    startQuestion,
  });

  return NextResponse.json({ token, dynamic_variables: dynamicVariables });
}

function formatPrefilledSummary(
  t:
    | {
        item?: string;
        amount_minor?: number;
        currency?: string;
        seller_name?: string;
      }
    | undefined,
): string {
  if (!t) return "";
  const parts: string[] = [];
  if (t.item) parts.push(t.item);
  if (t.amount_minor && t.currency) {
    parts.push(formatAmountSpoken(t.amount_minor, t.currency));
  }
  if (t.seller_name) parts.push(`from seller ${t.seller_name}`);
  return parts.join(", ");
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
