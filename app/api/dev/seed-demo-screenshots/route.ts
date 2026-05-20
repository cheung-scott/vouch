import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Dev-only: stages 4 demo deals in different terminal states so the user
 * can screenshot the /how-it-works and demo-video assets without playing
 * through the buyer → seller → onboard → signoff flow end-to-end.
 *
 * All 4 deals share the same realistic dataset (Sarah → Marcus, iPhone 15
 * Pro Max 512GB Blue Titanium, £609.89, by Friday) so screenshots feel
 * like the same person at different points in the flow.
 *
 * OWNER_TOKEN gated. Returns the 4 deal references + ready-to-visit URLs.
 */
export async function POST(req: NextRequest) {
  const ownerToken = process.env.OWNER_TOKEN;
  if (!ownerToken) {
    return NextResponse.json({ error: "endpoint_disabled" }, { status: 403 });
  }
  const provided = req.headers.get("x-owner-token");
  if (provided !== ownerToken) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const now = Date.now();
  const isoMinus = (minutes: number) =>
    new Date(now - minutes * 60_000).toISOString();

  // Use a real-looking Stripe Connect account ID so the SellerRepBadge +
  // signoff page render their "seller onboarded" branches without needing
  // a real Stripe roundtrip. If you've already run /api/dev/seed-rep
  // against acct_1TZBbOHhBPM3x8ag, the rep badge will show Marcus's
  // populated history. Otherwise it falls back to "new to Vouch".
  const sellerStripeAccountId = "acct_1TZBbOHhBPM3x8ag";

  // Factory: builds parties + terms shared across the 4 deals. Each call
  // creates fresh party UUIDs so the deals are truly independent records.
  function buildBaseDeal() {
    return {
      buyer: {
        id: randomUUID(),
        role: "BUYER" as const,
        firstName: "Sarah",
        email: "sarah@example.com",
        identityVerified: true,
      },
      seller: {
        id: randomUUID(),
        role: "SELLER" as const,
        firstName: "Marcus",
        email: "marcus@example.com",
        identityVerified: true,
        stripeAccountId: sellerStripeAccountId,
      },
      terms: {
        item: "Apple iPhone 15 Pro Max — 512GB — Blue Titanium (Unlocked)",
        quantity: 1,
        amountMinor: 60989, // £609.89
        currency: "GBP" as const,
        deliveryMethod: "Royal Mail Special Delivery",
        notes: "deadline: by Friday 22 May",
      },
    };
  }

  // 1. DRAFT — buyer just hit /new, mid-capture. NOT used for screenshots
  //    (the /new page itself is captured via ?source=ebay prefill URL), but
  //    handy if you want a deal in this state for any other purpose.
  //    Skipping creation keeps the response tight.

  // 2a. AWAITING_SELLER — buyer has captured + committed, seller hasn't
  //     agreed yet. Used for `seller-02-intake.png` (visit /deal/[ref]/seller
  //     as Marcus). KEEPS the pre-attached stripeAccountId so the page's
  //     post-commit branching renders predictably if the screenshotter
  //     accidentally advances the deal.
  const awaitingSeller = await dealStore.create(buildBaseDeal());
  await dealStore.update(awaitingSeller.id, {
    status: "AWAITING_SELLER",
    buyer: { ...awaitingSeller.buyer, committedAt: isoMinus(30) },
  });

  // 2b. AWAITING_SELLER (fresh, no stripeAccountId) — dedicated to the
  //     `seller-03-onboard.png` shot. The onboarding API (S-101) rejects
  //     deals whose seller already has a stripeAccountId bound — so we
  //     need a clean deal whose seller has no acct yet AND whose status
  //     is still in the eligibility window. Splitting this from deal 2a
  //     prevents "screenshot the intake, advance the deal, onboard 409s"
  //     ordering problems.
  const onboardingFresh = await dealStore.create({
    ...buildBaseDeal(),
    seller: {
      ...buildBaseDeal().seller,
      stripeAccountId: undefined, // critical — let create-account mint a real acct
    },
  });
  await dealStore.update(onboardingFresh.id, {
    status: "AWAITING_SELLER",
    buyer: { ...onboardingFresh.buyer, committedAt: isoMinus(30) },
  });

  // 3. AGREED — both parties committed, ready for joint sign-off. Used for
  //    `buyer-03-signoff.png` (visit /deal/[ref]/signoff in `ready` stage).
  const agreed = await dealStore.create(buildBaseDeal());
  await dealStore.update(agreed.id, {
    status: "AGREED",
    buyer: { ...agreed.buyer, committedAt: isoMinus(60) },
    seller: { ...agreed.seller, committedAt: isoMinus(45) },
  });

  // 4. IN_ESCROW — money locked, awaiting receipt confirmation. Used for
  //    `seller-04-signoff.png` (visit /deal/[ref]/signoff to capture the
  //    green IN_ESCROW card with "Tap to release"). Stripe PI ID is mock
  //    — the page doesn't gate on it being real.
  const inEscrow = await dealStore.create(buildBaseDeal());
  await dealStore.update(inEscrow.id, {
    status: "IN_ESCROW",
    buyer: { ...inEscrow.buyer, committedAt: isoMinus(90) },
    seller: { ...inEscrow.seller, committedAt: isoMinus(80) },
    lockedAt: isoMinus(60),
    stripePaymentIntentId: `pi_demo_${randomUUID().slice(0, 12)}`,
  });

  // 5. RELEASED — money released to seller. Useful for the deal detail
  //    page screenshot showing the full timeline filled in.
  const released = await dealStore.create(buildBaseDeal());
  await dealStore.update(released.id, {
    status: "RELEASED",
    buyer: { ...released.buyer, committedAt: isoMinus(180) },
    seller: { ...released.seller, committedAt: isoMinus(170) },
    lockedAt: isoMinus(150),
    releasedAt: isoMinus(10),
    stripePaymentIntentId: `pi_demo_${randomUUID().slice(0, 12)}`,
    stripeTransferId: `tr_demo_${randomUUID().slice(0, 12)}`,
  });

  // Compose ready-to-visit URLs. `origin` reads from the request so this
  // works both locally (http://localhost:3000) and on vouch.fund.
  const origin = req.nextUrl.origin;
  const screenshots = [
    {
      shot: "seller-02-intake.png",
      description: "Seller intake — Marcus's view after entering his name + clicking Continue. Then capture the Vera CTA.",
      url: `${origin}/deal/${awaitingSeller.reference}/seller`,
      manual_steps: "Type 'Marcus' in the name field → click Continue → screenshot.",
    },
    {
      shot: "buyer-03-signoff.png",
      description: "Joint sign-off page in ready stage — Sarah/Marcus heading, speaker picker, Vera CTA visible.",
      url: `${origin}/deal/${agreed.reference}/signoff`,
      manual_steps: "Just visit and screenshot. Don't tap Vera.",
    },
    {
      shot: "seller-04-signoff.png",
      description: "Joint sign-off in IN_ESCROW stage — green 'money is held' card with £609.89.",
      url: `${origin}/deal/${inEscrow.reference}/signoff`,
      manual_steps: "Just visit and screenshot.",
    },
    {
      shot: "(bonus) deal-detail-released.png",
      description: "Full deal detail page in RELEASED state — all timeline events filled in, Vera analysis card if present.",
      url: `${origin}/deal/${released.reference}`,
      manual_steps: "Useful for landing-page / Devpost stills, not required by /how-it-works.",
    },
    {
      shot: "buyer-02-new.png",
      description: "/new page in QUESTIONS stage at Q4 — prefilled from extension.",
      url: `${origin}/new?source=ebay&item=Apple+iPhone+15+Pro+Max+512GB+Blue+Titanium&seller=Marcus&price=609.89&currency=GBP`,
      manual_steps: "Visit URL → type 'Sarah' in the name field → click Start with Vera → screenshot the Q4 page that lands.",
    },
    {
      shot: "seller-03-onboard.png",
      description: "/onboard page with embedded Stripe Connect iframe loaded.",
      url: `${origin}/onboard?deal_id=${onboardingFresh.id}`,
      manual_steps: "Visit URL → enter email → click 'Start Stripe Connect Express onboarding' → wait ~3s for iframe → screenshot. Uses a DEDICATED fresh deal so it works even if you advanced the seller-02 deal.",
    },
  ];

  return NextResponse.json({
    success: true,
    seeded: {
      awaiting_seller: awaitingSeller.reference,
      onboarding_fresh: onboardingFresh.reference,
      agreed: agreed.reference,
      in_escrow: inEscrow.reference,
      released: released.reference,
    },
    screenshots,
  });
}
