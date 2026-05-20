import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * IP-based ratelimit helper (Sec-Review S-103).
 *
 * Used by /api/vera/conversation-token on the BUYER_ONBOARDING auto-create
 * path — the only public path that mutates server state without a deal_id.
 * Without this, a single attacker can flood deal creation, consume Stripe +
 * ElevenLabs quota, and OOM the dev KV store.
 *
 * Design notes:
 * - Sliding window: 5 requests per 60s per IP. Enough for a real user
 *   refreshing /new, retrying a flaky ConvAI mint, or the Chrome extension
 *   re-injecting. Hard ceiling on flood.
 * - Fail-open in local dev when env vars are missing (so `pnpm dev` works
 *   without Upstash configured). Fail-closed pattern would block every
 *   local request.
 * - Fail-open ALSO if the Upstash request itself errors — better to allow
 *   one extra request than to lock everyone out on a transient Redis blip.
 *   The downside (one bad actor squeezes through during an outage) is
 *   tiny compared to "all users locked out."
 * - In prod (Vercel with KV_REST_API_* / UPSTASH_REDIS_REST_* bound), this
 *   activates automatically.
 *
 * Returns { ok, remaining, reset } so callers can set rate-limit headers.
 */

type RatelimitResult = {
  ok: boolean;
  remaining: number;
  reset: number;
  reason?: "not_configured" | "redis_error";
};

const ALLOW: RatelimitResult = {
  ok: true,
  remaining: -1,
  reset: 0,
  reason: "not_configured",
};

// Lazy singleton — Redis.fromEnv() throws if env vars are absent, so we
// only attempt construction when env is present.
let _ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (_ratelimit) return _ratelimit;

  const hasUpstash =
    !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasVercelKV =
    !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

  if (!hasUpstash && !hasVercelKV) return null;

  // @upstash/redis prefers UPSTASH_*; if only KV_REST_API_* is set,
  // copy the values so fromEnv() picks them up.
  if (!hasUpstash && hasVercelKV) {
    process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
    process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
  }

  _ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    prefix: "vouch:buyer-onboarding-create",
    analytics: false,
  });
  return _ratelimit;
}

export async function checkBuyerOnboardingRateLimit(
  ip: string,
): Promise<RatelimitResult> {
  const rl = getRatelimit();
  if (!rl) return ALLOW;

  try {
    const { success, remaining, reset } = await rl.limit(ip);
    return { ok: success, remaining, reset };
  } catch (err) {
    // Fail-open on Redis errors — see design note above.
    console.warn("[ratelimit] redis error, failing open:", err);
    return { ok: true, remaining: -1, reset: 0, reason: "redis_error" };
  }
}

/**
 * Extract a reasonable client IP from request headers.
 * Order: Vercel forwarded-for → Cloudflare → fallback "unknown" bucket.
 * Falling back to "unknown" means every un-tagged client shares a single
 * bucket, which is conservative (penalises legitimate users behind a proxy
 * that strips IPs) but safe (an attacker can't escape ratelimit by stripping
 * headers).
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
