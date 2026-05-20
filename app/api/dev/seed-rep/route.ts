import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  account_id: z.string().startsWith("acct_"),
  seller_first_name: z.string().min(1).max(80).default("Marcus"),
  completed_count: z.number().int().min(0).max(200).default(47),
  refunded_count: z.number().int().min(0).max(50).default(1),
});

// Sample items + amounts so the seeded history looks plausible for the
// demo (a marketplace seller of consumer electronics + collectibles).
const SAMPLE_ITEMS = [
  "Apple AirPods Pro 2nd gen",
  "Nintendo Switch OLED, console + dock",
  "Sony WH-1000XM5 headphones",
  "PlayStation 5 disc edition + 2 controllers",
  "Kindle Paperwhite 2024, 16GB",
  "Logitech MX Master 3S",
  "iPad Air 11-inch (M2), 256GB",
  "Apple Watch Series 9 GPS 45mm",
  "GoPro Hero 12 Black, like new",
  "Garmin Forerunner 265 watch",
  "Bose QuietComfort Ultra earbuds",
  "Dyson V11 cordless vacuum",
  "Steam Deck 256GB OLED",
  "Canon EOS R6 Mark II body",
  "Tag Heuer Aquaracer 43mm",
];

const SAMPLE_BUYERS = [
  "Alex",
  "Priya",
  "Tom",
  "Sarah",
  "James",
  "Mei",
  "Luca",
  "Naomi",
  "Ben",
  "Chloe",
  "Raj",
  "Olivia",
  "Ethan",
  "Zara",
  "Daniel",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function fakeAmountMinor(seed: number): number {
  // Distribute amounts £40-£600 in a vaguely lognormal-feeling way
  const buckets = [4500, 5200, 7900, 9900, 12000, 14999, 18000, 22500, 27000, 34500, 39900, 45000, 52000, 59000];
  return buckets[seed % buckets.length];
}

/**
 * Dev-only: seeds synthetic completed deal history against a seller's
 * Stripe Connect account ID. Used to pre-populate the demo recording
 * with a realistic-looking "completed deals" count for the rep badge.
 *
 * OWNER_TOKEN gated.
 */
export async function POST(req: NextRequest) {
  const ownerToken = process.env.OWNER_TOKEN;
  if (!ownerToken) {
    return NextResponse.json(
      { error: "endpoint_disabled" },
      { status: 403 },
    );
  }
  const provided = req.headers.get("x-owner-token");
  if (provided !== ownerToken) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { account_id, seller_first_name, completed_count, refunded_count } =
    parsed.data;

  const now = Date.now();
  const created: string[] = [];

  // Helper: create a single synthetic deal with the given final status.
  // Timestamps are backdated to span the past ~6 months so the history
  // doesn't look like it was all generated at once.
  async function seedOne(i: number, finalStatus: "RELEASED" | "REFUNDED") {
    const item = pick(SAMPLE_ITEMS, i);
    const buyerName = pick(SAMPLE_BUYERS, i + 7);
    const amountMinor = fakeAmountMinor(i);
    // Distribute over ~180 days, oldest first
    const daysAgo = Math.floor(((i + 1) / (completed_count + refunded_count)) * 180);
    const ts = (offsetDays: number) =>
      new Date(now - (daysAgo + offsetDays) * 86400_000).toISOString();

    const deal = await dealStore.create({
      buyer: {
        id: randomUUID(),
        role: "BUYER",
        firstName: buyerName,
        identityVerified: true,
      },
      seller: {
        id: randomUUID(),
        role: "SELLER",
        firstName: seller_first_name,
        identityVerified: true,
        stripeAccountId: account_id,
      },
      terms: {
        item,
        quantity: 1,
        amountMinor,
        currency: "GBP",
      },
    });

    // Walk the deal forward through its lifecycle via dealStore.update
    // so timestamps + status terminate where we want.
    await dealStore.update(deal.id, {
      status: finalStatus,
      buyer: {
        ...deal.buyer,
        committedAt: ts(-2),
      },
      seller: {
        ...deal.seller,
        committedAt: ts(-1),
      },
      lockedAt: ts(0),
      releasedAt: finalStatus === "RELEASED" ? ts(2) : undefined,
    });
    created.push(deal.id);
  }

  for (let i = 0; i < completed_count; i++) {
    await seedOne(i, "RELEASED");
  }
  for (let i = 0; i < refunded_count; i++) {
    await seedOne(completed_count + i, "REFUNDED");
  }

  return NextResponse.json({
    success: true,
    account_id,
    seller_first_name,
    seeded: {
      completed: completed_count,
      refunded: refunded_count,
      total: completed_count + refunded_count,
    },
    deal_ids_sample: created.slice(0, 3),
  });
}
