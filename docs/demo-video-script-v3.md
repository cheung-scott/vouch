# Vouch — Demo Video Script v3 (SUPERSEDED — historical reference only)

> ⚠ **SUPERSEDED by `docs/demo-video-script-v4.md`** as of 2026-05-19 evening. v4 combines this doc with the motion-archetype spec (`Vault/.../Research/Motion-Script-v3-Combined-2026-05-19.md`) and bakes in the user's audio decisions (shortened Polish recital, dropped "escrow" jargon, 7-clip Vera narration scope, locked SFX takes). **Read v4 for the working spec; this file is kept only for git history + delta context.**

**Length:** 65 seconds (Track 4 length, fade-out at ~60s, music tail to 65s, CapCut polishes the final fade)
**Music:** Track 4 — `hitslab-product-launch-advertisement-commercial-music-301409.mp3`
**Editorial frame:** Confident product anthem. **No external narrator.** Only the three diegetic voices from the product flow (Vera in-product, Sarah, Marcus) speak. Music + typography + product audio carry everything else.

---

## What's locked in v3 (deltas from v2)

| Decision | v2 | v3 |
|---|---|---|
| External narrator | 6 narrator-mode lines across the video | **REMOVED. Zero external narration.** |
| Voices in the demo | Narrator-Vera + in-product Vera + Sarah + Marcus | **In-product Vera + Sarah + Marcus only** |
| Taglines | Some Vera VO + typography | **Typography only — no spoken delivery** |
| Vera audio source preset | Narrator (stab 0.55, style 0.30) | **Mediating (stab 0.65, style 0.20)** for product Q&A · **Contract (stab 0.85, style 0.05)** for Vera reading terms to Marcus |
| Voice-rendering list | 6 narrator MP3s | **3 in-product dialogue MP3s** (see Voice section) |

This shift means the demo reads as a **product film, not an explainer.** Same length, more breathing room per beat.

---

## Track-mapped shot list (v3, FINAL)

Each beat:
- **Time** — start–end (sec)
- **Music** — what Track 4 is doing
- **Tagline** — typography visible (Act 1 = "Receive your money, on time." / Act 2 = "Every deal, kept." / Close = "Trust the handshake. Hold the money.")
- **On-screen** — typography / UI / visual element
- **Audio** — music + any diegetic dialogue + SFX
- **Animation** — motion description + reference slot to fill
- **Transition out** — how the beat ends

---

### 🎬 ACT 1 — happy path (0:00–0:47) · tagline anchor: *"Receive your money, on time."*

#### 1. Hook + Chrome extension entry (0:00–0:05)

| | |
|---|---|
| **Music** | Intro stab, kick lands on 0:01 |
| **Tagline** | *"Receive your money, on time."* — word-by-word reveal, hero italic gradient on "**on time**" |
| **On-screen** | Real eBay listing page (iPhone 15 256GB, £400, seller Marcus). Vouch Chrome extension injects a "**Pay with Vouch**" button next to the eBay "Buy It Now" button. Button has a subtle glow + pulse animation. Sarah's cursor moves toward it. |
| **Audio** | Music only. Cursor click SFX on tap. |
| **Animation** | Page loads → extension button slides in from the right edge → glows → cursor click → cream-surface wipe enters from below. Reference clip needed: **"Chrome extension button injection on a familiar marketplace + glow + click"** |
| **Transition out** | Cream surface wipes up from below to fill the frame |

---

#### 2. Solution intro + product reveal (0:05–0:09)

| | |
|---|---|
| **Music** | Sustained energy, groove begins |
| **Tagline** | *"Receive your money, on time."* lingers as secondary line under the wordmark |
| **On-screen** | Vouch wordmark + Vera waveform indicator. Cream `/new` page partially visible behind. |
| **Audio** | Music + light UI tick on wordmark land. **No voice.** |
| **Animation** | Wordmark wipes on, Vera waveform pulses. Reference clip needed: **"clean fintech product reveal — logo + tagline land"** |
| **Transition out** | Cream surface fills frame, transitions into the buyer flow |

---

#### 3. Vera buyer intake — DIEGETIC DIALOGUE (0:09–0:18)

| | |
|---|---|
| **Music** | First main groove section |
| **Tagline** | (off-screen — typography slot has the captured-terms cards) |
| **On-screen** | `/new` page (Sarah's flow). **Pre-filled from the extension:** item, price, currency, seller already populated. Sarah only needs to confirm + answer Q4 (delivery) + Q5 (extras). Vera asks Q4 → Sarah's voice waveform animates. Captured term cards fly into the right panel. |
| **Audio** | Music ducks slightly. **Vera (mediating, in-product):** *"When and how is it being delivered?"* (1.5s) · **Sarah (real human voice clip):** *"Royal Mail tracked, by Friday."* (1.5s) · Music returns. Soft chime per captured field. |
| **Animation** | Voice waveform animates as Sarah speaks. Captured terms cards fly in one by one. Reference clip needed: **"voice-driven form filling — captured fields flying into a panel"** |
| **Transition out** | Whip-pan / lateral slide to Marcus's view |

---

#### 4. Vera seller agreement + multilingual — DIEGETIC DIALOGUE (0:18–0:28) ⭐ MULTILINGUAL MOMENT

| | |
|---|---|
| **Music** | Sustained groove, slight intensity rise |
| **Tagline** | (off-screen — multilingual animation gets the typography slot) |
| **On-screen** | Marcus's view of `/deal/[ref]/seller`. Avatar location tag: **"Marcus · Warsaw, PL"**. Vera reads Sarah's terms in **Polish**. Marcus's voice waveform animates as he responds *"Zgadzam się."* Polish phrase appears under his avatar in mono, then **letter-by-letter morphs into English "I agree."** "I agree" button pulses → tap. |
| **Audio** | Music continues. **Vera (contract preset, in-product, Polish via eleven_v3 multilingual):** *"Sarah ustawiła ofertę. Pozwól mi przeczytać warunki..."* (~4s, Polish recitation of Sarah's terms) · **Marcus (real human voice clip, Polish):** *"Zgadzam się."* (1s) · Soft confirm tone on tap. |
| **Animation** | The Polish→English letter-by-letter transformation is the hero animation of this beat. Reference clip needed: **"text language transformation — letter-by-letter morphing between languages"** |
| **Transition out** | Lock-thunk transition into escrow lock beat |

---

#### 5. Money locks in escrow (0:28–0:33) ⭐ HERO ANIMATION OF ACT 1

| | |
|---|---|
| **Music** | Drum hit / accent — verify exact timestamp by listening |
| **Tagline** | *"receive your money, on time."* lands small in mono under the lock animation |
| **On-screen** | Big cream surface with **escrow lock animation**. Pile of £400 (or stack-of-cards visual) slides into a vault / lock. Status pill: AWAITING_SELLER → AGREED → IN_ESCROW. |
| **Audio** | Music + 🔒 **Lock-thunk SFX (150ms, low frequency)** — the most important SFX in the video. No voice. |
| **Animation** | **PEAK MOMENT.** Vault snaps shut, brief 2–3px screen shake. Tagline appears AS the money locks. Reference clip needed: **"satisfying mechanical lock animation — vault / safe / lockbox click"** |
| **Transition out** | Whoosh / cinematic time-skip |

---

#### 6. Time skip (0:33–0:37)

| | |
|---|---|
| **Music** | Sustained groove |
| **Tagline** | (off-screen) |
| **On-screen** | Calendar pages fan forward. Day counter ticks 1 → 5. Subtitle: **"5 days later."** Italic Fraunces, small. |
| **Audio** | Music + brief tick-tick-tick paper-flip whoosh. No voice. |
| **Animation** | Fast calendar-page flip + day counter. Reference clip needed: **"cinematic time-skip — calendar flipping / day counter ticking up"** |
| **Transition out** | Whoosh into delivery view |

---

#### 7. Item arrived + voice confirm — DIEGETIC DIALOGUE (0:37–0:42)

| | |
|---|---|
| **Music** | Energy holds, anticipation building |
| **Tagline** | (off-screen) |
| **On-screen** | Sarah's view: iPhone box delivered (tracking label visible). Vera prompt shown on UI. Sarah's voice waveform animates: she says "Yes." |
| **Audio** | Music ducks. **Vera (mediating):** *"It's arrived. Does it match?"* (1.5s) · **Sarah:** *"Yes."* (0.5s) · Soft chime on register. Music returns. |
| **Animation** | Box delivery visual → voice waveform pulse → checkmark begins to form. Reference clip needed: **"package delivery + voice confirmation"** |
| **Transition out** | The forming checkmark feeds into Beat 8's release animation |

---

#### 8. Tick + money released (0:42–0:47) ⭐ ACT 1 PAYOFF

| | |
|---|---|
| **Music** | **BUILD into the drop** at 0:47 |
| **Tagline** | *"Receive your money, on time."* lands one last time, large, as the money slides to Marcus |
| **On-screen** | Big animated ✓ tick lands center-screen. £400 amount counter releases from escrow to Marcus's avatar. Marcus gets a notification chime visual. The tagline + Marcus's avatar share the frame — the promise is kept. |
| **Audio** | Music build crescendos. 🔔 Release bell SFX (~400ms) on tick land. No voice. |
| **Animation** | **HERO TICK** — bold scale-in, satisfying weight. Money slides out of vault toward Marcus. Reference clip needed: **"satisfying checkmark tick animation"** + **"money transfer / coin slide"** |
| **Transition out** | **HARD CUT to black** at exactly frame 1410 (= 0:47.00 at 30fps) synced to Track 4's drop |

---

## ⬇ MUSIC DROPS at 0:47 ⬇

### 🎬 ACT 2 — dispute / safety net (0:47–0:62) · tagline anchor: *"Every deal, kept."* · entirely silent of voice

#### 9. Dispute opens (0:47–0:52)

| | |
|---|---|
| **Music** | **DROP / BREATH** — sparse, low |
| **Tagline** | *"Every deal, kept."* types in under the photo — hero gradient on "**kept**" |
| **On-screen** | Hard cut from black to: photograph of a **cracked iPhone** with tracking-label visible. Tagline 2 types underneath. |
| **Audio** | Music drop carries everything. Single sub-bass impact on image land. No voice. |
| **Animation** | Cracked iPhone photo fades up from black on the music drop, tagline types underneath. Reference clip needed: **"product damage reveal — slow zoom + caption land"** |
| **Transition out** | Smooth cross-dissolve to Vera's replay UI |

---

#### 10. Vera replays original promise (0:52–0:57) ⭐ MOAT ANIMATION OF ACT 2

| | |
|---|---|
| **Music** | Building back up |
| **Tagline** | (off-screen — UI gets the focus) |
| **On-screen** | Two stacked cards: **TOP** — Vera replay UI: *"Marcus said: no scratches, original box."* Audio waveform highlighted at "scratches." **BOTTOM** — Sarah's evidence photo + delivery-day timestamp. |
| **Audio** | Music rebuilding. Brief audio scrub / waveform pulse on the "scratches" moment. **The waveform plays MARCUS'S ACTUAL VOICE saying "no scratches"** (~0.5s diegetic playback from the seller agreement at 0:18-0:28 — uses the same recorded clip). |
| **Animation** | Top card animates the audio waveform; the word "scratches" is highlighted/scrubbed. Bottom card has a glowing border. Reference clip needed: **"side-by-side evidence comparison UI with highlighted contradiction"** |
| **Transition out** | Cards merge / consolidate into the verdict frame |

**Note:** Marcus's "no scratches" replay clip is the only voice content in Act 2 — and it's diegetic (Vera is literally playing back the recorded promise). This isn't narration; it's the product showing its own evidence chain. Critical moment.

---

#### 11. Verdict + refund (0:57–0:62)

| | |
|---|---|
| **Music** | Full energy return |
| **Tagline** | *"Every deal, kept."* lands small under the verdict card |
| **On-screen** | Verdict card slides in: **"Ruling: refund to Sarah. Marcus's account flagged."** Beneath: £400 amount slides back from escrow to Sarah's avatar. Status pill: REFUNDED. |
| **Audio** | Music. Soft chime on verdict; coin/cash sweep SFX on money return. No voice. |
| **Animation** | Money reversal — animated coin-stream back to Sarah. Verdict card lands authoritatively. Reference clip needed: **"refund / money returning to buyer animation"** + **"verdict / ruling card reveal"** |
| **Transition out** | Fade slightly, hold the resolution beat |

---

#### 12. Close — brand synthesis (0:62–0:65)

| | |
|---|---|
| **Music** | Tail of Track 4, fading naturally (CapCut polishes the final 1–2s fade) |
| **Tagline** | All three lines synthesise: |
| **On-screen** | Centred composition: **Vouch wordmark** large. Under it: *"Trust the handshake. Hold the money."* in mono — the brand line. Slow 1.5s fade-in, then 1.5s hold before music ends. |
| **Audio** | Music fades. No voice. |
| **Animation** | Wordmark + brand line land together, deliberate slow reveal. Reference clip needed: **"tagline reveal with wordmark — soft, confident landing"** |
| **Transition out** | Hold the wordmark for ~1s after music ends, then cut to black |

---

## 📋 Voice content to render (in-product clips only, no narrator)

All clips use the **mediating preset** unless noted. Render via TTS (not ConvAI — pre-baked for frame-accurate Remotion sync).

### English (mediating preset: stability 0.65, style 0.20, model `eleven_turbo_v2_5`)

1. **Beat 3 Vera prompt:** *"When and how is it being delivered?"* (~1.5s)
2. **Beat 7 Vera prompt:** *"It's arrived. Does it match?"* (~1.5s)

### Polish (contract preset: stability 0.85, style 0.05, model `eleven_v3` multilingual)

3. **Beat 4 Vera in Polish:** *"Sarah przygotowała ofertę. Pozwól mi przeczytać warunki: jeden iPhone piętnaście, dwieście pięćdziesiąt sześć gigabajtów, w oryginalnym opakowaniu, bez zarysowań, za czterysta funtów, dostarczony Royal Mail Tracked, do piątku."* (~6s) — **PENDING native verification before final render.**

### Human voice clips (NOT TTS — these are real recordings needed)

4. **Beat 3 Sarah:** *"Royal Mail tracked, by Friday."* — record yourself or anyone (1.5s, clean acoustic environment)
5. **Beat 7 Sarah:** *"Yes."* (0.5s)
6. **Beat 4 Marcus:** *"Zgadzam się."* — Polish speaker preferred but accent fine; can use ElevenLabs IVC for ~1 min of fake Polish-accented English if no Polish speaker available

**Marcus's "no scratches" clip is REUSED in Beat 10** — that's why the recording from Beat 4 is critical to nail. It's the diegetic evidence in the dispute moment.

### Total audio assets

- 2 Vera English TTS clips (mediating preset)
- 1 Vera Polish TTS clip (contract preset, multilingual model)
- 3 human voice recordings (or IVC clones)

Save to `public/audio/vera/` and `public/audio/voices/`.

---

## 📋 Tagline placement (typography only — no VO)

| Beat | Time | Tagline visible | How it lands |
|---|---|---|---|
| 1 | 0:00–0:05 | **"Receive your money, on time."** | Hero word-by-word reveal, italic gradient on "on time" |
| 2 | 0:05–0:09 | Lingers as secondary under wordmark | Small mono |
| 5 | 0:28–0:33 | **"receive your money, on time."** small mono | Under the lock animation |
| 8 | 0:42–0:47 | **"Receive your money, on time."** | Full lockup, lands AS Marcus's money arrives |
| 9 | 0:47–0:52 | **"Every deal, kept."** types in | On the music drop, with cracked iPhone |
| 11 | 0:57–0:62 | **"Every deal, kept."** small under verdict | Anchors Sarah's refund |
| 12 | 0:62–0:65 | **"Trust the handshake. Hold the money."** under wordmark | Synthesis line, slow fade-in |

Each tagline appears with its **literal payoff in the same shot** — that's still the rule.

---

## 🔧 Chrome extension build spec (unchanged from v2)

[See `docs/demo-video-script-v2.md` § Chrome extension — build spec for the full Manifest V3 + content script outline. Spec is unchanged in v3.]

---

## 🗓️ Production sequencing (unchanged from v2)

```
Day 2 EOD (today)            → Script v3 LOCKED. Keys in .env.local. Vera voice locked.
Day 3                        → Stripe Connect Client ID + webhook secret, ConvAI agent created, voice flow E2E
Day 4 AM (~3h)               → Build the Chrome extension
Day 4 PM (~3h)               → Polish session-type variant + dispute UI polish + record 3 human voice clips
Day 5 AM                     → Screen recordings of all /demo + extension flows
Day 5 PM                     → Source Claude Design references, I draft per-scene prompts
Day 5 evening + Day 6 AM     → Generate scenes in Claude Design, drop into Remotion public/scenes/
Day 6 PM                     → Master render + CapCut fade polish + Submagic 9:16 captions + 3 aspect-ratio exports
Day 7 AM                     → Final review + submit
```

---

## 🎬 Open questions (still 2 from v2 — answer when ready, I'll patch in place)

1. **Cracked iPhone visual:** stock photograph (recommended — Unsplash search "broken iPhone screen on table") or Claude Design illustration?
2. **Multilingual language:** Polish (recommended — visibly different, eleven_v3 handles well), Spanish (broader reach), or German (closer to English so morph less dramatic)?

Lock these two and v3 is final.

---

*Supersedes v2. v2 retained for git history. v3 is the working doc until product surfaces are screen-recorded.*
