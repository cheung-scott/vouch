import { NextRequest, NextResponse } from "next/server";
import { dealStore } from "@/lib/deals";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;

  const byId = await dealStore.get(id);
  const deal = byId ?? (await dealStore.byReference(id.toUpperCase()));
  if (!deal) {
    return NextResponse.json({ error: "deal_not_found" }, { status: 404 });
  }
  return NextResponse.json({ deal });
}
