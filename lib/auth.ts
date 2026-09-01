import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { tokenStore } from "@/lib/tokens";
import type { PartyRole } from "@/types/deal";

/**
 * Closes NEW-1: every `vera/*` and `escrow/*` money route ran with no
 * authentication at all, so anyone holding a deal id could drive hold,
 * release, refund and dispute by hand.
 *
 * The spec's original fix (§C.4) was a single shared secret for "the ConvAI
 * tool channel". That does not fit the real call graph — all 13 of those
 * routes are ALSO called from the browser (app/deal/…, app/new), and a
 * browser cannot hold a shared secret. So there are two accepted credentials:
 *
 *   party  — an opaque per-party token from the deal link. Browser channel.
 *   vera   — a shared secret in X-Vera-Tool-Secret. ConvAI server-to-server.
 *
 * Both are checked; either one passes. They are deliberately different
 * headers so the two channels stay distinguishable in logs, and so a party
 * token can never be mistaken for the service secret.
 */

export const VERA_SECRET_HEADER = "x-vera-tool-secret";

export type Principal =
  | { kind: "party"; partyId: string; dealId: string; role: PartyRole }
  | { kind: "vera" };

export type AuthResult =
  | { ok: true; principal: Principal }
  | { ok: false; status: 401 | 403; error: string };

export function constantTimeEquals(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  // timingSafeEqual throws on a length mismatch, so length is compared first.
  // That leaks the length of the secret, which is not a useful thing to know.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Fails closed: an unset VERA_TOOL_SECRET authenticates nobody. It must never
 * become "no secret configured, so let everyone through" — that is the shape
 * of the original OWNER_TOKEN bug (D11).
 */
function veraSecretAccepted(req: Request): boolean {
  const expected = process.env.VERA_TOOL_SECRET;
  if (!expected) return false;
  const provided = req.headers.get(VERA_SECRET_HEADER);
  if (!provided) return false;
  return constantTimeEquals(provided, expected);
}

function extractPartyToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7).trim() || null;
  // Link-based access: the token travels in the deal URL the party was sent.
  const t = new URL(req.url).searchParams.get("t");
  return t && t.length > 0 ? t : null;
}

/**
 * Authorizes a request against ONE specific deal. `dealId` is the deal the
 * handler is about to act on, taken from the already-parsed request body —
 * never from the token. A token that is valid for a different deal is a 403,
 * not a pass.
 */
export async function authorizeDealAccess(
  req: Request,
  dealId: string,
): Promise<AuthResult> {
  if (veraSecretAccepted(req)) {
    return { ok: true, principal: { kind: "vera" } };
  }

  const token = extractPartyToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "missing_credentials" };
  }

  const record = await tokenStore.verify(token);
  if (!record) {
    return { ok: false, status: 401, error: "invalid_token" };
  }
  if (record.revokedAt) {
    return { ok: false, status: 401, error: "token_revoked" };
  }
  if (new Date(record.expiresAt).getTime() <= Date.now()) {
    return { ok: false, status: 401, error: "token_expired" };
  }
  // Audience binding. Without this, any valid token would unlock every deal.
  if (record.dealId !== dealId) {
    return { ok: false, status: 403, error: "token_deal_mismatch" };
  }

  return {
    ok: true,
    principal: {
      kind: "party",
      partyId: record.partyId,
      dealId: record.dealId,
      role: record.role,
    },
  };
}

/**
 * Role gate for routes that only one side of a deal may drive.
 *
 * The token binds a caller to a DEAL; this binds them to an ACTION. Without
 * it a buyer's token passes on seller-only routes, which is how S-101
 * (seller-account hijack) worked.
 *
 * ⚠ A `vera` principal always passes. The ConvAI service secret is one shared
 * credential used for whichever party is currently in the call, so it carries
 * no role. Tightening that needs a per-conversation token bound to the party
 * Vera is speaking to — a larger change, tracked as a follow-up.
 */
export function requireRole(
  principal: Principal,
  role: PartyRole,
): NextResponse | null {
  if (principal.kind === "vera") return null;
  if (principal.role === role) return null;
  return NextResponse.json(
    { error: "wrong_party", required_role: role },
    { status: 403 },
  );
}

/** Convenience for route handlers: returns a response to return, or null. */
export async function guardDeal(
  req: Request,
  dealId: string,
): Promise<{ principal: Principal } | { response: NextResponse }> {
  const result = await authorizeDealAccess(req, dealId);
  if (result.ok) return { principal: result.principal };
  return {
    response: NextResponse.json(
      { error: result.error },
      { status: result.status },
    ),
  };
}
