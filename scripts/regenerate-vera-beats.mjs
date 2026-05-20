// Re-render 3 Vera lines with updated text. Same voice, same presets, same
// take structure as scripts/generate-vera-demo-clips.mjs — only these 3 beats:
//   - beat-4-polish-recital   (shortened recital)
//   - beat-8-lock-confirmation (drop "escrow" jargon)
//   - beat-10-dispute-replay   (shortened, closes on "deal")
//
// Overwrites the existing MP3s at those 3 beat names. Other 4 beats' files
// (beat-3, beat-7, beat-9, beat-12) are left untouched — user already A/B'd
// and picked those.
//
//   node --env-file=.env.local scripts/regenerate-vera-beats.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VERA_VOICE_ID;
if (!API_KEY || !VOICE_ID) {
  console.error("✗ Need ELEVENLABS_API_KEY + ELEVENLABS_VERA_VOICE_ID");
  process.exit(1);
}

// Voice presets per VERA-SYSTEM-PROMPT.md (and lib/elevenlabs.ts).
// Mediating = in-product conversational; contract = formal recitation.
const presets = {
  mediating: {
    stability: 0.65,
    similarity_boost: 0.75,
    style: 0.2,
    use_speaker_boost: true,
  },
  contract: {
    stability: 0.85,
    similarity_boost: 0.8,
    style: 0.05,
    use_speaker_boost: true,
  },
};

const lines = [
  // Re-render of Beat 3 Q4 ONLY — buyer→seller flow restructure reworded
  // the question from "When and how is it being delivered?" to
  // "When do you expect it to arrive by?" (Sarah is now buyer asking
  // Marcus the seller for an arrival ETA).
  {
    beat: "beat-3-q4",
    preset: "mediating",
    text: "When do you expect it to arrive by?",
    description: "Beat 3: Vera asks Sarah Q4 (expected arrival, post-Option-A rewrite)",
    duration: "~1.5s",
  },
];

const outDir = path.join(repoRoot, "public", "audio", "demo-vera");
fs.mkdirSync(outDir, { recursive: true });

console.log(`Voice: ${VOICE_ID} (Vera)`);
console.log(`Output: ${outDir}`);
console.log(`Lines: ${lines.length} × 3 takes each = ${lines.length * 3} clips\n`);

// 3 takes per line — same preset, varied stability slightly for prosody
// variety. User picks best take.
const takeOffsets = [-0.1, 0, +0.05];

for (const line of lines) {
  const preset = presets[line.preset];
  for (let i = 0; i < takeOffsets.length; i++) {
    const offset = takeOffsets[i];
    const takeLabel = i === 0 ? "loose" : i === 1 ? "default" : "tight";
    const filename = `${line.beat}-${takeLabel}.mp3`;
    const filepath = path.join(outDir, filename);

    process.stdout.write(`Generating ${filename} (${line.preset}, stab ${(preset.stability + offset).toFixed(2)})... `);

    const body = {
      text: line.text,
      model_id: "eleven_v3",
      voice_settings: {
        ...preset,
        stability: Math.max(0, Math.min(1, preset.stability + offset)),
      },
    };

    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": API_KEY,
            "content-type": "application/json",
            accept: "audio/mpeg",
          },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const err = await res.text().catch(() => "<no body>");
        console.log(`✗ ${res.status}: ${err.slice(0, 200)}`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filepath, buf);
      console.log(`✓ ${(buf.length / 1024).toFixed(1)} KB`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
    }
  }
}

console.log(`\nDone. Listen with headphones at ${outDir}\n`);
console.log("Per-beat picks (drop chosen take into vouch-demo-remotion/public/audio/vera/):");
for (const line of lines) {
  console.log(`  ${line.beat} (${line.duration}) — ${line.description}`);
}
