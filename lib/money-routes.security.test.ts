import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DealTerms, Party, PartyRole } from "@/types/deal";

/**
 * Regression tests for the P0 block. Each test names the finding it closes,
 * so a future refactor that reopens one fails here rather than in production.
 *
 * Stripe is mocked throughout — these assert what Vouch decides to send, not
 * what Stripe does with it. That is exactly the boundary worth testing: both
 * findings are about Vouch trusting the wrong input.
 */

const stripe = vi.hoisted(() => ({
  createEscrowPaymentIntent: vi.fn(),
  cancelIssuingCard: vi.fn(),
  refundCharge: vi.fn(),
  cancelEscrow: vi.fn(),
  calculatePlatformFee: vi.fn((minor: number) => Math.round(minor * 0.029)),
  sanitizeStripeError: vi.fn(() => ({ code: "test_error" })),
}));

vi.mock("@/lib/stripe", () => stripe);

const { dealStore } = await import("@/lib/deals");
const { tokenStore, BUYER_TOKEN_TTL_MS } = await import("@/lib/tokens");
const { POST: createIntent } = await import(
  "@/app/api/escrow/create-intent/route"
);
const { POST: refundDeal } = await import("@/app/api/vera/refund-deal/route");

function makeParty(role: PartyRole, firstName: string): Party {
  return { id: randomUUID(), role, firstName, identityVerified: false };
}

const TERMS: DealTerms = {
  item: "Leica M6",
  quantity: 1,
  amountMinor: 250_000,
  currency: "USD",
};

async function seedDeal() {
  return dealStore.create({
    buyer: makeParty("BUYER", "Ada"),
    seller: makeParty("SELLER", "Grace"),
    terms: TERMS,
  });
}

function post(url: string, body: unknown, token?: string) {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (token) headers.authorization = `Bearer ${token}`;
  return new NextRequest(`http://localhost${url}`, {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

/** A capability token the buyer would have received in their deal link. */
async function tokenFor(deal: { id: string; buyer: { id: string } }) {
  const { token } = await tokenStore.issue({
    partyId: deal.buyer.id,
    dealId: deal.id,
    role: "BUYER",
    ttlMs: BUYER_TOKEN_TTL_MS,
  });
  return token;
}

beforeEach(() => {
  vi.clearAllMocks();
  stripe.createEscrowPaymentIntent.mockResolvedValue({
    id: "pi_test",
    client_secret: "cs_test",
    status: "requires_payment_method",
    amount: TERMS.amountMinor,
    currency: "usd",
  });
  stripe.refundCharge.mockResolvedValue({ id: "re_test" });
  stripe.cancelIssuingCard.mockResolvedValue({ id: "ic_test" });
  stripe.sanitizeStripeError.mockReturnValue({ code: "test_error" });
});

describe("NEW-4 — escrow/create-intent must not trust the caller", () => {
  it("ignores a caller-supplied destination account and uses the deal's", async () => {
    const deal = await seedDeal();
    await dealStore.update(deal.id, {
      seller: { ...deal.seller, stripeAccountId: "acct_REAL_SELLER" },
    });

    const res = await createIntent(
      post(
        "/api/escrow/create-intent",
        {
          deal_id: deal.id,
          seller_account_id: "acct_ATTACKER",
          amount_minor: 1,
          currency: "gbp",
        },
        await tokenFor(deal),
      ),
    );

    expect(res.status).toBe(200);
    expect(stripe.createEscrowPaymentIntent).toHaveBeenCalledWith(
      expect.objectContaining({
        sellerAccountId: "acct_REAL_SELLER",
        amountMinor: TERMS.amountMinor,
        currency: "usd",
      }),
    );
  });

  it("refuses to create a hold when the seller has not onboarded", async () => {
    const deal = await seedDeal();

    const res = await createIntent(
      post(
        "/api/escrow/create-intent",
        { deal_id: deal.id, seller_account_id: "acct_ATTACKER" },
        await tokenFor(deal),
      ),
    );

    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toMatchObject({
      error: "seller_not_onboarded",
    });
    expect(stripe.createEscrowPaymentIntent).not.toHaveBeenCalled();
  });

  it("refuses a deal that has already moved past funding", async () => {
    const deal = await seedDeal();
    await dealStore.update(deal.id, {
      seller: { ...deal.seller, stripeAccountId: "acct_REAL_SELLER" },
    });
    await dealStore.setStatus(deal.id, "RELEASED");

    const res = await createIntent(
      post("/api/escrow/create-intent", { deal_id: deal.id }, await tokenFor(deal)),
    );

    expect(res.status).toBe(409);
    expect(stripe.createEscrowPaymentIntent).not.toHaveBeenCalled();
  });

  it("refuses a deal with no agreed amount", async () => {
    const deal = await dealStore.create({
      buyer: makeParty("BUYER", "Ada"),
      seller: makeParty("SELLER", "Grace"),
      terms: { ...TERMS, amountMinor: 0 },
    });
    await dealStore.update(deal.id, {
      seller: { ...deal.seller, stripeAccountId: "acct_REAL_SELLER" },
    });

    const res = await createIntent(
      post("/api/escrow/create-intent", { deal_id: deal.id }, await tokenFor(deal)),
    );

    expect(res.status).toBe(409);
    await expect(res.json()).resolves.toMatchObject({
      error: "no_agreed_amount",
    });
  });
});

describe("NEW-1 — guarded routes reject unauthenticated callers", () => {
  it("refuses escrow/create-intent with no credentials", async () => {
    const deal = await seedDeal();
    await dealStore.update(deal.id, {
      seller: { ...deal.seller, stripeAccountId: "acct_REAL_SELLER" },
    });

    const res = await createIntent(
      post("/api/escrow/create-intent", { deal_id: deal.id }),
    );

    expect(res.status).toBe(401);
    expect(stripe.createEscrowPaymentIntent).not.toHaveBeenCalled();
  });

  it("refuses vera/refund-deal with no credentials", async () => {
    const deal = await seedDeal();
    await dealStore.update(deal.id, { stripePaymentIntentId: "pi_funded" });
    await dealStore.setStatus(deal.id, "IN_ESCROW");

    const res = await refundDeal(
      post("/api/vera/refund-deal", { deal_id: deal.id }),
    );

    expect(res.status).toBe(401);
    expect(stripe.refundCharge).not.toHaveBeenCalled();
  });

  it("refuses a token belonging to a different deal", async () => {
    const deal = await seedDeal();
    await dealStore.update(deal.id, {
      seller: { ...deal.seller, stripeAccountId: "acct_REAL_SELLER" },
    });
    const otherDeal = await seedDeal();

    const res = await createIntent(
      post(
        "/api/escrow/create-intent",
        { deal_id: deal.id },
        await tokenFor(otherDeal),
      ),
    );

    expect(res.status).toBe(403);
    expect(stripe.createEscrowPaymentIntent).not.toHaveBeenCalled();
  });
});

describe("NEW-2 — a refund must kill the escrow card first", () => {
  async function seedFundedDealWithCard() {
    const deal = await seedDeal();
    await dealStore.update(deal.id, {
      stripePaymentIntentId: "pi_funded",
      stripeIssuingCardId: "ic_live",
      stripeIssuingCardStatus: "active",
    });
    return dealStore.setStatus(deal.id, "IN_ESCROW");
  }

  it("cancels the card and records it before refunding", async () => {
    const deal = await seedFundedDealWithCard();

    const res = await refundDeal(
      post("/api/vera/refund-deal", { deal_id: deal.id }, await tokenFor(deal)),
    );

    expect(res.status).toBe(200);
    expect(stripe.cancelIssuingCard).toHaveBeenCalledWith("ic_live");
    expect(stripe.refundCharge).toHaveBeenCalled();

    const after = await dealStore.get(deal.id);
    expect(after?.stripeIssuingCardStatus).toBe("canceled");
    expect(after?.status).toBe("REFUNDED");
  });

  it("blocks the refund entirely if the card will not cancel", async () => {
    const deal = await seedFundedDealWithCard();
    stripe.cancelIssuingCard.mockRejectedValueOnce(new Error("stripe down"));

    const res = await refundDeal(
      post("/api/vera/refund-deal", { deal_id: deal.id }, await tokenFor(deal)),
    );

    expect(res.status).toBe(502);
    await expect(res.json()).resolves.toMatchObject({
      error: "card_revoke_failed",
    });
    // The double payout is the thing being prevented: no refund may happen
    // while a live card is still spending Vouch's money.
    expect(stripe.refundCharge).not.toHaveBeenCalled();

    const after = await dealStore.get(deal.id);
    expect(after?.status).toBe("IN_ESCROW");
  });

  it("refunds normally when the deal never had a card", async () => {
    const deal = await seedDeal();
    await dealStore.update(deal.id, { stripePaymentIntentId: "pi_funded" });
    await dealStore.setStatus(deal.id, "IN_ESCROW");

    const res = await refundDeal(
      post("/api/vera/refund-deal", { deal_id: deal.id }, await tokenFor(deal)),
    );

    expect(res.status).toBe(200);
    expect(stripe.cancelIssuingCard).not.toHaveBeenCalled();
    expect(stripe.refundCharge).toHaveBeenCalled();
  });

  it("does not re-cancel a card that is already canceled", async () => {
    const deal = await seedFundedDealWithCard();
    await dealStore.update(deal.id, { stripeIssuingCardStatus: "canceled" });

    const res = await refundDeal(
      post("/api/vera/refund-deal", { deal_id: deal.id }, await tokenFor(deal)),
    );

    expect(res.status).toBe(200);
    expect(stripe.cancelIssuingCard).not.toHaveBeenCalled();
  });
});
