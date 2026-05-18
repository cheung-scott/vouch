// Compare TTS quality across French + Polish on Vera's locked voice.
//
//   pnpm tts:compare:fr
//
// Tests three things at once:
//   1. v3 French — re-run with audio tags properly in text (user noted last
//      run may not have applied them)
//   2. v3 Polish — new test (Polish IS the demo language; Beat 4 moat moment)
//   3. Flash Polish — comparison baseline for Polish specifically
//
// French was already won by v3 vs Flash in the prior run, so we skip Flash
// French. Output to public/audio/ab-tts/ — A/B with headphones.

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

// Sample matrix: language × sample × model
// FR re-run: just v3 (Flash already lost)
// PL: both Flash + v3 (untested ground; Beat 4 demo language)

const matrix = [
  // ---- French (v3 re-run with tags) ----
  {
    lang: "fr",
    model: "eleven_v3",
    id: "greeting-warm",
    text: "[warmly] Bonjour Marcus, je suis Vera — votre médiatrice pour cette transaction.",
    description: "FR · v3 · greeting w/ [warmly]",
  },
  {
    lang: "fr",
    model: "eleven_v3",
    id: "recital-confident",
    text: "[confidently] Sarah accepte de payer quatre cents euros pour un iPhone 15, vendu par Marcus Adebayo, livré par Royal Mail suivi avant vendredi.",
    description: "FR · v3 · contract recital w/ [confidently]",
  },
  {
    lang: "fr",
    model: "eleven_v3",
    id: "agreement-locked",
    text: "[confidently] Très bien. Quatre cents euros sont maintenant bloqués en séquestre. Je serai là quand il faudra libérer l'argent.",
    description: "FR · v3 · lock confirmation w/ [confidently]",
  },

  // ---- Polish (v3 - the demo language) ----
  {
    lang: "pl",
    model: "eleven_v3",
    id: "greeting-warm",
    text: "[warmly] Cześć Marcus, jestem Vera — twoja mediatorka w tej transakcji.",
    description: "PL · v3 · greeting w/ [warmly]",
  },
  {
    lang: "pl",
    model: "eleven_v3",
    id: "recital-confident",
    text: "[confidently] Sarah zgadza się zapłacić czterysta funtów za jednego iPhone'a 15, sprzedanego przez Marcusa Adebayo, dostarczonego przez Royal Mail Tracked do piątku.",
    description: "PL · v3 · contract recital w/ [confidently]",
  },
  {
    lang: "pl",
    model: "eleven_v3",
    id: "agreement-locked",
    text: "[confidently] Dziękuję. Czterysta funtów jest teraz zablokowane w escrow. Będę tutaj, gdy nadejdzie czas na uwolnienie pieniędzy.",
    description: "PL · v3 · lock confirmation w/ [confidently]",
  },

  // ---- Polish (Flash baseline) ----
  {
    lang: "pl",
    model: "eleven_flash_v2_5",
    id: "greeting-warm",
    // No tag — Flash doesn't support audio tags
    text: "Cześć Marcus, jestem Vera — twoja mediatorka w tej transakcji.",
    description: "PL · Flash · greeting",
  },
  {
    lang: "pl",
    model: "eleven_flash_v2_5",
    id: "recital-confident",
    text: "Sarah zgadza się zapłacić czterysta funtów za jednego iPhone'a 15, sprzedanego przez Marcusa Adebayo, dostarczonego przez Royal Mail Tracked do piątku.",
    description: "PL · Flash · contract recital",
  },
  {
    lang: "pl",
    model: "eleven_flash_v2_5",
    id: "agreement-locked",
    text: "Dziękuję. Czterysta funtów jest teraz zablokowane w escrow. Będę tutaj, gdy nadejdzie czas na uwolnienie pieniędzy.",
    description: "PL · Flash · lock confirmation",
  },
];

const outDir = path.join(repoRoot, "public", "audio", "ab-tts");
fs.mkdirSync(outDir, { recursive: true });

console.log(`Voice: ${VOICE_ID} (Samara X)`);
console.log(`Output dir: ${outDir}`);
console.log(`Clips to generate: ${matrix.length}\n`);

for (const sample of matrix) {
  const modelLabel = sample.model === "eleven_v3" ? "v3" : "flash";
  const filename = `${sample.lang}__${sample.id}__${modelLabel}.mp3`;
  const filepath = path.join(outDir, filename);

  process.stdout.write(`Generating ${filename}... `);

  const body = {
    text: sample.text,
    model_id: sample.model,
    voice_settings: {
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

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ ${(buffer.length / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\nDone. Listen with headphones at ${outDir}\n`);
console.log("Listen order (compare by sample, not by file order):");
console.log("");
console.log("Polish recital (the demo language, hardest case):");
console.log("  pl__recital-confident__flash.mp3  vs");
console.log("  pl__recital-confident__v3.mp3");
console.log("    → does v3 still win on Polish? Is either acceptable?");
console.log("    → does Samara X drift to British accent on this length?");
console.log("");
console.log("Polish greeting (shortest case):");
console.log("  pl__greeting-warm__flash.mp3  vs");
console.log("  pl__greeting-warm__v3.mp3");
console.log("    → does [warmly] in v3 audibly change delivery?");
console.log("");
console.log("French re-run with tags:");
console.log("  fr__greeting-warm__v3.mp3 vs the prior fr greeting-warm v3");
console.log("    → are audio tags now audibly applied?");
