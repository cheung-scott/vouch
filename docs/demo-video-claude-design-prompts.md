# Vouch demo video — Claude Design prompt pack

**Pipeline:**
1. **Claude Design** renders each beat as a silent MP4 scene from the prompts below
2. **Remotion** layers audio (voice clips, SFX, music) over the assembled scenes per the audio cue tables
3. **CapCut** polishes — final colour pass, music fade tail, captions if needed

**Source of truth:** `docs/demo-video-script-v4.md` (narrative + motion + audio decisions, locked 2026-05-19). This file is the operational handoff — each beat's prompt is self-contained and pastes directly into Claude Design.

**Master rules baked into every prompt:**
- 1920×1080, 30fps
- Master easing: `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuart) — "smooth-snappy"
- Default durations: 500ms text reveals, 700ms UI motion, 800ms morphs
- No bouncy springs (toy-like on fintech UI)
- Brand colours: cream `#f6f5f2`, ink `#2a2924`, indigo `#5266eb` / `#635bff`, warning soft `#b54a3a`, success `#2f7d57`
- Fonts: Fraunces (display, semibold), Inter (body), JetBrains Mono (eyebrows/captions)

**Asset library:** all stills live in `docs/demo-stills/`. Filenames in each prompt reference this folder.

**Audio assets:** layered in Remotion AFTER Claude Design renders. See audio cue tables per beat.

---

## 🎬 ACT 1 — Happy Path (0:00–0:47)

### Beat 1 — Hook + Chrome extension entry (0:00–0:05) · 5s

**Music:** Intro stab (0:00) → kick lands at 0:01 → groove begins at 0:01–0:05.
**Audio (Remotion):** Music only. Cursor click SFX on the button tap at ~0:04.

**Stills to upload:**
- `b1-tagline-on-time.png` — "Receive your money, on time." dark BG, italic gradient on "on time"
- `b1-ebay-no-button.png` — eBay 512GB listing baseline state
- `b1-ebay-with-button.png` — same listing with the Pay with Vouch button injected
- `b1-button-only.png` — Pay with Vouch button isolated (for the glow pulse close-up)

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps.
>
> **0:00–0:01.5** — Dark background `#0c0c14`. Stagger-reveal the tagline "Receive your money, on time." word-by-word, each word fades up from `y=24, opacity=0` to `y=0, opacity=1` with 120ms delay between words, each word's transition is 400ms easeOutQuart `cubic-bezier(0.22, 1, 0.36, 1)`. The phrase "on time." is in italic with a linear-gradient text fill (`#7a6ce8` → `#b3a8f3`). Letter spacing tightens slightly during the reveal (`0em` → `-0.025em`). The word "Receive" lands precisely on the kick at 0:01.
>
> **0:01.5–0:02** — Cream surface `#f6f5f2` wipes up from the bottom of the frame via clip-path inset (`inset(100% 0 0 0)` → `inset(0)`), 400ms easeOutQuart. The tagline holds visible for the wipe duration, then is masked out as the cream covers it.
>
> **0:02–0:03** — Cross-fade reveals the eBay listing screenshot (`b1-ebay-no-button.png`) full-bleed in the cream surface. Hold 1s.
>
> **0:03–0:03.4** — Cross-dissolve to `b1-ebay-with-button.png` (same listing, with the indigo Pay with Vouch button injected next to Buy It Now). The button slides in from the right (`x: 100 → 0, opacity: 0 → 1`) over 400ms easeOutQuart.
>
> **0:03.4–0:03.6** — Button does a single scale pulse glow: `scale: 1 → 1.06 → 1`, 200ms, no spring. Add a soft indigo halo behind it (`box-shadow: 0 0 24px 6px rgba(99,91,255,0.35)`) that fades in and out with the pulse.
>
> **0:04–0:04.5** — A cursor (default macOS arrow) animates in from the bottom-right corner along a quadratic Bézier curve, terminating on the Pay with Vouch button at 0:04.4. The button shows a pressed state at 0:04.5 (slight scale down to 0.98 + brief darker fill).
>
> **0:04.5–0:05.0** — A cream radial wipe expands from the button outward (clip-path circle 0% → 150% from button center), 400ms easeOutQuart, masking the page into a clean cream surface for Beat 2.
>
> Style notes: NO confetti, NO sparkle, NO bouncy springs. The motion is confident and minimal. The cursor path should look natural (slight curve, gentle decel into the button).

---

### Beat 2 — Solution intro + product reveal (0:05–0:09) · 4s

**Music:** Groove begins. Logo lands on the downbeat at 0:06.
**Audio (Remotion):** Music + soft UI tick on wordmark land. No voice.

**Stills to upload:**
- `b12-vouch-wordmark-light.png` — Vouch wordmark on cream (indigo dot + Fraunces wordmark)

**Claude Design prompt:**

> Render a 4-second 1920×1080 scene at 30fps. Cream background `#f6f5f2` throughout.
>
> **0:00–0:01** — A radial bloom expands from the centre — clip-path `circle(0% at 50% 50%)` → `circle(150% at 50% 50%)` over 600ms easeOutQuart, transitioning from the previous beat's white-flash into the cream surface. Hold cream for 400ms.
>
> **0:01–0:01.5** — Centre the Vouch wordmark (`b12-vouch-wordmark-light.png`) — the small indigo circle with white pulsing dot, followed by the Fraunces "Vouch" wordmark. Scale-in keyframes: `scale: 0 → 1.06 → 1`, opacity `0 → 1`. Total duration 500ms easeOutQuart with the overshoot at 70% of the timeline. The wordmark should land at exactly 0:06 of the overall video (i.e. 0:01 in this scene) — that's the music downbeat.
>
> **0:01.5–0:03.5** — Under the wordmark, a small monospace tagline "Receive your money, on time." fades in (opacity 0 → 0.7, 400ms). Around the wordmark add three subtle indigo waveform bars (22px tall, 4px wide, 6px apart) that breathe gently — vertical scale 1 → 1.15 → 1 on a 1.4s loop. This is the "Vera is here" ambient signature.
>
> **0:03.5–0:04** — Hold the composition stable. Background stays cream, wordmark stays centred. This is the breath before Beat 3 cross-fades in.
>
> Style notes: This is a hero brand moment — slow, confident, no flourish. The scale overshoot should be subtle (1.06, not 1.15). Don't add a CTA button. Don't animate the wordmark's individual letters.

---

### Beat 3 — Vera buyer intake (0:09–0:18) · 9s

**Music:** First main groove. Ducks -3dB during voice. Captured-field chimes on off-beats.
**Audio (Remotion):**
- Vera: `beat-3-q4-tight.mp3` — *"When do you expect it to arrive by?"* (~1.5s) — plays at 0:09.5
- Sarah: `sarah-delivery-expressive-1.mp3` — *"By Friday."* (~1s) — plays at 0:11.5
- 4 soft captured-field chimes on off-beats between 0:13–0:17 (one per card)

**Stills to upload:**
- `b3-new-q4-vera-speaking.png` — /new page at Q4 with Vera card visible, captured strip on right
- `b3-captured-strip-empty.png` — captured-so-far strip in empty state
- `b3-captured-card-item.png` — single card: "What you're buying · Apple iPhone 15 Pro Max 512GB Blue Titanium"
- `b3-captured-card-seller.png` — single card: "The other party · Marcus"
- `b3-captured-card-amount.png` — single card: "Amount + currency · £609.89"
- `b3-captured-card-delivery.png` — single card: "Expected by · By Friday"

**Claude Design prompt:**

> Render a 9-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background.
>
> **0:00–0:01** — Cross-fade in `b3-new-q4-vera-speaking.png` as the full-frame stage. The /new page sits left-aligned with the Vera question card visible at the top and the captured strip on the right.
>
> **0:01–0:02.5** — Pulsing indigo waveform animates inside the Vera card (3 vertical bars, vertical scale `1 → 1.4 → 1` on 600ms loop) to signal Vera is speaking. This must sync with the Vera audio that plays from 0:00.5–0:02 of this scene (mapped to 0:09.5 of the overall video).
>
> **0:02.5–0:03.5** — Waveform changes character — the bars become Sarah's voice (warmer, smaller amplitude, 4 bars). She replies "By Friday." Waveform pulses gently during this 1s window.
>
> **0:03.5–0:08** — Four captured-term cards fly into the captured-so-far strip on the right, ONE AT A TIME, 1s apart. Each card slides in from the right (`x: 200 → 0, opacity: 0 → 1`), 450ms easeOutQuart. Order of arrival:
> - 0:03.5 — `b3-captured-card-item.png` slides into row 1 (replacing the empty row "—")
> - 0:04.5 — `b3-captured-card-seller.png` slides into row 2
> - 0:05.5 — `b3-captured-card-amount.png` slides into row 3
> - 0:06.5 — `b3-captured-card-delivery.png` slides into row 4 (the row Vera just captured)
>
> Each card lands with a soft chime SFX (added in Remotion). Each new card's arrival also briefly highlights its row background (`backgroundColor: rgba(82, 102, 235, 0.10)` for 200ms then fades).
>
> **0:08–0:09** — Hold the full captured-strip composition. The whole right panel now shows 4 filled rows + 1 empty ("Anything else · —"). The Vera waveform fades to idle.
>
> Style notes: This is the "Vera captures the deal" moment — feels effortless, magical. NO confetti on card arrivals. The chimes carry the emotional weight; visuals stay clean.
>
> **Transition out:** Whip-pan to the right by `translateX(-100%)` over 250ms easeInOut + 30px motion blur (only during the move) — this transitions to Marcus's view in Beat 4.

---

### Beat 4 — Multilingual seller agreement (0:18–0:28) · 10s ⭐ MULTILINGUAL HERO

**Music:** Sustained groove with intensity rise. Confirm tone on "I agree" tap should land on a snare/clap near 0:27.
**Audio (Remotion):**
- Vera Polish: `beat-4-polish-recital-default.mp3` — *"[confidently] iPhone piętnaście, czterysta funtów, do piątku. Zgadzasz się?"* (~3s) plays from 0:19–0:22
- Marcus: `marcus-zgadzam-balanced.mp3` — *"Zgadzam się."* (~1s) plays at 0:25.5
- Soft confirm tone (UI tick) on button tap at 0:27

**Stills to upload:**
- `b4-marcus-avatar-warsaw.png` — Marcus avatar (indigo circle, "M") with "Warsaw, PL" location tag
- `b4-polish-text.png` — "Zgadzam się." in monospace
- `b4-english-text.png` — "I agree." in monospace
- `b4-seller-vera-reading.png` — seller intake page with Vera reading terms (background context)
- `b4-i-agree-button-default.png` — indigo "I agree →" button default state
- `b4-i-agree-button-tapped.png` — indigo "I agree →" button pressed state with glow

**Claude Design prompt:**

> Render a 10-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background.
>
> **0:00–0:01** — The previous beat's whip-pan completes. Marcus's view of the seller page (`b4-seller-vera-reading.png`) is positioned left-of-centre, tilted slightly via 3D perspective: `perspective(2000px) rotateY(7deg) rotateX(2deg)`. A trust-blue radial halo sits behind it (`radial-gradient(ellipse at 70% 50%, rgba(82,102,235,0.15) 0%, transparent 60%)`).
>
> **0:01–0:01.5** — Marcus's avatar `b4-marcus-avatar-warsaw.png` (circle + "Warsaw, PL" badge) slides into the top-right of the frame, fading in (`opacity: 0 → 1`, `y: 20 → 0`, 400ms easeOutQuart).
>
> **0:01.5–0:04** — Vera reads the terms in Polish (audio plays here). On Marcus's tilted phone screen, animate a 5-bar indigo waveform pulsing to indicate Vera speaking. Hold the composition stable.
>
> **0:04–0:05** — Under Marcus's avatar, the Polish text `b4-polish-text.png` ("Zgadzam się.") types in word-by-word (or letter-by-letter with 30ms per character). Lands fully at 0:05.
>
> **0:05–0:05.8** — Hold the Polish text visible. This is when Marcus's voice clip plays diegetically — the audio carries here, the visual is static.
>
> **0:05.8–0:06.8** — THE HERO MOMENT: Polish text morphs into English text. Use a per-character cross-fade — each character in "Zgadzam się." fades to opacity 0 with a 30ms stagger left-to-right (total 0.6s for the whole phrase), simultaneously each character of "I agree." fades IN with the same 30ms stagger left-to-right (starting 0.2s after the Polish out begins, so they overlap). At 0:06.8, only "I agree." is visible. Total morph window: 0:05.8–0:06.8.
>
> **0:06.8–0:08** — The "I agree" button `b4-i-agree-button-default.png` enters from below Marcus's phone (`y: 40 → 0, opacity: 0 → 1`, 400ms easeOutQuart). Once landed, it pulses subtly (`scale: 1 → 1.04 → 1`, 250ms, repeat on 800ms interval).
>
> **0:08–0:08.5** — Cursor enters from the right edge and approaches the I agree button. At 0:08.5 the button transitions to its tapped state (`b4-i-agree-button-tapped.png` — pressed scale 0.98 + indigo glow box-shadow). A confirm tone plays in Remotion at this moment.
>
> **0:08.5–0:09** — Frame freezes for 80ms after the tap (a single-frame freeze for emphasis, then resumes). A radial lock-prep wipe expands from the I agree button outward (clip-path circle 0% → 30%) — this starts the transition into Beat 5.
>
> **0:09–0:10** — Hold the lock-prep state. Marcus's phone, avatar, and the now-confirmed "I agree" text remain visible, the cream surface dims slightly behind a deepening radial wipe.
>
> Style notes: The Polish→English letter-by-letter morph is the hero animation of the entire demo. Spend frames on it. Make sure both Polish + English use the SAME monospace font at the same size — only the characters change. The 7° Y-rotation on Marcus's phone gives it that floating-product-shot feel without breaking the flat composition.

---

### Beat 5 — Money locks in escrow (0:28–0:33) · 5s ⭐ ACT 1 HERO

**Music:** ⚠ DRUM HIT between 0:28–0:30. Vault snap MUST land on it.
**Audio (Remotion):**
- Music + 🔒 `lock-thunk-v3-take5.mp3` (~150ms) lands at 0:00.7 of this scene (= 0:28.7 of overall video). Most important SFX in the video.
- NO Vera voice.

**Stills to upload:**
- `b5-pill-awaiting-seller.png` — yellow AWAITING SELLER pill
- `b5-pill-agreed.png` — yellow AGREED pill
- `b5-pill-in-escrow.png` — indigo MONEY HELD pill (with pulsing dot)
- `b1-tagline-on-time.png` — Act 1 tagline "Receive your money, on time."

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background. **This beat's peak motion MUST land on the drum hit at 0:00.7 of this scene.**
>
> **0:00–0:00.4** — A pile of £400 (visualised as a tight stack of 4-5 layered banknote rectangles, indigo and cream tones, slight tilt) is positioned centre-frame. It slides into the centre from offstage left, 400ms easeOutQuart. The stack is composed of subtle layered rectangles — no detailed banknote art needed, just shapes that read as "money".
>
> **0:00.4–0:00.55** — A vault appears centre-frame behind the money stack — a stylised SVG vault icon (rounded square with concentric rings, brushed-steel grey `#5a5548` outline on cream). The shutter is at 90° open. 150ms appearance via opacity + slight scale-in.
>
> **0:00.55–0:00.7** — The money stack compresses inward toward the vault (`scale: 1 → 0.6`, 150ms easeOutQuart). The money appears to be sucked into the vault.
>
> **0:00.7** — ⭐ **THE DRUM HIT.** SINGLE FRAME (33ms at 30fps) keyframe: the vault snaps shut. The shutter rotates from 90° → 0° instantly. NO intermediate animation. The vault icon scale jolts from `1 → 1.08 → 1` in 2 frames.
>
> **0:00.7–0:00.78** — Screen shake on the whole composition: `translate(±3px, ±1.5px)` using `Math.sin(frame * 8)` for 2-3 frames (80ms total). This is the "lock thunk" felt visually.
>
> **0:00.78–0:01.2** — Three concentric pulse rings emanate from the vault centre, stagger 120ms apart. Each ring: `scale: 0 → 1, opacity: 0.4 → 0` over 400ms. Rings are indigo `#5266eb` at 1.5px stroke.
>
> **0:01–0:02.5** — Status pill cascade. Bottom-right of frame, three pills appear in sequence, each replacing the previous via cross-fade:
> - 0:01 — `b5-pill-awaiting-seller.png` appears (`scale: 0.9 → 1, opacity: 0 → 1`, 300ms)
> - 0:01.4 — Cross-fades to `b5-pill-agreed.png`
> - 0:01.8 — Cross-fades to `b5-pill-in-escrow.png` (MONEY HELD with pulsing dot — keep the pulse animation looping)
>
> **0:01–0:03** — Under the vault, a monospace tagline "receive your money, on time." (lowercase, small, italic gradient on "on time") types in word-by-word, 80ms stagger. Lands fully at 0:03.
>
> **0:03–0:05** — Hold the composition. Vault sits centre-frame with the indigo MONEY HELD pill at bottom-right pulsing softly. The pulse rings have faded; just the final state remains. Ambient breathing on the vault (subtle scale 1 → 1.005 → 1 over 1.4s loop) to keep the frame alive.
>
> **Transition out (0:05+)** — Cinematic radial wipe from the vault centre outward, expanding cream surface to fill the frame (clip-path circle 0% → 150%), 350ms easeInOut. A whoosh SFX is added in Remotion as the wipe expands.
>
> Style notes: The drum hit at 0:00.7 is the single most important sync point in the entire demo. The vault snap must be 1-2 frames at most (33-66ms) — anything longer feels mushy. The screen shake is subtle but felt (3px max).

---

### Beat 6 — Time skip (0:33–0:37) · 4s

**Music:** Sustained groove. Paper-flip SFX rides without competing.
**Audio (Remotion):** Music + brief tick-tick-tick paper-flip whoosh layered behind. No voice.

**Stills to upload:** None — pure typography + abstract calendar pages.

**Claude Design prompt:**

> Render a 4-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background.
>
> **0:00–0:01** — Cross-fade in from Beat 5's radial wipe. Centre-frame, render 6 stylised calendar pages stacked at slight angles (each rotated ±2° offset). Each page is a cream-card rectangle (180px × 220px) with a thin border (`border: 1px solid rgba(50,30,5,0.10)`) and a date number in Fraunces (semibold, 56px) at top: 21, 22, 23, 24, 25, 26.
>
> **0:01–0:03** — The pages "flip" forward one at a time, 80ms apart. Each flip: `rotate3d(1, 0, 0, 0° → 90° → 0°)` with `scale: 1 → 0.95 → 1` and `opacity: 0.7 → 1`. Front-of-pile page changes as each flips, revealing the next date. Total cascade: 6 flips × 80ms = 480ms, but extend with slight overlap so the whole motion runs ~2s.
>
> **0:01.5–0:03** — A small day-counter widget in the bottom-left of frame ticks from "Day 1" → "Day 5". Use a `<motion.span>` with key-change keyframes + `mode="popLayout"` from Framer Motion — each digit fades out upward as the next fades in from below. Land "Day 5" at 0:03.
>
> **0:03–0:04** — A subtitle types in below the calendar stack: **"5 days later."** in italic Fraunces, 32px, ink `#2a2924`. Word-by-word reveal, 200ms each word, 400ms total. Holds 1s.
>
> Style notes: This is a transition beat — keep it minimal. The calendar pages should feel like physical objects (slight shadow, slight rotation), not flat UI cards. NO calendar grid lines, just the date number front-and-centre. The "5 days later" subtitle is the only verbal element — it's the visual narration.
>
> **Transition out:** Cross-dissolve into Beat 7 (cream stays continuous).

---

### Beat 7 — Item arrived + voice confirm (0:37–0:42) · 5s

**Music:** Energy holds, anticipation building. Soft chime on register at 0:41.
**Audio (Remotion):**
- Vera: `beat-7-receipt-ask-loose.mp3` — *"It's arrived. Does it match?"* (~1.5s) plays at 0:00–0:01.5 of scene
- Sarah: `sarah-yes-expressive-1.mp3` — *"Yes."* (~0.5s) plays at 0:02
- Soft chime on register at 0:04

**Stills to upload:**
- `b7-parcel-arrived.jpg` — iPhone box parcel photo
- `b7-signoff-in-escrow.png` — signoff page in MONEY HELD state (Sarah confirms receipt by voice CTA visible)

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background.
>
> **0:00–0:01** — Cross-fade in from Beat 6. Composition: `b7-signoff-in-escrow.png` is the main stage (positioned slightly right of centre, perspective-tilted at `perspective(2000px) rotateY(-5deg)` — opposite angle to Marcus's phone in Beat 4 so the two scenes feel mirrored).
>
> **0:00–0:01.5** — Vera's audio plays. A 5-bar indigo waveform pulses inside the Sarah voice CTA on the signoff card to indicate Vera speaking. Hold composition stable.
>
> **0:01–0:02** — `b7-parcel-arrived.jpg` (iPhone box) slides in from off-screen-bottom into the frame, 600ms easeOutQuart. It lands slightly left of the signoff card, overlapping it at a natural angle (rotated ~-8°, like it's been set down). Add a soft drop-shadow under the parcel.
>
> **0:02–0:02.5** — Sarah's voice clip plays diegetically (visible only as the waveform). A 4-bar reactive waveform animates briefly inside the signoff card (~500ms active period of higher amplitude).
>
> **0:02.5–0:04** — A checkmark BEGINS to form on top of the signoff card. Use SVG path-drawing: `pathLength: 0 → 0.4` over 1.5s easeOutQuart. The checkmark is PARTIALLY drawn at this point — it completes in Beat 8.
>
> **0:04–0:05** — Hold the composition. Parcel sitting next to the signoff card, partial checkmark forming. Subtle indigo glow building behind the checkmark (`box-shadow: 0 0 24px rgba(82, 102, 235, 0.4)`, ramping opacity 0 → 1 over 1s).
>
> Style notes: The partial checkmark is the cliffhanger — DON'T finish it in this beat. Beat 8 picks up the checkmark animation immediately. The parcel rotation should look "set down naturally", not aligned to any grid.
>
> **Transition out:** Continuous motion into Beat 8 — the forming checkmark feeds directly into the Beat 8 hero tick.

---

### Beat 8 — Tick + money released (0:42–0:47) · 5s ⭐ ACT 1 PAYOFF

**Music:** ⚠ **BUILD INTO THE DROP AT 0:47.** HERO TICK at 0:43–0:44, money slide at 0:45–0:46, tagline lockup at 0:46. HARD CUT to black at exactly frame 1410 (0:47.00).
**Audio (Remotion):**
- Music build crescendos through the beat
- 🔔 `release-bell-v2-take5.mp3` (~400ms) on the hero tick land at 0:01.4 of scene (= 0:43.4 of overall video)
- NO Vera voice

**Stills to upload:**
- `b8-pill-released.png` — green RELEASED status pill
- `b8-signoff-released.png` — signoff page in RELEASED state
- `b4-marcus-avatar-warsaw.png` — Marcus avatar to receive the money
- `b1-tagline-on-time.png` — final tagline lockup ("Receive your money, on time.")

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background. **This beat builds into the music drop at 0:47. The final frame is a HARD CUT to black.**
>
> **0:00–0:01** — Continue from Beat 7's partial checkmark. Complete the checkmark draw: `pathLength: 0.4 → 1.0` over 500ms easeOutQuart. As it completes, fire a single pulse ring from the checkmark centre (`scale: 0 → 1, opacity: 0.6 → 0`, 400ms).
>
> **0:01–0:01.4** — The HERO TICK scale-in: a large green checkmark (`#2f7d57` stroke, 4px, on a white circle background 120px diameter) appears centre-frame. Keyframes: `scale: 0 → 1.15 → 1` over 350ms, with single concentric ring pulse on the overshoot frame.
>
> **0:01.4** — Release-bell SFX lands (added in Remotion). The hero tick holds at full scale.
>
> **0:01.4–0:02.4** — A `£0` counter appears below the tick. It ticks UP from £0 → £400 (or £609.89 to match the deal data) over 700ms easeOutQuart. Use a per-digit increment animation (Framer `animate()`-style). The number is in Fraunces semibold, 64px, ink `#2a2924`.
>
> **0:01.4–0:03.4** — Simultaneously, money slides from the vault position (off-screen left) to Marcus's avatar (off-screen right) via an SVG motion path. The money is a small £-symbol cluster or animated banknote shape that travels along a curved path (`offsetPath` + `offsetDistance: 0% → 100%`, 1.2s easeInOut). Marcus's avatar `b4-marcus-avatar-warsaw.png` enters from the right at 0:02 and is positioned at the path's endpoint.
>
> **0:02.4–0:03.2** — When the money reaches Marcus's avatar, his avatar gets a brief notification chime visual: a small `1` badge appears top-right of his circle, with a 200ms pulse ring around the whole avatar (`scale: 1 → 1.04 → 1`).
>
> **0:03.2–0:04** — In the bottom-third of the frame, the tagline "Receive your money, on time." appears word-by-word (italic gradient on "on time") with 120ms between words. The final word "time." lands at frame 1409 (0:04.97 of scene / 0:46.97 of overall video) — basically the last beat before the hard cut.
>
> **0:04.97** — RELEASED status pill `b8-pill-released.png` cross-fades in next to the tagline.
>
> **0:05.0** — **HARD CUT TO BLACK** (single frame, no fade). This MUST sync to the music drop at 0:47 of the overall video.
>
> Style notes: Marcus's notification chime visual + money slide MUST COMPLETE BEFORE the hard cut. Don't let the music drop interrupt motion mid-arc. The hero tick is the emotional payoff of Act 1 — give it room.

---

## ⬇ MUSIC DROPS — HARD CUT TO BLACK at 0:47 ⬇

## 🎬 ACT 2 — Dispute / safety net (0:47–0:62)

### Beat 9 — Dispute opens (0:47–0:52) · 5s

**Music:** **DROP / BREATH** — sparse, low. Sub-bass impact on image-land at 0:47.3.
**Audio (Remotion):** Music drop carries everything. Single sub-bass impact on image-land. NO voice.

**Stills to upload:**
- `b9-cracked-iphone.jpg` — real photograph of cracked iPhone screen

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps.
>
> **0:00–0:00.3** — Pure black hold. 3 frames of nothing. This is the music drop's breath.
>
> **0:00.3–0:00.7** — `b9-cracked-iphone.jpg` fades up from black: `opacity: 0 → 1` over 400ms easeOutQuart. Simultaneously a subtle Ken Burns micro-zoom: `scale: 1.05 → 1.0` over the same 400ms. A sub-bass SFX is layered in Remotion exactly when opacity hits 1 (at 0:00.7 of scene).
>
> **0:00.7–0:01** — Hold the photo stable. No motion. The cracked screen sits centre-frame, full-bleed if possible, with the concrete texture visible.
>
> **0:01–0:01.8** — Under the photo (or overlaid in the bottom third), the tagline "Every deal, kept." types in word-by-word, 4 words × 200ms stagger, italic gradient on "kept" (gradient from `#5266eb` to `#7a6ce8`). Total reveal duration 800ms.
>
> **0:01.8–0:05** — Hold the composition for 3.2 seconds. The photo breathes subtly (scale 1 → 1.01 → 1 over 2s, almost imperceptible). NO additional decoration — silence + the image is the move.
>
> Style notes: This is the most editorially restrained beat in the entire video. DON'T add particles. DON'T add dust. DON'T add motion. The cracked iPhone alone, in silence, on a music drop, is the entire emotional landing. Trust it.
>
> **Transition out:** Smooth cross-dissolve (300ms) to Beat 10's replay cards.

---

### Beat 10 — Vera replays original promise (0:52–0:57) · 5s ⭐ MOAT ANIMATION OF ACT 2

**Music:** Building back up. Waveform scrub on "scratches" lands precisely on the rebuild moment.
**Audio (Remotion):** Music rebuilding + diegetic Marcus voice clip `marcus-no-scratches-consistent-1.mp3` — *"No scratches, original box."* (~1s) plays at 0:01.5 of scene. NO Vera narration.

**Stills to upload:**
- `b10-replay-card.png` — Vera replay card (TOP) — "Marcus said: 'no scratches, original box.'"
- `b10-evidence-card.png` — Sarah's evidence card (BOTTOM) — cracked phone photo + caption
- `b10-cards-stacked.png` — composed stacked layout (use as reference for final layout)

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background.
>
> **0:00–0:00.6** — Both cards enter from off-screen, staggered. The TOP card (`b10-replay-card.png`) slides in from above (`y: -200 → centre-position, opacity: 0 → 1`), 600ms easeOutQuart. Simultaneously starting 120ms later, the BOTTOM card (`b10-evidence-card.png`) slides in from below (`y: 200 → centre-position, opacity: 0 → 1`), 600ms easeOutQuart. Both cards land centred horizontally, stacked vertically with 60px gap.
>
> **0:00.6–0:01.5** — Hold both cards. The TOP card has an indigo border (highlighted/active). The BOTTOM card has a cream border (subdued).
>
> **0:01.5–0:02.5** — Marcus's diegetic audio plays here ("No scratches, original box."). On the TOP card's waveform, animate bar #4 (the one positioned where "scratches" would be in the audio) — scale `1 → 1.6 → 1` over 300ms with the peak at 0:02 of scene (synced to the word "scratches" in the audio). Add a concentric pulse ring emanating from bar 4 (`scale: 0 → 1, opacity: 0.6 → 0`, 400ms).
>
> **0:01.8–0:02** — Background highlight pill behind the word "no scratches" in the TOP card text — draws in left-to-right via clip-path inset (`inset(0 100% 0 0)` → `inset(0)`), 200ms easeOutQuart. Pill colour: warning-soft `rgba(181,74,58,0.08)` with a subtle border. Stays visible for the rest of the beat.
>
> **0:02.5–0:04** — Bottom card glow ramp-up. The cream border on the bottom card animates from `rgba(50,30,5,0.10)` → `#5266eb` (indigo) over 400ms. Once at indigo, breathe the border opacity (`opacity: 1 → 0.7 → 1` on 1.4s loop) to draw the eye to the evidence.
>
> **0:04–0:05** — Hold both cards in their highlighted states. Marcus's commitment (TOP) + Sarah's evidence (BOTTOM) sit together. This is the moat moment — the product showing its own evidence chain.
>
> Style notes: This is THE differentiator. The diegetic playback of Marcus's actual recorded voice IS the moat. DON'T undersell with weak motion. The waveform pulse must SYNC to the word "scratches" in the audio — this is the most precise sync requirement after Beat 5's drum hit.
>
> **Transition out:** Both cards collapse + merge centre-frame via a FLIP animation — both cards scale down and translate toward the centre point (`scale: 0.85, opacity: 0.6`) over 400ms easeInOut, then the merged composition cross-fades to Beat 11's verdict frame.

---

### Beat 11 — Verdict + refund (0:57–0:62) · 5s

**Music:** Full energy return. Verdict card lands on a music accent. Coin sweep SFX bridges into money reversal.
**Audio (Remotion):**
- Music full energy
- 🔔 `dispute-chime-take3.mp3` (~700ms) on verdict card land at 0:00 of scene
- Coin/cash sweep SFX layered under the money reversal at 0:02 of scene
- NO voice

**Stills to upload:**
- `b11-verdict-card.png` — "Refund to Sarah" verdict card (glassmorphism)
- `b11-pill-refunded.png` — REFUNDED status pill
- `b11-sarah-avatar.png` — Sarah's avatar (cream + cinnamon gradient)
- `b12-tagline-lockup.png` — small "Every deal, kept." anchor underneath

**Claude Design prompt:**

> Render a 5-second 1920×1080 scene at 30fps. Cream `#f6f5f2` background with a subtle indigo radial glow centred top (`radial-gradient(ellipse 60% 40% at 50% 30%, rgba(82, 102, 235, 0.10) 0%, transparent 70%)`).
>
> **0:00–0:00.6** — `b11-verdict-card.png` slides up into the centre of the frame: `y: 100 → 0, scale: 0.96 → 1, opacity: 0 → 1`, 500ms easeOutQuart. The card has glassmorphism: `backdrop-filter: blur(22px) saturate(170%)` on a white-translucent surface (`rgba(255,255,255,0.65)`). Dispute-chime SFX lands at 0:00 in Remotion.
>
> **0:01–0:01.4** — The card's heading "Refund to Sarah." word-by-word reveals (80ms stagger). The word "Sarah" is in italic indigo.
>
> **0:02–0:03.2** — Beneath the verdict card, animate money reversal: a £-symbol cluster slides BACK from Marcus's position (off-screen right) toward Sarah (off-screen left) via the REVERSE of Beat 8's motion path. Use `offsetPath` + `offsetDistance: 0% → 100%` along the reversed path, 1.2s easeInOut. Coin sweep SFX layered in Remotion.
>
> **0:02–0:02.8** — Simultaneously, a £-amount counter beneath the verdict card ticks DOWN from £609.89 → £0 over 800ms.
>
> **0:03.5** — `b11-pill-refunded.png` cross-fades in next to the counter (which is now at £0). 300ms fade.
>
> **0:04–0:04.3** — Sarah's avatar `b11-sarah-avatar.png` (visible at the destination of the money slide) does a micro-bounce: `scale: 1 → 1.06 → 1`, 250ms, no spring. This is the emotional landing — Sarah receives her money back.
>
> **0:04.3–0:05** — Hold the composition. The verdict card stays centred-top, Sarah's avatar on the left with REFUNDED pill nearby. Below, a small tagline `b12-tagline-lockup.png` ("Every deal, kept.") cross-fades in as a closing anchor. Holds 700ms.
>
> Style notes: The glassmorphism on the verdict card is critical — it gives the ruling visual weight without being heavy. The MotionPath reversal of Beat 8's money slide is poetic: the same path that delivered the money to Marcus now returns it to Sarah. This is what the product PROMISED.
>
> **Transition out:** Slight fade (200ms), hold the resolution beat 500ms, then cross-fade to Beat 12.

---

### Beat 12 — Close / brand synthesis (1:02–1:05) · 3s

**Music:** Tail of Track 4 fading naturally. Wordmark lands at 1:02.5 on the last sustained chord.
**Audio (Remotion):** Music fades. NO voice.

**Stills to upload:**
- `b12-vouch-wordmark.png` — Vouch wordmark on dark BG (hero variant)

**Claude Design prompt:**

> Render a 3-second 1920×1080 scene at 30fps. Dark background `#0c0c14` (matches the landing page hero).
>
> **0:00–0:01** — Cross-fade from Beat 11's cream into the dark BG. The Vouch wordmark `b12-vouch-wordmark.png` (indigo dot logo + Fraunces "Vouch" wordmark) scale-ins centre-frame: `scale: 0.92 → 1`, 1.5s easeOutQuart. Opacity `0 → 1` over 1.0s. This is DELIBERATELY SLOW — confidence pace, not energetic.
>
> **0:00.5** — Wordmark fully visible at 100% opacity.
>
> **0:00.5–0:02.5** — Beneath the wordmark, a subtle indigo waveform pulses gently (3 bars, 22-28px tall, breathing scale 1 → 1.1 → 1 on 1.4s loop). This is Vera's ambient signature — saying "we're still here, listening".
>
> **0:01.5–0:02.7** — A brand line types in below the waveform, monospace, per-word 200ms reveal: **"Trust the handshake. Hold the money."** Final word lands at 0:02.7. Light grey colour `rgba(255,255,255,0.7)`, no italics, no flourish.
>
> **0:02.7–0:03** — Hold the wordmark composition. 300ms breath.
>
> **0:03 (end of scene)** — Cut to black. This is the end of the video.
>
> Style notes: Anti-pattern check — DO NOT add a CTA button. The wordmark IS the close. DO NOT animate the individual letters of "Vouch". DO NOT add a fade-out on the wordmark — it cuts to black cleanly. The slow 1.5s scale-in is the confidence move — every other beat snaps, this one breathes.

---

## 📋 Render order recommendation

Per the v4 implementation order, prioritise these in this sequence:

1. **Beat 5** (lock peak) — anchors the entire Act 1 climax around the drum hit
2. **Beat 9** (drop / silence) — hardest editorial, validates the silent thesis
3. **Beats 2, 8, 10, 12** — the four Zelios-archetype beats (the differentiators)
4. **Beats 1, 3, 4, 6, 7, 11** — fill in the rest

## 📋 Remotion audio layering checklist (after Claude Design renders)

For each scene MP4 from Claude Design, in Remotion:

1. Drop the MP4 onto the video timeline
2. Layer Track 4 music underneath, starting at 0:00 (no offset)
3. For each voice clip (Vera, Sarah, Marcus): place at the absolute timecode listed in the audio cue table per beat
4. Layer SFX (lock-thunk, release-bell, dispute-chime, sub-bass impact, coin sweep) at the absolute timecodes
5. Apply -3dB duck on music during Vera voice clips (Beats 3, 4, 7)
6. Final fade-out on music tail in the last 1.5s of Beat 12
7. Export as 1080p H.264 MP4

## 📋 CapCut polish pass (final stage)

1. Colour pass: warm the cream surfaces slightly if they read too cold (target Pantone 9043 C "cream")
2. Caption pass (optional): add SubMagic-style captions to the Vera + Sarah + Marcus diegetic moments for accessibility / silent viewing
3. Final tail: ensure music fade in last 1-2s is smooth
4. Test on phone screen — the demo will be viewed on Devpost / mobile; check legibility at 360px wide

---

*Generated from `docs/demo-video-script-v4.md` (locked 2026-05-19) for Claude Design ingest. All asset paths reference `docs/demo-stills/` and `public/audio/`. Repo: `D:/Projects/vouch/`.*
