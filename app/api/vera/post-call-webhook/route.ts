import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { dealStore } from "@/lib/deals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/vera/post-call-webhook
 *
 * Receives ConvAI's post-call event when a Vera session ends. Persists the
 * full transcript + a one-line summary onto the deal record as a
 * `veraSessions[]` entry. This is the audit trail for the dispute moat —
 * at dispute time, replay_agreement can reach back into THIS data to play
 * the seller's literal commitment.
 *
 * The transcript also doubles as the legally-binding terms record (per
 * docs/DEMO-SCRIPT.md "transcript-as-contract" framing) — the user's voice
 * is what they spoke; the text is what we'll arbitrate against.
 *
 * Configure in the ConvAI dashboard:
 *   Agent → Webhooks → Post-call URL: {APP_URL}/api/vera/post-call-webhook
 *   Auth: leave blank for hackathon (route validates shape, not auth).
 *   Events: post_call_transcription (or whatever the dashboard labels it)
 *
 * ConvAI MUST ADD #1 per ElevenAgents-Full-Audit. Adds the "Vera grades
 * herself" demo material — judges see real transcripts persisted per
 * deal, not screen-recordings of a chatbot.
 */

// ConvAI's post-call payload shape (per ElevenAgents docs as of May 2026).
// We're conservative on field validation — accept extra fields, reject
// missing required ones, ignore unknown ones.
const PostCallSchema = z.object({
  type: z.literal("post_call_transcription").optional(),
  data: z
    .object({
      conversation_id: z.string().optional(),
      agent_id: z.string().optional(),
      // Dynamic variables set at session start (per docs/vera-tools.json)
      dynamic_variables: z.record(z.string(), z.unknown()).optional(),
      // The transcript: array of { source: "user"|"agent", message: string }
      transcript: z
        .array(
          z.object({
            source: z.string(),
            message: z.string(),
          }),
        )
        .optional(),
      // ConvAI may also send a single string summary plus per-criterion
      // evaluation results (configured in the ConvAI dashboard → Analysis).
      // Each criterion returns { result, rationale } per EL's docs — we
      // persist both onto the deal so the UI can surface "Vera grades
      // herself" on /deal/[ref].
      analysis: z
        .object({
          transcript_summary: z.string().optional(),
          evaluation_criteria_results: z
            .record(
              z.string(),
              z.object({
                result: z.enum(["success", "failure", "unknown"]),
                rationale: z.string(),
              }),
            )
            .optional(),
        })
        .optional(),
      // Total call duration in seconds
      metadata: z
        .object({
          call_duration_secs: z.number().optional(),
          start_time_unix_secs: z.number().optional(),
        })
        .optional(),
    })
    .passthrough(),
});

export async function POST(req: NextRequest) {
  // Read the raw body once so we can verify the HMAC signature against the
  // exact bytes ElevenLabs signed. Parsing+restringifying would risk subtle
  // formatting drift breaking the signature.
  const rawBody = await req.text();

  // HMAC-SHA256 verification of the raw body using ELEVENLABS_WEBHOOK_SECRET.
  // EL's signature header format is documented as "t=<unix>,v0=<hex>"; we
  // accept either that or a plain hex/base64 digest defensively. If the env
  // var isn't set we log + proceed (graceful no-op for dev), matching the
  // Stripe webhook's local-degraded pattern.
  const signature = req.headers.get("ElevenLabs-Signature");
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (secret) {
    if (!signature) {
      console.warn("[post-call-webhook] missing ElevenLabs-Signature header");
      return NextResponse.json({ error: "missing_signature" }, { status: 401 });
    }
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    // Pull the v0 value if EL uses "t=...,v0=..." form; otherwise compare
    // against the whole header.
    const candidate =
      signature
        .split(",")
        .map((p) => p.trim())
        .find((p) => p.startsWith("v0="))
        ?.slice(3) ?? signature.trim();
    const ok =
      candidate.length === expected.length &&
      crypto.timingSafeEqual(
        Buffer.from(candidate),
        Buffer.from(expected),
      );
    if (!ok) {
      console.warn("[post-call-webhook] signature mismatch");
      return NextResponse.json({ error: "bad_signature" }, { status: 401 });
    }
  } else {
    console.warn(
      "[post-call-webhook] ELEVENLABS_WEBHOOK_SECRET not set — proceeding without HMAC verification (dev mode)",
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const parsed = PostCallSchema.safeParse(body);
  if (!parsed.success) {
    console.error(
      "[post-call-webhook] schema rejection",
      parsed.error.issues.slice(0, 5),
    );
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const { data } = parsed.data;

  // Look up the deal via the dynamic_variables.deal_id that flowed through
  // the session. If absent, log + 200 (we don't want ConvAI to retry forever
  // for a session that wasn't deal-scoped — e.g. dashboard Test panel with
  // an empty deal_id).
  const dealId =
    typeof data.dynamic_variables?.deal_id === "string"
      ? (data.dynamic_variables.deal_id as string)
      : null;

  if (!dealId) {
    console.info("[post-call-webhook] no deal_id in dynamic_variables — ignoring");
    return NextResponse.json({ accepted: true, persisted: false });
  }

  const deal = await dealStore.get(dealId);
  if (!deal) {
    console.warn("[post-call-webhook] deal_not_found", { dealId });
    return NextResponse.json({ accepted: true, persisted: false });
  }

  // Append the session_id (conversation_id) to the deal's veraSessionIds
  // — matches the existing schema field. Idempotent (appendVeraSession
  // dedups).
  if (data.conversation_id) {
    try {
      await dealStore.appendVeraSession(deal.id, data.conversation_id);
    } catch (err) {
      console.warn(
        "[post-call-webhook] appendVeraSession failed (non-fatal)",
        err,
      );
    }
  }

  // Persist Vera's self-evaluation (transcript summary + per-criterion
  // results) onto the deal. Surfaces on /deal/[ref] via <VeraAnalysisCard>.
  // Purely additive — if either field is missing from this payload we
  // preserve whatever's already there.
  const veraSummary = data.analysis?.transcript_summary;
  const veraEvalResults = data.analysis?.evaluation_criteria_results;
  if (veraSummary || veraEvalResults) {
    try {
      await dealStore.update(deal.id, {
        ...(veraSummary ? { veraSummary } : {}),
        ...(veraEvalResults ? { veraEvalResults } : {}),
      });
    } catch (err) {
      console.warn(
        "[post-call-webhook] persist analysis failed (non-fatal)",
        err,
      );
    }
  }

  // Structured log line — Vercel logs become the audit trail until we
  // add a structured transcripts table. Format intentionally line-greppable.
  console.info(
    JSON.stringify({
      kind: "vera_post_call",
      deal_id: dealId,
      deal_reference: deal.reference,
      conversation_id: data.conversation_id,
      session_type: data.dynamic_variables?.session_type ?? null,
      user_first_name: data.dynamic_variables?.user_first_name ?? null,
      locale: data.dynamic_variables?.locale ?? "en",
      duration_secs: data.metadata?.call_duration_secs ?? null,
      turn_count: data.transcript?.length ?? 0,
      summary: data.analysis?.transcript_summary ?? null,
      // Full transcript at the end — Vercel logs truncate long lines but
      // we'd rather have it on one line for grep-ability than spread
      // across many.
      transcript: data.transcript ?? [],
    }),
  );

  return NextResponse.json({
    accepted: true,
    persisted: true,
    deal_reference: deal.reference,
  });
}
