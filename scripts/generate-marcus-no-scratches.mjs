// Generate Marcus "no scratches" diegetic voice clip for Beat 10 dispute replay.
//
//   node --env-file=.env.local scripts/generate-marcus-no-scratches.mjs
//
// Beat 10 = moat moment of Act 2. Vera replays Marcus's original commitment
// ("no scratches, original box.") as legal evidence in the dispute. This is
// diegetic — IS Marcus's voice from the original seller-agreement.
//
// MUST use the SAME voice as marcus-zgadzam-*.mp3 (Beat 4) since both are
// the same person speaking. If MARCUS_VOICE_ID env override is set we use it;
// otherwise we re-run the same auto-selection logic as generate-personas.mjs
// (deterministic since voice library ordering is stable).
//
// 5 takes with same stability variation as personas script. Output:
//   public/audio/personas/marcus-no-scratches-{balanced,consistent-1,consistent-2,expressive-1,expressive-2}.mp3

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

async function pickMarcusVoice() {
  const marcusOverride = process.env.MARCUS_VOICE_ID;
  if (marcusOverride) {
    console.log(`Using MARCUS_VOICE_ID override: ${marcusOverride}`);
    return { voiceId: marcusOverride, source: "override" };
  }

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

    if (gender === "male" && language === "polish") {
      if (lang.includes("multilingual") || desc.includes("multilingual")) s += 3;
    }

    return s;
  };

  const marcusPick =
    voices
      .map((v) => ({
        v,
        s: score(v, { gender: "male", language: "polish", ageBias: "young" }),
      }))
      .sort((a, b) => b.s - a.s)[0]?.v ?? voices[0];

  console.log(`  Marcus → ${marcusPick?.name ?? marcusPick?.voice_id} (${marcusPick?.voice_id})`);
  return { voiceId: marcusPick.voice_id, source: "auto-pick" };
}

// ---- script ----

const line = {
  persona: "marcus",
  id: "no-scratches",
  // English with Polish accent — Marcus speaks English here as he did during
  // the seller agreement at Beat 4 (the agreement itself was in English; the
  // "Zgadzam się" was his affirmative response).
  text: "No scratches, original box.",
  description: "Beat 10 — Marcus's original commitment replayed as dispute evidence",
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

const { voiceId, source } = await pickMarcusVoice();
console.log(`\nUsing Marcus voice ${voiceId} (${source})\n`);
console.log(`Generating ${takeSettings.length} takes of "${line.text}"\n`);

let successes = 0;
let failures = 0;

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
      failures++;
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ ${(buffer.length / 1024).toFixed(1)} KB`);
    successes++;
  } catch (err) {
    console.log(`✗ ${err.message}`);
    failures++;
  }
}

console.log(`\nDone. ${successes} succeeded, ${failures} failed.`);
console.log(`Output: ${outDir}`);
console.log(`\nVoice ID used: ${voiceId} (${source})`);
console.log(`Verify this matches the voice used for marcus-zgadzam-*.mp3 — they must be the same person.`);
