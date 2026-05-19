// Generate demo SFX (v3) via ElevenLabs Sound Generation API.
//
//   pnpm dlx node scripts/generate-demo-sfx-v3.mjs
//
// Re-rolls lock-thunk and release-bell with clean, bold, satisfying premium
// fintech app UI vibe (iOS/macOS designed-UI). v1 was too lifelike, v2 was too
// harsh/cartoony. v3 targets polished SaaS confirmation tones.
//
// Output: public/audio/sfx/{name}-v3-take{N}.mp3
// Generates 5 takes per clip; A/B in headphones then point timing config at
// the chosen take.

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

const clips = [
  {
    name: "lock-thunk-v3",
    duration_seconds: 0.5,
    text: "clean designed UI lock thud, premium fintech app interaction sound, satisfying soft tactile click, modern minimal not mechanical, like a sleek macOS confirmation",
    description: "Beat 5 — escrow lock confirmation (premium fintech UI vibe)",
  },
  {
    name: "release-bell-v3",
    duration_seconds: 0.5,
    text: "clean designed UI success chime, premium SaaS confirmation tone, satisfying bright but soft, modern minimal two-note ping, like a polished iOS success notification",
    description: "Beat 8 — funds released (polished iOS success vibe)",
  },
];

const TAKES = 5;

const outDir = path.join(repoRoot, "public", "audio", "sfx");
fs.mkdirSync(outDir, { recursive: true });

console.log(`Output: ${outDir}`);
console.log(`Clips: ${clips.length} × ${TAKES} takes = ${clips.length * TAKES} files\n`);

let saved = 0;
let failed = 0;

for (const clip of clips) {
  for (let take = 1; take <= TAKES; take++) {
    const filename = `${clip.name}-take${take}.mp3`;
    const filepath = path.join(outDir, filename);
    process.stdout.write(`Generating ${filename}... `);

    const body = {
      text: clip.text,
      duration_seconds: clip.duration_seconds,
    };

    try {
      const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "content-type": "application/json",
          accept: "audio/mpeg",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "<no body>");
        console.log(`✗ ${res.status}: ${err.slice(0, 200)}`);
        failed++;
        if (res.status >= 400 && res.status < 600 && (res.status === 401 || res.status === 403)) {
          console.error("Auth error — aborting.");
          process.exit(1);
        }
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filepath, buf);
      console.log(`✓ ${(buf.length / 1024).toFixed(1)} KB`);
      saved++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }
}

console.log(`\nDone. Saved ${saved}/${clips.length * TAKES} clips to ${outDir}`);
if (failed > 0) console.log(`Failed: ${failed}`);
console.log("\nA/B in headphones, pick best take per clip, wire chosen path into the demo timing config.");
for (const clip of clips) {
  console.log(`  ${clip.name} — ${clip.description}`);
}
