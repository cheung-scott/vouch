// Generate Sarah + Marcus demo voice clips for Beats 3, 4, 7, 10.
//
//   pnpm personas:generate
//
// Sarah lines (English):
//   - "Royal Mail tracked, by Friday."  (Beat 3, ~1.5s)
//   - "Yes."  (Beat 7, ~0.5s)
//
// Marcus lines (Polish):
//   - "Zgadzam się."  (Beat 4, ~1s; REUSED in Beat 10 dispute replay — moat moment)
//
// 5 takes of each line with slight stability variation so the user can A/B
// and pick the best. Output: public/audio/personas/{persona}-{line-id}-{take}.mp3
//
// Voice selection: queries ElevenLabs voice library, picks best matches:
//   - Sarah: female + English + young-adult-ish
//   - Marcus: male + Polish if available, else male + multilingual capable
//
// To override auto-selection:
//   SARAH_VOICE_ID=xxx MARCUS_VOICE_ID=yyy pnpm personas:generate

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

// ---- voice selection ----

async function pickVoices() {
  const sarahOverride = process.env.SARAH_VOICE_ID;
  const marcusOverride = process.env.MARCUS_VOICE_ID;

  if (sarahOverride && marcusOverride) {
    return { sarah: sarahOverride, marcus: marcusOverride };
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

  // Heuristic scoring — voices that match the persona get higher scores.
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

    // Boost multilingual-capable voices for Marcus when no Polish-native is found
    if (gender === "male" && language === "polish") {
      if (lang.includes("multilingual") || desc.includes("multilingual")) s += 3;
    }

    return s;
  };

  const sarahPick =
    voices
      .map((v) => ({
        v,
        s: score(v, { gender: "female", language: "english", ageBias: "young" }),
      }))
      .sort((a, b) => b.s - a.s)[0]?.v ?? voices[0];

  const marcusPick =
    voices
      .map((v) => ({
        v,
        s: score(v, { gender: "male", language: "polish", ageBias: "young" }),
      }))
      .sort((a, b) => b.s - a.s)[0]?.v ?? voices[0];

  console.log(`  Sarah  → ${sarahPick?.name ?? sarahPick?.voice_id} (${sarahPick?.voice_id})`);
  console.log(`  Marcus → ${marcusPick?.name ?? marcusPick?.voice_id} (${marcusPick?.voice_id})`);
  console.log("");
  console.log("  Override with SARAH_VOICE_ID + MARCUS_VOICE_ID env vars if these aren't right.");
  console.log("");

  return {
    sarah: sarahOverride ?? sarahPick.voice_id,
    marcus: marcusOverride ?? marcusPick.voice_id,
  };
}

// ---- script ----

const lines = [
  {
    persona: "sarah",
    id: "delivery",
    text: "Royal Mail tracked, by Friday.",
    description: "Beat 3 — Sarah answers Vera's Q4",
  },
  {
    persona: "sarah",
    id: "yes",
    text: "Yes.",
    description: "Beat 7 — Sarah confirms receipt",
  },
  {
    persona: "marcus",
    id: "zgadzam",
    text: "Zgadzam się.",
    description: "Beat 4 — Marcus agrees to terms (Polish). REUSED in Beat 10 dispute replay — moat moment",
  },
];

// 5 takes per line, varying stability for take-to-take prosodic difference.
// Lower stability = more expressive / variation; higher = more consistent.
const takeSettings = [
  { stability: 0.4, label: "expressive-1" },
  { stability: 0.5, label: "expressive-2" },
  { stability: 0.6, label: "balanced" },
  { stability: 0.7, label: "consistent-1" },
  { stability: 0.8, label: "consistent-2" },
];

const outDir = path.join(repoRoot, "public", "audio", "personas");
fs.mkdirSync(outDir, { recursive: true });

const voices = await pickVoices();

console.log(`Generating ${lines.length} lines × ${takeSettings.length} takes = ${lines.length * takeSettings.length} clips\n`);

for (const line of lines) {
  const voiceId = voices[line.persona];
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
}

console.log(`\nDone. Output: ${outDir}`);
console.log("\nA/B with headphones:");
for (const line of lines) {
  console.log(`  ${line.persona}-${line.id}: ${line.description}`);
  console.log(`    "${line.text}"`);
}
console.log("\nFor each line, pick the take with the most natural delivery.");
console.log("For Marcus's 'Zgadzam się' — this is the dispute moat moment.");
console.log("Pick the most decisive, confident take. It will be REUSED in Beat 10.");
