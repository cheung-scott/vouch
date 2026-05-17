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

export async function createVeraConvAISession(params: {
  sessionType:
    | "BUYER_ONBOARDING"
    | "SELLER_ONBOARDING"
    | "JOINT_SIGNOFF"
    | "VOICE_RECEIPT"
    | "DISPUTE";
  userFirstName: string;
  dealId?: string;
  counterpartyName?: string;
  amountSpoken?: string;
}) {
  if (!VERA_AGENT_ID) {
    throw new Error("ELEVENLABS_VERA_AGENT_ID is not configured");
  }
  return {
    agent_id: VERA_AGENT_ID,
    dynamic_variables: {
      session_type: params.sessionType,
      user_first_name: params.userFirstName,
      deal_id: params.dealId ?? "",
      counterparty_name: params.counterpartyName ?? "",
      amount_spoken: params.amountSpoken ?? "",
    },
  };
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
