#!/usr/bin/env node
// Vera narrator A/B test — generate 3 reference clips for the P-001 decision
// (mediating vs. contract-reciting vs. narrator-mode for the demo video VO).
//
// Required env: ELEVENLABS_API_KEY, ELEVENLABS_VERA_VOICE_ID (locked via Voice Design).
// Run:          node scripts/vera-narrator-ab.mjs
// Output:       public/audio/vera-ab/{mediating,contract,narrator}.mp3
//
// Decision protocol (per OffPlanLog P-001):
// 1. Listen to all three. Same voice ID, three different settings presets.
// 2. Pick the narrator clip that best supports the kurzgesagt-style demo video VO.
// 3. If the narrator clip is recognisably Vera-but-narrator-mode → P-001 = "Vera in narrator mode" (preferred).
// 4. If the narrator clip is so different it doesn't sound like Vera → P-001 = "design a separate narrator voice."

import fs from "node:fs/promises";
import path from "node:path";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VERA_VOICE_ID;

if (!API_KEY) {
  console.error("[vera-ab] ELEVENLABS_API_KEY is not set. Aborting.");
  process.exit(1);
}
if (!VOICE_ID) {
  console.error("[vera-ab] ELEVENLABS_VERA_VOICE_ID is not set. Lock the Vera voice via Voice Design first.");
  process.exit(1);
}

const client = new ElevenLabsClient({ apiKey: API_KEY });

const PRESETS = [
  {
    id: "mediating",
    label: "Mediating (in-product, default)",
    modelId: "eleven_turbo_v2_5",
    voiceSettings: {
      stability: 0.65,
      similarityBoost: 0.75,
      style: 0.2,
      useSpeakerBoost: true,
    },
    text:
      "Hi Sarah, I'm Vera. I'll help you set this up. What are you buying or paying for? Tell me model, condition, quantity — whatever matters.",
  },
  {
    id: "contract",
    label: "Contract recitation (read-back at sign-off)",
    modelId: "eleven_turbo_v2_5",
    voiceSettings: {
      stability: 0.85,
      similarityBoost: 0.8,
      style: 0.05,
      useSpeakerBoost: true,
    },
    text:
      "Sarah is buying a white iPhone fifteen, two hundred and fifty-six gigabytes, in original condition with no scratches, from Marcus, for four hundred pounds, delivered by Royal Mail tracked by Friday.",
  },
  {
    id: "narrator",
    label: "Narrator mode (kurzgesagt-style demo video VO)",
    modelId: "eleven_multilingual_v2",
    voiceSettings: {
      stability: 0.4,
      similarityBoost: 0.85,
      style: 0.45,
      useSpeakerBoost: true,
    },
    text:
      "You should receive your money. On time. Last year, eight point two billion pounds were lost to peer-to-peer scams. Vouch is voice-recorded escrow — built on Stripe, powered by AI mediation.",
  },
];

const outDir = path.resolve("public/audio/vera-ab");
await fs.mkdir(outDir, { recursive: true });

async function run() {
  for (const preset of PRESETS) {
    process.stdout.write(`[vera-ab] generating ${preset.id} (${preset.modelId})… `);
    try {
      const audioStream = await client.textToSpeech.convert(VOICE_ID, {
        text: preset.text,
        modelId: preset.modelId,
        voiceSettings: preset.voiceSettings,
      });

      // SDK returns a ReadableStream or AsyncIterable depending on version — collect to a Buffer either way.
      const chunks = [];
      if (audioStream && typeof audioStream[Symbol.asyncIterator] === "function") {
        for await (const chunk of audioStream) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
      } else if (audioStream instanceof ArrayBuffer) {
        chunks.push(Buffer.from(audioStream));
      } else if (audioStream && typeof audioStream.arrayBuffer === "function") {
        const ab = await audioStream.arrayBuffer();
        chunks.push(Buffer.from(ab));
      } else {
        throw new Error(`unexpected SDK return shape: ${typeof audioStream}`);
      }
      const buf = Buffer.concat(chunks);

      const out = path.join(outDir, `${preset.id}.mp3`);
      await fs.writeFile(out, buf);
      console.log(`saved ${(buf.byteLength / 1024).toFixed(1)} KB → ${out}`);
    } catch (err) {
      console.error(`failed: ${err?.message ?? err}`);
    }
  }

  console.log("\nDone. Listen to the 3 clips in public/audio/vera-ab/ and pick the narrator preset for P-001.");
  console.log("\n| Preset    | Stability | Style | Use case                                    |");
  console.log("| --------- | --------- | ----- | ------------------------------------------- |");
  for (const p of PRESETS) {
    const s = p.voiceSettings;
    console.log(
      `| ${p.id.padEnd(9)} | ${String(s.stability).padEnd(9)} | ${String(s.style).padEnd(5)} | ${p.label}`,
    );
  }
}

run().catch((err) => {
  console.error("[vera-ab] fatal:", err);
  process.exit(1);
});
