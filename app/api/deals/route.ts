import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { dealStore } from "@/lib/deals";
import {
  CurrencySchema,
  type DealStatus,
  type Party,
} from "@/types/deal";

const CreateDealSchema = z.object({
  buyer: z.object({
    firstName: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  counterparty: z
    .object({
      firstName: z.string().min(1).optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  initialTerms: z
    .object({
      item: z.string().optional(),
      currency: CurrencySchema.optional(),
      amountMinor: z.number().int().positive().optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = CreateDealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const buyer: Party = {
    id: randomUUID(),
    role: "BUYER",
    firstName: parsed.data.buyer.firstName,
    email: parsed.data.buyer.email,
    phone: parsed.data.buyer.phone,
    identityVerified: false,
  };
  const seller: Party = {
    id: randomUUID(),
    role: "SELLER",
    firstName: parsed.data.counterparty?.firstName ?? "the other party",
    email: parsed.data.counterparty?.email,
    phone: parsed.data.counterparty?.phone,
    identityVerified: false,
  };

  const deal = await dealStore.create({
    buyer,
    seller,
    terms: {
      item: parsed.data.initialTerms?.item ?? "",
      quantity: 1,
      amountMinor: parsed.data.initialTerms?.amountMinor ?? 0,
      currency: parsed.data.initialTerms?.currency ?? "GBP",
    },
  });

  return NextResponse.json({
    id: deal.id,
    reference: deal.reference,
    status: deal.status,
    seller_invitation_url: `/deal/${deal.reference}/seller`,
    signoff_url: `/deal/${deal.reference}/signoff`,
    detail_url: `/deal/${deal.reference}`,
  });
}

export async function GET(req: NextRequest) {
  const statusParam = req.nextUrl.searchParams.get("status");
  const list = await dealStore.list(
    statusParam ? { status: statusParam as DealStatus } : undefined,
  );
  return NextResponse.json({
    deals: list.map((d) => ({
      id: d.id,
      reference: d.reference,
      status: d.status,
      amount: d.terms.amountMinor,
      currency: d.terms.currency,
      item: d.terms.item,
      buyerName: d.buyer.firstName,
      sellerName: d.seller.firstName,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    })),
  });
}
