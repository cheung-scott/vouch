import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.warn(
    "[elevenlabs] ELEVENLABS_API_KEY not set — voice/ConvAI calls will fail until configured.",
  );
}

export const elevenlabs = new ElevenLabsClient({
  apiKey: apiKey ?? "placeholder",
});

// ElevenLabs SDK v2 expects camelCase voice setting keys (similarityBoost,
// useSpeakerBoost). Earlier versions of these constants used snake_case which
// the SDK silently dropped — flagged in OffPlanLog A-008. Fixed here so all
// downstream TTS calls actually honour the intended settings.
//
// Preset values aligned with docs/demo-video-script-v3.md and OffPlanLog P-004:
//   - mediating: in-product ConvAI default voice
//   - contract:  formal recitation moments (read_contract_back / read_buyer_terms / replay_agreement)

export const VERA_VOICE_SETTINGS = {
  stability: 0.65,
  similarityBoost: 0.75,
  style: 0.2,
  useSpeakerBoost: true,
} as const;

export const VERA_CONTRACT_VOICE_SETTINGS = {
  stability: 0.85,
  similarityBoost: 0.8,
  style: 0.05,
  useSpeakerBoost: true,
} as const;

export const VERA_MODEL_DEFAULT = "eleven_turbo_v2_5";
export const VERA_MODEL_MULTILINGUAL = "eleven_v3";

export const VERA_AGENT_ID = process.env.ELEVENLABS_VERA_AGENT_ID ?? "";
export const VERA_VOICE_ID = process.env.ELEVENLABS_VERA_VOICE_ID ?? "";

export async function synthesizeVeraLine(params: {
  text: string;
  multilingual?: boolean;
  contractVoice?: boolean;
}) {
  if (!VERA_VOICE_ID) {
    throw new Error("ELEVENLABS_VERA_VOICE_ID is not configured");
  }
  return elevenlabs.textToSpeech.convert(VERA_VOICE_ID, {
    text: params.text,
    modelId: params.multilingual ? VERA_MODEL_MULTILINGUAL : VERA_MODEL_DEFAULT,
    voiceSettings: params.contractVoice
      ? VERA_CONTRACT_VOICE_SETTINGS
      : VERA_VOICE_SETTINGS,
  });
}

export async function transcribeAudio(params: {
  file: Blob | File | ArrayBuffer | Uint8Array;
  languageCode?: string;
}) {
  return elevenlabs.speechToText.convert({
    file: params.file as Blob,
    modelId: "scribe_v1",
    languageCode: params.languageCode,
  });
}

export type VeraSessionType =
  | "BUYER_ONBOARDING"
  | "SELLER_ONBOARDING"
  | "JOINT_SIGNOFF"
  | "VOICE_RECEIPT"
  | "DISPUTE";

export type VeraDynamicVariables = {
  session_type: VeraSessionType;
  user_first_name: string;
  deal_id: string;
  counterparty_name: string;
  amount_spoken: string;
  locale: string;
};

export function buildVeraDynamicVariables(params: {
  sessionType: VeraSessionType;
  userFirstName: string;
  dealId?: string;
  counterpartyName?: string;
  amountSpoken?: string;
  locale?: string;
}): VeraDynamicVariables {
  return {
    session_type: params.sessionType,
    user_first_name: params.userFirstName,
    deal_id: params.dealId ?? "",
    counterparty_name: params.counterpartyName ?? "",
    amount_spoken: params.amountSpoken ?? "",
    locale: params.locale ?? "en",
  };
}

export async function createVeraConvAISession(params: {
  sessionType: VeraSessionType;
  userFirstName: string;
  dealId?: string;
  counterpartyName?: string;
  amountSpoken?: string;
  locale?: string;
}) {
  if (!VERA_AGENT_ID) {
    throw new Error("ELEVENLABS_VERA_AGENT_ID is not configured");
  }
  return {
    agent_id: VERA_AGENT_ID,
    dynamic_variables: buildVeraDynamicVariables(params),
  };
}

// WebRTC conversation token for private ConvAI agents.
// Server-side only — never expose the agent ID or API key to the client.
// Token TTL is short (≈15 min); fetch fresh per session start.
// Endpoint per https://elevenlabs.io/docs/conversational-ai/customization/authentication
export async function getVeraConversationToken(): Promise<string> {
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");
  if (!VERA_AGENT_ID) throw new Error("ELEVENLABS_VERA_AGENT_ID is not configured");

  const url = new URL(
    "https://api.elevenlabs.io/v1/convai/conversation/token",
  );
  url.searchParams.set("agent_id", VERA_AGENT_ID);
  const res = await fetch(url, {
    method: "GET",
    headers: { "xi-api-key": apiKey, accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    // Don't proxy raw API error text to clients (S-007 / S-009 pattern).
    // Log full detail server-side; throw a sanitised error.
    const detail = await res.text().catch(() => "<no body>");
    console.error(
      "[elevenlabs] conversation-token fetch failed",
      res.status,
      detail,
    );
    throw new Error(`convai_token_failed_${res.status}`);
  }
  const json = (await res.json()) as { token?: string };
  if (!json.token) throw new Error("convai_token_missing");
  return json.token;
}

export async function designVoice(params: {
  description: string;
  text?: string;
  autoGenerateText?: boolean;
}) {
  return elevenlabs.textToVoice.design({
    voiceDescription: params.description,
    text: params.text,
    autoGenerateText: params.autoGenerateText ?? !params.text,
  });
}
