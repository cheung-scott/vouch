# Vouch demo video — Claude Design prompt pack (v2, design-system-aware)

**Pipeline:**
1. **Claude Design** renders each beat as an interactive prototype using the published Vouch design system
2. Screen-record (or export per Claude Design's output path) into MP4 segments
3. **Remotion** layers audio (voice clips, SFX, music) over the assembled scenes per the audio cue tables
4. **CapCut** polishes — final colour pass, music fade tail, captions if needed

**Source of truth:** `docs/demo-video-script-v4.md` (narrative + motion + audio decisions, locked 2026-05-19). This file is the operational handoff — each beat's prompt is self-contained and pastes directly into Claude Design.

## What the design system provides (so prompts don't repeat)

When the Vouch design system is published in Claude Design, every prototype inherits:
- **Palette:** cream surfaces, ink hierarchy, indigo brand accent, success/warning/locked semantic tones
- **Typography:** Fraunces (display, semibold), Inter (body), JetBrains Mono (eyebrows / captions / timestamps)
- **Components:** Card (white surface on cream, 12px radius, warm border), StatusPill (mono uppercase with state-coloured dot + bg), Eyebrow (mono uppercase 10-11px tracking 0.14em), MoneyAmount, primary/secondary Button variants, Vera waveform indicator (3-bar mono indigo, breathing)
- **Master easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuart) — "smooth-snappy"
- **Brand voice:** anti-fintech-blue, anti-decoration, warm editorial, no "escrow" language

**This means prompts below don't restate colours, fonts, or component styling unless overriding a default.** They focus on motion, composition, and per-beat specifics.

## Universal prompt constraints

Drop these into every Claude Design prompt unless otherwise noted:
- 1920×1080, 30fps (60fps optional for high-motion beats 4, 5, 8 — downsample to 30fps in CapCut)
- Master easing: design system default (easeOutQuart)
- Default durations: 500ms text reveals, 700ms UI motion, 800ms morphs
- No bouncy springs (toy-like on fintech UI)
- All assets are uploaded per the "Stills to upload" list per beat

---

## 🎬 ACT 1 — Happy Path (0:00–0:47)

### Beat 1 — Hook + Chrome extension entry (0:00–0:05) · 5s

**Music:** Intro stab (0:00) → kick lands at 0:01 → groove begins at 0:01–0:05.
**Audio (Remotion):** Music only. Cursor click SFX on the button tap at ~0:04.

**Stills to upload:**
- `b1-ebay-no-button.png` — eBay 512GB listing baseline
- `b1-ebay-with-button.png` — same listing with Pay with Vouch button injected
- `b1-button-only.png` — Pay with Vouch button isolated

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. **Override default cream background — use dark `#0c0c14` for the first half of the scene.**
>
> **0:00–0:01.5** — Hero tagline "Receive your money, on time." reveals word-by-word, each word fading up `y=24, opacity=0 → y=0, opacity=1` with 120ms stagger. "on time." is in italic with an indigo gradient text fill. Letter spacing tightens during reveal (`0em → -0.025em`). First word lands on the kick at 0:01.
>
> **0:01.5–0:02** — Cream surface wipes up from below via clip-path inset `inset(100% 0 0 0) → inset(0)`, 400ms. Tagline masks out as cream covers it.
>
> **0:02–0:03** — Cross-fade in `b1-ebay-no-button.png` full-bleed on the cream surface. Hold 1s.
>
> **0:03–0:03.4** — Cross-dissolve to `b1-ebay-with-button.png`. The Pay with Vouch button slides in from the right (`x: 100 → 0, opacity: 0 → 1`), 400ms.
>
> **0:03.4–0:03.6** — Button single scale-pulse `1 → 1.06 → 1`, 200ms. Soft indigo halo behind it (`box-shadow: 0 0 24px 6px rgba(99,91,255,0.35)`) ramps in/out with the pulse.
>
> **0:04–0:04.5** — Cursor enters bottom-right, curves to the button on a quadratic Bézier path, terminating on the button at 0:04.4. Button shows pressed state at 0:04.5 (`scale: 0.98`, darker fill).
>
> **0:04.5–0:05.0** — Radial cream wipe expands from button outward (`clip-path: circle(0% → 150%)`), 400ms, masking into Beat 2.
>
> Style notes: No confetti, no sparkle, no spring. Cursor path natural curve, gentle decel.

---

### Beat 2 — Solution intro + product reveal (0:05–0:09) · 4s

**Music:** Groove begins. Logo lands on the downbeat at 0:06.
**Audio (Remotion):** Music + soft UI tick on wordmark land. No voice.

**Stills to upload:**
- `b12-vouch-wordmark-light.png` — Vouch wordmark on cream

**Claude Design prompt:**

> Render a 4-second 1920×1080 scene at 30fps. Cream background (design system default).
>
> **0:00–0:01** — Radial bloom expands from centre — clip-path `circle(0% at 50% 50%) → circle(150% at 50% 50%)`, 600ms. Hold cream 400ms.
>
> **0:01–0:01.5** — Centre the Vouch wordmark (`b12-vouch-wordmark-light.png`). Scale-in keyframes: `scale: 0 → 1.06 → 1`, opacity `0 → 1`, total 500ms with overshoot at 70% timeline. Lands at exactly 0:01 in scene (= 0:06 of overall video).
>
> **0:01.5–0:03.5** — Below the wordmark, render a mono tagline "Receive your money, on time." (opacity 0 → 0.7, 400ms fade). Around the wordmark, place the Vera waveform indicator (design system component) — 3 indigo bars, breathing scale `1 → 1.15 → 1` on 1.4s loop.
>
> **0:03.5–0:04** — Hold the composition.
>
> Style notes: Slow confident reveal. Subtle overshoot (1.06, not 1.15). No letter-by-letter animation on "Vouch". No CTA button.

---

### Beat 3 — Vera buyer intake (0:09–0:18) · 9s

**Music:** First main groove. Ducks -3dB during voice. 4 captured-field chimes on off-beats.
**Audio (Remotion):**
- Vera: `beat-3-q4-tight.mp3` — *"When do you expect it to arrive by?"* — plays from 0:00.5 of scene
- Sarah: `sarah-delivery-expressive-1.mp3` — *"By Friday."* — plays at 0:02.5 of scene
- 4 chime SFX between 0:03.5–0:07.5 (one per card arrival)

**Stills to upload:**
- `b3-new-q4-vera-speaking.png` — /new page Q4 stage
- `b3-captured-card-item.png` — "What you're buying · iPhone 15 Pro Max 512GB"
- `b3-captured-card-seller.png` — "The other party · Marcus"
- `b3-captured-card-amount.png` — "Amount + currency · £609.89"
- `b3-captured-card-delivery.png` — "Expected by · By Friday"

**Claude Design prompt:**

> Render a 9-second 1920×1080 scene at 30fps. Cream background.
>
> **0:00–0:01** — Cross-fade in `b3-new-q4-vera-speaking.png` full-frame. Vera question card top, captured-summary strip right.
>
> **0:01–0:02.5** — Inside the Vera card, the Vera waveform indicator pulses (active speaking variant — higher amplitude than ambient breathing). Syncs to Vera audio at 0:00.5–0:02.
>
> **0:02.5–0:03.5** — Waveform character changes — Sarah's voice (warmer tone, 4 bars, smaller amplitude). Pulses for 1s.
>
> **0:03.5–0:08** — Four captured-term cards fly into the captured-summary strip on the right, one at a time, 1s apart. Each enters `x: 200 → 0, opacity: 0 → 1`, 450ms. Order: 0:03.5 item, 0:04.5 seller, 0:05.5 amount, 0:06.5 delivery. On each arrival, briefly highlight the row background (indigo wash at 10% opacity, fade out over 200ms). Soft chime SFX layered in Remotion per arrival.
>
> **0:08–0:09** — Hold full captured-strip composition. Vera waveform fades to ambient breathing.
>
> Style notes: Effortless arrival. No confetti on cards.
>
> **Transition out:** Whip-pan right `translateX(-100%)`, 250ms easeInOut, with 30px motion blur only during the move.

---

### Beat 4 — Multilingual seller agreement (0:18–0:28) · 10s ⭐ MULTILINGUAL HERO

**Music:** Sustained groove + intensity rise. Confirm tone on button tap near 0:27.
**Audio (Remotion):**
- Vera Polish: `beat-4-polish-recital-default.mp3` — Polish recital — plays 0:01–0:04 of scene
- Marcus: `marcus-zgadzam-balanced.mp3` — *"Zgadzam się."* — plays at 0:07.5 of scene
- Confirm tone on button tap at 0:09 of scene

**Stills to upload:**
- `b4-marcus-avatar-warsaw.png` — Marcus avatar + Warsaw location tag
- `b4-polish-text.png` — "Zgadzam się." mono
- `b4-english-text.png` — "I agree." mono
- `b4-seller-vera-reading.png` — seller intake page background
- `b4-i-agree-button-default.png` — I agree button default state
- `b4-i-agree-button-tapped.png` — I agree button pressed state

**Claude Design prompt:**

> Render a 10-second 1920×1080 scene at 30fps. Cream background.
>
> **0:00–0:01** — `b4-seller-vera-reading.png` positioned left-of-centre with 3D perspective tilt: `perspective(2000px) rotateY(7deg) rotateX(2deg)`. Trust-blue radial halo behind it (`radial-gradient(ellipse at 70% 50%, rgba(82,102,235,0.15) 0%, transparent 60%)`).
>
> **0:01–0:01.5** — `b4-marcus-avatar-warsaw.png` slides into top-right (`opacity: 0 → 1, y: 20 → 0`, 400ms).
>
> **0:01.5–0:04** — Vera Polish audio plays. Vera waveform indicator pulses inside the tilted seller page.
>
> **0:04–0:05** — Below Marcus's avatar, `b4-polish-text.png` ("Zgadzam się.") types in letter-by-letter (30ms per character). Lands at 0:05.
>
> **0:05–0:05.8** — Hold Polish text. Marcus's diegetic voice plays here.
>
> **0:05.8–0:06.8** — ⭐ **HERO MOMENT** — letter-by-letter morph from Polish to English. Each character of "Zgadzam się." fades out with 30ms left-to-right stagger (total 0.6s). Each character of "I agree." fades in with the same 30ms stagger, starting 0.2s after the Polish-out begins (so they overlap). Use the SAME monospace font + same size — only the characters change. At 0:06.8 only "I agree." is visible.
>
> **0:06.8–0:08** — `b4-i-agree-button-default.png` enters from below (`y: 40 → 0, opacity: 0 → 1`, 400ms). Pulses subtly `scale: 1 → 1.04 → 1`, 250ms repeating on 800ms interval.
>
> **0:08–0:08.5** — Cursor enters from right, approaches the button. At 0:08.5, swap to `b4-i-agree-button-tapped.png` (pressed + glow). Confirm tone SFX in Remotion.
>
> **0:08.5–0:09** — Single-frame freeze for 80ms emphasis. Radial lock-prep wipe expands from button outward (`clip-path: circle(0% → 30%)`).
>
> **0:09–0:10** — Hold lock-prep state. Cream dims slightly behind the deepening radial wipe.
>
> Style notes: The Polish→English morph is the hero animation of the entire demo. Spend frames on it. Same font, same size, only characters change.

---

### Beat 5 — Money locks in escrow (0:28–0:33) · 5s ⭐ ACT 1 HERO

**Music:** ⚠ DRUM HIT between 0:28–0:30. Vault snap MUST land on it.
**Audio (Remotion):**
- Music + 🔒 `lock-thunk-v3-take5.mp3` (~150ms) at 0:00.7 of scene = 0:28.7 overall. **Most critical SFX sync in the video.**
- No Vera voice.

**Stills to upload:**
- `b5-pill-awaiting-seller.png`
- `b5-pill-agreed.png`
- `b5-pill-in-escrow.png` (the MONEY HELD state)

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream background. **Peak motion MUST land on the drum hit at 0:00.7 of this scene.**
>
> **0:00–0:00.4** — A pile of £400 (visualised as 4-5 layered indigo+cream banknote rectangles, slight tilt — abstract shapes, not detailed banknote art) slides into centre-frame from offstage left, 400ms.
>
> **0:00.4–0:00.55** — Stylised SVG vault appears centre-frame behind the money (rounded square with concentric rings, brushed-steel grey outline on cream). Shutter at 90° open. 150ms appearance via opacity + slight scale-in.
>
> **0:00.55–0:00.7** — Money compresses inward toward the vault (`scale: 1 → 0.6`), 150ms. Reads as being sucked in.
>
> **0:00.7** — ⭐ **DRUM HIT.** Single frame keyframe: vault snaps shut, shutter rotates 90° → 0° instantly. Vault icon scale jolts `1 → 1.08 → 1` in 2 frames. NO intermediate animation.
>
> **0:00.7–0:00.78** — Screen shake on entire composition: `translate(±3px, ±1.5px)` using `Math.sin(frame * 8)` for 2-3 frames (80ms).
>
> **0:00.78–0:01.2** — Three concentric pulse rings emanate from vault centre, 120ms stagger. Each: `scale: 0 → 1, opacity: 0.4 → 0`, 400ms. Indigo, 1.5px stroke.
>
> **0:01–0:02.5** — Status pill cascade bottom-right. Three pills appear in sequence, cross-fading:
> - 0:01 — `b5-pill-awaiting-seller.png` (`scale: 0.9 → 1, opacity: 0 → 1`, 300ms)
> - 0:01.4 — Cross-fade to `b5-pill-agreed.png`
> - 0:01.8 — Cross-fade to `b5-pill-in-escrow.png` (MONEY HELD — keep pulsing dot animation)
>
> **0:01–0:03** — Below vault, mono tagline "receive your money, on time." (lowercase, italic gradient on "on time") types word-by-word, 80ms stagger. Lands at 0:03.
>
> **0:03–0:05** — Hold. Vault centre, indigo MONEY HELD pill at bottom-right pulsing. Pulse rings faded. Ambient breathing on vault (`scale: 1 → 1.005 → 1`, 1.4s loop).
>
> **Transition out (0:05+):** Radial wipe from vault centre outward (`clip-path: circle(0% → 150%)`), 350ms easeInOut. Whoosh SFX in Remotion.
>
> Style notes: The drum hit at 0:00.7 is THE most important sync in the demo. Vault snap = 1-2 frames max (33-66ms). Screen shake subtle but felt (3px max).

---

### Beat 6 — Time skip (0:33–0:37) · 4s

**Music:** Sustained groove. Paper-flip SFX rides without competing.
**Audio (Remotion):** Music + brief tick-tick paper-flip whoosh. No voice.

**Stills to upload:** None — typography + abstract calendar pages.

**Claude Design prompt:**

> Render a 4-second 1920×1080 scene at 30fps. Cream background.
>
> **0:00–0:01** — Cross-fade in. Centre-frame, render 6 stylised calendar pages stacked at slight angles (±2° each). Each is a Card-style rectangle (180×220px, design system Card surface) with a Fraunces semibold date number (56px) top-centred: 21, 22, 23, 24, 25, 26.
>
> **0:01–0:03** — Pages flip forward one at a time, 80ms apart. Each flip: `rotate3d(1, 0, 0, 0° → 90° → 0°)` + `scale: 1 → 0.95 → 1` + `opacity: 0.7 → 1`. Front-of-pile page changes per flip. ~2s total cascade with overlap.
>
> **0:01.5–0:03** — Bottom-left day counter ticks "Day 1" → "Day 5". Use key-change with `popLayout` — each digit fades out upward as next fades in from below. Lands "Day 5" at 0:03.
>
> **0:03–0:04** — Subtitle types in below the calendar stack: **"5 days later."** in italic Fraunces (32px). Word-by-word, 200ms each, 400ms total. Holds 1s.
>
> Style notes: Pages feel like physical objects (slight shadow, slight rotation). No grid lines on calendars. "5 days later." is the only verbal element.
>
> **Transition out:** Cross-dissolve into Beat 7.

---

### Beat 7 — Item arrived + voice confirm (0:37–0:42) · 5s

**Music:** Energy holds, anticipation builds. Soft chime on register at 0:04 of scene.
**Audio (Remotion):**
- Vera: `beat-7-receipt-ask-loose.mp3` — *"It's arrived. Does it match?"* — plays 0:00–0:01.5 of scene
- Sarah: `sarah-yes-expressive-1.mp3` — *"Yes."* — plays at 0:02 of scene
- Soft chime on register at 0:04 of scene

**Stills to upload:**
- `b7-parcel-arrived.jpg` — iPhone box parcel
- `b7-signoff-in-escrow.png` — signoff page in MONEY HELD state

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream background.
>
> **0:00–0:01** — Cross-fade in. `b7-signoff-in-escrow.png` is the main stage, positioned slightly right of centre, perspective-tilted `perspective(2000px) rotateY(-5deg)` (mirror of Beat 4's angle).
>
> **0:00–0:01.5** — Vera waveform indicator pulses inside the Sarah voice CTA on the signoff card.
>
> **0:01–0:02** — `b7-parcel-arrived.jpg` slides in from off-screen-bottom, 600ms. Lands slightly left of the signoff card, rotated ~-8° (set-down-naturally angle). Soft drop shadow underneath.
>
> **0:02–0:02.5** — Sarah's voice clip plays. Reactive 4-bar waveform animates inside the signoff card (~500ms higher-amplitude window).
>
> **0:02.5–0:04** — Checkmark BEGINS to form on top of the signoff card. SVG path: `pathLength: 0 → 0.4`, 1.5s. **Partial draw only — completes in Beat 8.**
>
> **0:04–0:05** — Hold. Parcel next to signoff card, partial checkmark. Indigo glow ramps behind the checkmark (`box-shadow: 0 0 24px rgba(82, 102, 235, 0.4)`, opacity 0 → 1 over 1s).
>
> Style notes: Partial checkmark is the cliffhanger — don't finish it. Parcel rotation natural, not grid-aligned.
>
> **Transition out:** Continuous motion into Beat 8 — forming checkmark feeds directly into Beat 8's hero tick.

---

### Beat 8 — Tick + money released (0:42–0:47) · 5s ⭐ ACT 1 PAYOFF

**Music:** ⚠ **BUILD INTO THE DROP AT 0:47.** Hero tick at 0:01–0:01.4, money slide 0:02–0:03.4, tagline lockup 0:03.5–0:04. **HARD CUT to black at frame 150 (0:05.00 of scene = 0:47.00 overall video).**
**Audio (Remotion):**
- Music build crescendos
- 🔔 `release-bell-v2-take5.mp3` (~400ms) at 0:01.4 of scene
- No Vera voice

**Stills to upload:**
- `b8-pill-released.png` — RELEASED status pill
- `b8-signoff-released.png` — signoff in RELEASED state
- `b4-marcus-avatar-warsaw.png` — Marcus avatar (receives the money)
- `b1-tagline-on-time.png` — final tagline lockup

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream background. **Final frame is a HARD CUT to black synced to music drop at 0:47 of overall video.**
>
> **0:00–0:01** — Continue Beat 7's partial checkmark. Complete the draw: `pathLength: 0.4 → 1.0`, 500ms. Single pulse ring fires from the checkmark centre on completion (`scale: 0 → 1, opacity: 0.6 → 0`, 400ms).
>
> **0:01–0:01.4** — Hero tick scale-in: a large success-green checkmark on a white circle (120px diameter, semantic success colour from design system) appears centre-frame. `scale: 0 → 1.15 → 1`, 350ms, single concentric ring pulse on the overshoot.
>
> **0:01.4** — Release-bell SFX lands in Remotion.
>
> **0:01.4–0:02.4** — `£0` counter appears below the tick. Ticks UP £0 → £609.89 over 700ms, per-digit increment animation. Fraunces semibold, 64px.
>
> **0:01.4–0:03.4** — Simultaneously, money slides from vault position (off-screen left) to Marcus's avatar (off-screen right) via SVG motion path. `offsetPath` + `offsetDistance: 0% → 100%`, 1.2s easeInOut. Marcus's avatar enters from the right at 0:02 at the path's endpoint.
>
> **0:02.4–0:03.2** — Money lands on Marcus. Avatar gets a `1` badge top-right + 200ms pulse ring (`scale: 1 → 1.04 → 1`).
>
> **0:03.2–0:04** — Bottom third of frame, tagline "Receive your money, on time." appears word-by-word (italic gradient on "on time"), 120ms between words. Final word "time." lands at frame 149 (0:04.97 of scene = 0:46.97 overall).
>
> **0:04.97** — `b8-pill-released.png` cross-fades in next to the tagline.
>
> **0:05.0** — **HARD CUT TO BLACK** — single frame. Synced to music drop at 0:47.
>
> Style notes: Marcus's notification chime visual + money slide MUST complete BEFORE the hard cut. Hero tick is the emotional payoff of Act 1 — give it room.

---

## ⬇ MUSIC DROPS — HARD CUT TO BLACK at 0:47 ⬇

## 🎬 ACT 2 — Dispute / safety net (0:47–0:62)

### Beat 9 — Dispute opens (0:47–0:52) · 5s

**Music:** **DROP / BREATH** — sparse, low. Sub-bass impact on image-land at 0:00.7 of scene.
**Audio (Remotion):** Music drop. Single sub-bass impact. No voice.

**Stills to upload:**
- `b9-cracked-iphone.jpg` — real cracked iPhone photograph

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. **Override default cream — start on pure black.**
>
> **0:00–0:00.3** — Pure black hold. 3 frames.
>
> **0:00.3–0:00.7** — `b9-cracked-iphone.jpg` fades up from black (`opacity: 0 → 1`, 400ms). Ken Burns micro-zoom `scale: 1.05 → 1.0` same window. Sub-bass SFX in Remotion exactly when opacity hits 1.
>
> **0:00.7–0:01** — Hold the photo. No motion.
>
> **0:01–0:01.8** — Below or overlaid on photo (lower third), tagline "Every deal, kept." types word-by-word, 4 words × 200ms stagger. Italic indigo gradient on "kept". 800ms total reveal.
>
> **0:01.8–0:05** — Hold composition 3.2s. Photo breathes subtly (`scale: 1 → 1.01 → 1`, 2s loop, almost imperceptible). NO additional decoration.
>
> Style notes: This is the most restrained beat. NO particles. NO dust. NO motion. Cracked iPhone alone, in silence, on a music drop, is the entire emotional landing. Trust it.
>
> **Transition out:** Smooth cross-dissolve (300ms) to Beat 10.

---

### Beat 10 — Vera replays original promise (0:52–0:57) · 5s ⭐ MOAT ANIMATION OF ACT 2

**Music:** Building back up. Waveform scrub on "scratches" lands precisely on the rebuild moment.
**Audio (Remotion):** Music rebuilding + diegetic Marcus voice `marcus-no-scratches-consistent-1.mp3` — *"No scratches, original box."* (~1s) at 0:01.5 of scene. NO Vera narration.

**Stills to upload:**
- `b10-replay-card.png` — Vera replay card (TOP)
- `b10-evidence-card.png` — Sarah's evidence card (BOTTOM)
- `b10-cards-stacked.png` — composed stacked reference layout

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream background.
>
> **0:00–0:00.6** — Both cards enter staggered. TOP card (`b10-replay-card.png`) slides from above (`y: -200 → centre, opacity: 0 → 1`), 600ms. BOTTOM card (`b10-evidence-card.png`) slides from below 120ms later, same duration. Both land centred horizontally, stacked with 60px gap.
>
> **0:00.6–0:01.5** — Hold. TOP card has indigo accent border (active/highlighted). BOTTOM has neutral warm border (subdued).
>
> **0:01.5–0:02.5** — Marcus's diegetic audio plays. On the TOP card's waveform, animate the bar positioned where "scratches" lands in the audio — `scale: 1 → 1.6 → 1` over 300ms with peak at 0:02 (synced to the word). Concentric pulse ring emanating from that bar (`scale: 0 → 1, opacity: 0.6 → 0`, 400ms).
>
> **0:01.8–0:02** — Background highlight pill draws behind "no scratches" text — clipPath wipe left-to-right (`inset(0 100% 0 0) → inset(0)`), 200ms. Pill colour: warning-soft semantic from design system. Stays visible for rest of beat.
>
> **0:02.5–0:04** — BOTTOM card border ramps neutral warm → indigo accent over 400ms. Once at indigo, breathe (`opacity: 1 → 0.7 → 1`, 1.4s loop).
>
> **0:04–0:05** — Hold. Marcus's commitment (TOP) + Sarah's evidence (BOTTOM) sit together.
>
> Style notes: This is the moat. The diegetic playback of Marcus's actual recorded voice IS the differentiator. Waveform pulse must SYNC to the word "scratches" — second most critical sync after Beat 5's drum hit.
>
> **Transition out:** Both cards collapse + merge centre via FLIP (`scale: 0.85, opacity: 0.6`), 400ms easeInOut, cross-fade to Beat 11.

---

### Beat 11 — Verdict + refund (0:57–0:62) · 5s

**Music:** Full energy return. Verdict card lands on a music accent. Coin sweep SFX bridges into money reversal.
**Audio (Remotion):**
- Music full energy
- 🔔 `dispute-chime-take3.mp3` (~700ms) on verdict card land at 0:00 of scene
- Coin/cash sweep SFX under money reversal at 0:02 of scene
- No voice

**Stills to upload:**
- `b11-verdict-card.png` — verdict card (glassmorphism)
- `b11-pill-refunded.png` — REFUNDED pill
- `b11-sarah-avatar.png` — Sarah's avatar
- `b12-tagline-lockup.png` — "Every deal, kept." anchor

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream background with subtle top-centred indigo radial glow (`radial-gradient(ellipse 60% 40% at 50% 30%, rgba(82, 102, 235, 0.10) 0%, transparent 70%)`).
>
> **0:00–0:00.6** — `b11-verdict-card.png` slides up into centre (`y: 100 → 0, scale: 0.96 → 1, opacity: 0 → 1`), 500ms. Card has glassmorphism: `backdrop-filter: blur(22px) saturate(170%)`, white-translucent surface (`rgba(255,255,255,0.65)`). Dispute-chime SFX in Remotion.
>
> **0:01–0:01.4** — Card heading "Refund to Sarah." reveals word-by-word (80ms stagger). "Sarah" in italic indigo.
>
> **0:02–0:03.2** — Below the card, money reversal. £-symbol cluster slides BACK from Marcus's position (off-screen right) toward Sarah (off-screen left) via REVERSE of Beat 8's motion path. `offsetPath` + `offsetDistance: 0% → 100%` along reversed path, 1.2s easeInOut. Coin sweep SFX in Remotion.
>
> **0:02–0:02.8** — £-amount counter beneath verdict card ticks DOWN £609.89 → £0 over 800ms.
>
> **0:03.5** — `b11-pill-refunded.png` cross-fades in next to the counter (now £0), 300ms.
>
> **0:04–0:04.3** — Sarah's avatar (`b11-sarah-avatar.png`) at money's destination does micro-bounce `scale: 1 → 1.06 → 1`, 250ms, no spring.
>
> **0:04.3–0:05** — Hold. Verdict card centred-top, Sarah's avatar left with REFUNDED pill. Below, `b12-tagline-lockup.png` ("Every deal, kept.") cross-fades in as closing anchor. Holds 700ms.
>
> Style notes: Glassmorphism on verdict card is critical — gives the ruling weight. The MotionPath reversal of Beat 8 is poetic — same path that delivered money now returns it.
>
> **Transition out:** Slight fade (200ms), hold resolution 500ms, cross-fade to Beat 12.

---

### Beat 12 — Close / brand synthesis (1:02–1:05) · 3s

**Music:** Tail of Track 4 fading. Wordmark lands at 0:00.5 of scene on last sustained chord.
**Audio (Remotion):** Music fades. No voice.

**Stills to upload:**
- `b12-vouch-wordmark.png` — wordmark on dark BG (hero variant)

**Claude Design prompt:**

> Render a 3-second 1920×1080 scene at 30fps. **Override default cream — use dark `#0c0c14` background.**
>
> **0:00–0:01** — Cross-fade from Beat 11's cream into dark. `b12-vouch-wordmark.png` scale-ins centre-frame: `scale: 0.92 → 1`, **1.5s** easeOutQuart. Opacity `0 → 1` over 1.0s. DELIBERATELY SLOW — confidence pace.
>
> **0:00.5** — Wordmark fully visible.
>
> **0:00.5–0:02.5** — Beneath the wordmark, Vera waveform indicator pulses gently (design system ambient variant, breathing 1.4s loop).
>
> **0:01.5–0:02.7** — Brand line types in below the waveform, mono, per-word 200ms: **"Trust the handshake. Hold the money."** Final word at 0:02.7. Light grey `rgba(255,255,255,0.7)`, no italic, no flourish.
>
> **0:02.7–0:03** — Hold composition. 300ms breath.
>
> **0:03** — Cut to black. End.
>
> Style notes: NO CTA button — the wordmark IS the close. NO letter animation on "Vouch". NO fade-out before the cut. 1.5s scale-in is the confidence move — every other beat snaps, this one breathes.

---

## 📋 Render order recommendation

Per v4 implementation order:
1. **Beat 5** — anchors Act 1 climax (drum hit sync)
2. **Beat 9** — hardest editorially (silence + restraint)
3. **Beats 2, 8, 10, 12** — Zelios-archetype differentiators
4. **Beats 1, 3, 4, 6, 7, 11** — fill in the rest

## 📋 Remotion audio layering (after Claude Design renders)

1. Drop MP4 onto video timeline
2. Layer Track 4 music underneath, starting 0:00 (no offset)
3. For each voice clip (Vera, Sarah, Marcus): place at absolute timecode per audio cue tables above
4. Layer SFX at absolute timecodes
5. Apply -3dB duck on music during Vera clips (Beats 3, 4, 7)
6. Final fade in last 1.5s of Beat 12
7. Export 1080p H.264 MP4

## 📋 CapCut polish pass

1. Colour pass: warm cream surfaces slightly if they read cold (target ~Pantone 9043 C)
2. Caption pass: SubMagic-style captions on Vera/Sarah/Marcus diegetic moments (accessibility + silent-scroll)
3. Final music tail: smooth fade in last 1-2s
4. Phone test: check legibility at 360px wide (Devpost mobile preview)

---

*Generated from `docs/demo-video-script-v4.md` (locked 2026-05-19), simplified for design-system-aware Claude Design rendering. All assets reference `docs/demo-stills/` and `public/audio/`. Repo: `D:/Projects/vouch/`.*
