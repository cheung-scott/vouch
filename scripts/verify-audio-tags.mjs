// Empirically verify whether v3 interprets our custom audio tags
// (`[warmly]` etc.) as prosody directives OR reads them literally.
//
//   pnpm tags:verify
//
// Generates 4 clips of "Hi Sarah, I'm Vera — your mediator for this deal":
//   1. baseline (no tag)
//   2. [warmly] prefix      (one of our custom tags)
//   3. [sighs] prefix       (canonical v3 tag, per audit — should produce a sigh)
//   4. [nonsense_tag_xyz]   (definitely-fake tag — confirms literal-reading if heard)
//
// Listen test:
//   - If clip 4 says "nonsense tag xyz" out loud → v3 reads unknown tags
//     literally. STRIP our custom tags from the prompt immediately.
//   - If clip 4 is silent on the tag but clip 3 has a sigh → v3 reads
//     canonical tags only; custom tags are silently dropped (best case).
//   - If clip 2 sounds warmer than clip 1 but clip 4 is silent on the
//     nonsense tag → v3 may interpret all tags somehow. Less clear path.

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

const baseText = "Hi Sarah, I'm Vera — your mediator for this deal.";
const samples = [
  { id: "0-baseline", text: baseText },
  { id: "1-warmly", text: `[warmly] ${baseText}` },
  { id: "2-sighs-canonical", text: `[sighs] ${baseText}` },
  { id: "3-nonsense", text: `[nonsense_tag_xyz] ${baseText}` },
];

const outDir = path.join(repoRoot, "public", "audio", "tag-verify");
fs.mkdirSync(outDir, { recursive: true });

console.log(`Testing audio tag interpretation on v3 with voice ${VOICE_ID}\n`);

for (const sample of samples) {
  const filename = `tag-${sample.id}.mp3`;
  const filepath = path.join(outDir, filename);
  process.stdout.write(`Generating ${filename}... `);

  const body = {
    text: sample.text,
    model_id: "eleven_v3",
    voice_settings: {
      // Keep all settings identical across samples so prosody differences
      // must come from the tag, not from stability variation.
      stability: 0.65,
      similarity_boost: 0.75,
      style: 0.2,
      use_speaker_boost: true,
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

console.log(`\nDone. Output: ${outDir}`);
console.log("\nLISTEN ORDER + WHAT TO CHECK:");
console.log("  tag-0-baseline.mp3     — reference (no tag)");
console.log("  tag-1-warmly.mp3       — does it sound warmer than baseline?");
console.log("                            does Vera say \"warmly\" out loud?");
console.log("  tag-2-sighs-canonical  — is there an audible sigh at the start?");
console.log("  tag-3-nonsense.mp3     — does Vera say \"nonsense tag xyz\" out loud?");
console.log("");
console.log("VERDICTS:");
console.log("  Nonsense tag spoken literally → STRIP all custom tags from prompt.");
console.log("  Sigh audible AND warmly sounds same as baseline → canonical-only.");
console.log("  Warmly sounds different + nonsense silent → tags may have some effect via dashboard descriptions.");
