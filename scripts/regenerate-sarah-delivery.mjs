// Re-render ONLY Sarah's Beat 3 delivery line with updated text.
//
// Buyer→seller flow restructure: Sarah is now the buyer asking when the
// package will arrive (not the seller stating how she'll ship it). New
// answer to Vera's Q4 is simply "By Friday." (was "Royal Mail tracked,
// by Friday.").
//
// Mirrors scripts/generate-personas.mjs exactly:
//   - same /v2/voices auto-pick heuristic for Sarah's voice
//   - same model (eleven_v3), same voice_settings template
//   - same 5 takes (expressive-1/2, balanced, consistent-1/2)
//   - overwrites public/audio/personas/sarah-delivery-{label}.mp3
//
// Other persona clips (sarah-yes-*, marcus-zgadzam-*, marcus-no-scratches-*)
// are NOT touched.
//
//   node --env-file=.env.local scripts/regenerate-sarah-delivery.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("✗ Need ELEVENLABS_API_KEY");
  process.exit(1);
}

const API = "https://api.elevenlabs.io";
const apiHeaders = {
  "xi-api-key": API_KEY,
  "content-type": "application/json",
};

// ---- voice selection (mirrors generate-personas.mjs exactly) ----

async function pickSarahVoice() {
  const sarahOverride = process.env.SARAH_VOICE_ID;
  if (sarahOverride) return sarahOverride;

  console.log("Fetching available voices...");
  const res = await fetch(`${API}/v2/voices?page_size=100`, { headers: apiHeaders });
  if (!res.ok) {
    console.error(`✗ /v2/voices ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const json = await res.json();
  const voices = json.voices ?? [];
  console.log(`  ${voices.length} voices in your library`);

  const score = (v, { gender, language, ageBias }) => {
    let s = 0;
    const labels = v.labels ?? {};
    const desc = (labels.description ?? "").toLowerCase();
    const lang = (labels.language ?? "").toLowerCase();
    const g = (labels.gender ?? "").toLowerCase();
    const age = (labels.age ?? "").toLowerCase();

    if (g === gender) s += 5;
    if (lang === language) s += 10;
    if (desc.includes(language)) s += 3;
    if (age.includes(ageBias)) s += 2;

    return s;
  };

  const sarahPick =
    voices
      .map((v) => ({
        v,
        s: score(v, { gender: "female", language: "english", ageBias: "young" }),
      }))
      .sort((a, b) => b.s - a.s)[0]?.v ?? voices[0];

  console.log(`  Sarah → ${sarahPick?.name ?? sarahPick?.voice_id} (${sarahPick?.voice_id})`);
  console.log("");
  console.log("  Override with SARAH_VOICE_ID env var if this isn't right.");
  console.log("");

  return sarahPick.voice_id;
}

// ---- script ----

const line = {
  persona: "sarah",
  id: "delivery",
  text: "By Friday.",
  description: "Beat 3 — Sarah answers Vera's Q4 (post-Option-A rewrite: arrival ETA only)",
};

const takeSettings = [
  { stability: 0.4, label: "expressive-1" },
  { stability: 0.5, label: "expressive-2" },
  { stability: 0.6, label: "balanced" },
  { stability: 0.7, label: "consistent-1" },
  { stability: 0.8, label: "consistent-2" },
];

const outDir = path.join(repoRoot, "public", "audio", "personas");
fs.mkdirSync(outDir, { recursive: true });

const voiceId = await pickSarahVoice();

console.log(`Generating 1 line × ${takeSettings.length} takes = ${takeSettings.length} clips\n`);

for (const take of takeSettings) {
  const filename = `${line.persona}-${line.id}-${take.label}.mp3`;
  const filepath = path.join(outDir, filename);

  process.stdout.write(`Generating ${filename}... `);

  const body = {
    text: line.text,
    model_id: "eleven_v3",
    voice_settings: {
      stability: take.stability,
      similarity_boost: 0.75,
      style: 0.2,
      use_speaker_boost: true,
    },
  };

  try {
    const res = await fetch(`${API}/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: { ...apiHeaders, accept: "audio/mpeg" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "<no body>");
      console.log(`✗ ${res.status}: ${err.slice(0, 200)}`);
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ ${(buffer.length / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\nDone. Output: ${outDir}`);
console.log(`\n  ${line.persona}-${line.id}: ${line.description}`);
console.log(`    "${line.text}"`);
console.log("\nA/B with headphones, then re-confirm or update docs/demo-video-script-v4.md winner pick.");
