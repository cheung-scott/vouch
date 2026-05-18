// Pre-render Vera's spoken lines for the demo video.
//
//   pnpm vera:demo
//
// The demo video uses pre-rendered TTS (NOT real-time ConvAI) per
// docs/demo-video-script-v3.md so each line is rendered cleanly with the
// right voice preset (mediating vs contract) and tagged with the
// appropriate audio tag for Eleven v3 expressive delivery.
//
// Output: public/audio/demo-vera/{beat-id}-{preset}-{take}.mp3
// Listen to all takes per line, pick best, drop the chosen ones into
// vouch-demo-remotion/public/audio/vera/.

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

// Demo lines per docs/demo-video-script-v3.md beat-by-beat. Audio tags
// inserted at the right moments per VERA-SYSTEM-PROMPT.md § Audio tags.
const lines = [
  {
    beat: "beat-3-q4",
    preset: "mediating",
    text: "When and how is it being delivered?",
    description: "Beat 3: Vera asks Sarah Q4 in-product",
    duration: "~1.5s",
  },
  {
    beat: "beat-4-polish-recital",
    preset: "contract",
    // Use eleven_v3 because Polish — contract preset for the formal recitation.
    text: "[confidently] Sarah przygotowała ofertę. Pozwól mi przeczytać warunki: jeden iPhone piętnaście, dwieście pięćdziesiąt sześć gigabajtów, w oryginalnym opakowaniu, bez zarysowań, za czterysta funtów, dostarczony Royal Mail Tracked, do piątku.",
    description: "Beat 4: Vera reads buyer's terms to Marcus in Polish",
    duration: "~6s",
  },
  {
    beat: "beat-7-receipt-ask",
    preset: "mediating",
    text: "It's arrived. Does it match?",
    description: "Beat 7: Vera asks Sarah to confirm receipt",
    duration: "~1.5s",
  },
  {
    beat: "beat-8-lock-confirmation",
    preset: "mediating",
    text: "[confidently] Four hundred pounds is now locked in escrow with Stripe.",
    description: "Beat 8: Vera confirms escrow locked after both agree",
    duration: "~3s",
  },
  {
    beat: "beat-9-release-confirmation",
    preset: "mediating",
    text: "[confidently] Four hundred pounds is being released to Marcus right now. [warmly] Thanks for using Vouch.",
    description: "Beat 9: Vera confirms release after voice receipt",
    duration: "~4s",
  },
  {
    beat: "beat-10-dispute-replay",
    preset: "contract",
    text: '[confidently] Let me play back what we originally agreed. Marcus said: "iPhone 15, 256 gigs, white, unlocked, no scratches, in original box." Compared to that, what specifically is different?',
    description: "Beat 10: Vera replays the original agreement during dispute",
    duration: "~7s",
  },
  {
    beat: "beat-12-verdict",
    preset: "contract",
    text: "[seriously] Ruling: refund to Sarah. Marcus's account flagged for review.",
    description: "Beat 12: Vera's dispute verdict",
    duration: "~3s",
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
console.log("\nFor Beat 4 Polish recital — listen most carefully. Long passage = accent drift risk.");
console.log("If Polish sounds unconvincing, the demo's Beat 4 dispute-moat moment leans on Marcus's human-voice 'Zgadzam się' (already generated in public/audio/personas/), so Vera reading the recital can stay British-accented Polish.");
