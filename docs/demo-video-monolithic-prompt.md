# Vouch demo video — monolithic Claude Design prompt (all 12 beats, single render)

**Use this instead of `demo-video-claude-design-prompts.md` if rendering the entire 65-second video as one Claude Design project.**

**Why monolithic:** lets Claude see the full timeline so beat-to-beat transitions flow correctly (Beat 5 → Beat 6 cream continuity, etc.) instead of every beat self-terminating in black.

**Project setup in Claude Design:**
- New prototype named **"Vouch Demo Video (full render)"**
- Hi-fidelity, interactive prototype
- Apply published Vouch Design System
- Upload all assets listed below
- Paste the prompt block (everything between the BEGIN/END markers)

---

## Assets to upload (36 files from `docs/demo-stills/`)

### Act 1
- `b1-ebay-no-button.png`
- `b1-ebay-with-button.png`
- `b1-button-only.png`
- `b1-tagline-on-time.png`
- `b3-new-q1-prefilled.png`
- `b3-new-q4-vera-speaking.png`
- `b3-captured-strip-empty.png`
- `b3-captured-strip-full.png`
- `b3-captured-card-item.png`
- `b3-captured-card-seller.png`
- `b3-captured-card-amount.png`
- `b3-captured-card-delivery.png`
- `b4-marcus-avatar-warsaw.png`
- `b4-polish-text.png`
- `b4-english-text.png`
- `b4-seller-preflight.png`
- `b4-seller-vera-reading.png`
- `b4-i-agree-button-default.png`
- `b4-i-agree-button-tapped.png`
- `b5-pill-awaiting-seller.png`
- `b5-pill-agreed.png`
- `b5-pill-in-escrow.png`
- `b7-parcel-arrived.jpg`
- `b7-signoff-in-escrow.png`
- `b8-pill-released.png`
- `b8-signoff-released.png`

### Act 2
- `b9-cracked-iphone.jpg`
- `b10-replay-card.png`
- `b10-evidence-card.png`
- `b10-cards-stacked.png`
- `b11-verdict-card.png`
- `b11-pill-refunded.png`
- `b11-sarah-avatar.png`

### Brand close
- `b12-vouch-wordmark.png`
- `b12-vouch-wordmark-light.png`
- `b12-tagline-lockup.png`

---

## BEGIN MONOLITHIC PROMPT — paste everything below this line

Render the full Vouch demo video as a single continuous 65-second scene at 1920×1080, 30fps. The video has TWO ACTS separated by a HARD CUT TO BLACK at exactly 0:47.000. All timing below is absolute (relative to scene start, not beat start). Apply the Vouch Design System throughout — cream surfaces, indigo accents, Fraunces + Inter + JetBrains Mono, semantic status colours. Master easing: cubic-bezier(0.22, 1, 0.36, 1) (easeOutQuart). No bouncy springs.

**Critical transition rules (applies throughout):**
- Beats that share the same canvas (cream-to-cream, dark-to-dark) flow continuously — do NOT fade to black or wipe between them. Each scene's final frame is the next scene's first frame.
- Only TWO hard cuts to black exist in the entire video: the music drop at 0:47 (between Act 1 and Act 2) and the final video end at 1:05.
- Cream-to-dark transitions (only at 0:47 and 1:02) use the hard cut or radial wipe specified in the relevant beat.

---

### Beat 1 — Hook (0:00–0:05) · dark canvas

**Assets used:** `b1-ebay-no-button.png`, `b1-ebay-with-button.png`, `b1-button-only.png`

Open on dark canvas `#0c0c14`. From 0:00–0:01.5, reveal the tagline "Receive your money, on time." word-by-word — each word fades up `y=24 → 0, opacity=0 → 1` with 120ms stagger, 400ms transition. "on time." is in italic Fraunces with linear indigo gradient text-fill. First word "Receive" lands on the music kick at 0:01.

From 0:01.5–0:02, cream surface `#f6f5f2` wipes up from below via clip-path inset `inset(100% 0 0 0) → inset(0)`, 400ms, masking the dark tagline.

From 0:02–0:03, cross-fade in `b1-ebay-no-button.png` full-bleed on the cream. Hold 1s.

From 0:03–0:03.4, cross-dissolve to `b1-ebay-with-button.png`. The Pay with Vouch button slides in from the right (`x: 100 → 0, opacity: 0 → 1`), 400ms.

From 0:03.4–0:03.6, button single scale-pulse `1 → 1.06 → 1`, 200ms, with soft indigo halo (`box-shadow: 0 0 24px 6px rgba(99,91,255,0.35)`) ramping in/out.

From 0:04–0:04.5, cursor enters from bottom-right on a quadratic Bézier curve, terminates on the button at 0:04.4. Button shows pressed state at 0:04.5 (`scale: 0.98`, darker fill).

From 0:04.5–0:05.0, radial cream wipe expands from the button outward (`clip-path: circle(0% → 150%)`), 400ms. **No black fade — wipe completes ON cream.**

---

### Beat 2 — Brand reveal (0:05–0:09) · cream canvas

**Assets used:** `b12-vouch-wordmark-light.png`

Continuous from Beat 1's cream surface. From 0:05–0:06, radial bloom completes (`clip-path: circle(150%)` already set; cream holds 400ms).

At 0:06 (music downbeat), the Vouch wordmark `b12-vouch-wordmark-light.png` scale-ins centred: `scale: 0 → 1.06 → 1`, opacity `0 → 1`, total 500ms with overshoot at 70% timeline.

From 0:06.5–0:08.5, below the wordmark render a mono tagline "Receive your money, on time." (opacity 0 → 0.7, 400ms fade). Around the wordmark, the Vera waveform indicator (design system component) — 3 indigo bars, breathing scale `1 → 1.15 → 1` on 1.4s loop.

From 0:08.5–0:09, hold the composition. **No fade-out — directly cross-fade into Beat 3.**

---

### Beat 3 — Vera buyer intake (0:09–0:18) · cream canvas

**Assets used:** `b3-new-q4-vera-speaking.png`, `b3-captured-card-item.png`, `b3-captured-card-seller.png`, `b3-captured-card-amount.png`, `b3-captured-card-delivery.png`

200ms cross-fade from Beat 2's wordmark composition into `b3-new-q4-vera-speaking.png` full-frame. The /new page sits with Vera question card top, captured-summary strip on the right.

From 0:10–0:11.5, Vera waveform indicator inside the question card pulses (active speaking variant, higher amplitude). This syncs to Vera's audio (added later in Remotion).

From 0:11.5–0:12.5, waveform character changes to Sarah's voice (warmer, 4 bars, smaller amplitude). Pulses 1s.

From 0:12.5–0:17, four captured-term cards fly into the right-side strip, one per second:
- 0:12.5 — `b3-captured-card-item.png` slides in (`x: 200 → 0, opacity: 0 → 1`, 450ms)
- 0:13.5 — `b3-captured-card-seller.png`
- 0:14.5 — `b3-captured-card-amount.png`
- 0:15.5 — `b3-captured-card-delivery.png`

On each arrival, briefly highlight the row background (indigo wash 10% opacity, fade out over 200ms).

From 0:17–0:18, hold the composition. Vera waveform fades to ambient breathing.

**Transition out (0:18):** Whip-pan right `translateX(-100%)`, 250ms easeInOut, with 30px motion blur only during the move. **Continuous motion into Beat 4 — no fade.**

---

### Beat 4 — Multilingual seller agreement (0:18–0:28) · cream canvas ⭐ HERO

**Assets used:** `b4-seller-vera-reading.png`, `b4-marcus-avatar-warsaw.png`, `b4-polish-text.png`, `b4-english-text.png`, `b4-i-agree-button-default.png`, `b4-i-agree-button-tapped.png`

After the whip-pan, `b4-seller-vera-reading.png` sits left-of-centre with 3D perspective tilt: `perspective(2000px) rotateY(7deg) rotateX(2deg)`. Trust-blue radial halo behind it.

From 0:19–0:19.5, `b4-marcus-avatar-warsaw.png` slides into top-right (`opacity: 0 → 1, y: 20 → 0`, 400ms).

From 0:19.5–0:22, Vera Polish audio plays. Vera waveform pulses inside the tilted seller page.

From 0:22–0:23, below Marcus's avatar, `b4-polish-text.png` ("Zgadzam się.") types in letter-by-letter (30ms per character).

From 0:23–0:23.8, hold Polish text. Marcus's diegetic voice plays.

**0:23.8–0:24.8 — HERO MOMENT — letter-by-letter morph from Polish to English.** Each character of "Zgadzam się." fades out with 30ms left-to-right stagger (total 0.6s). Each character of "I agree." fades IN with the same 30ms stagger, starting 0.2s after the Polish-out begins (overlap). Same monospace font + same size — only the characters change. At 0:24.8 only "I agree." is visible.

From 0:24.8–0:26, `b4-i-agree-button-default.png` enters from below (`y: 40 → 0, opacity: 0 → 1`, 400ms). Pulses subtly `scale: 1 → 1.04 → 1`, 250ms on 800ms interval.

From 0:26–0:26.5, cursor enters from right, approaches the button. At 0:26.5, swap to `b4-i-agree-button-tapped.png` (pressed + glow).

From 0:26.5–0:27, single-frame freeze for 80ms emphasis. Radial lock-prep wipe expands from button outward (`clip-path: circle(0% → 30%)`).

From 0:27–0:28, the radial wipe deepens, cream dims slightly. **Directly continues into Beat 5 — no fade.**

---

### Beat 5 — Money locks in escrow (0:28–0:33) · cream canvas ⭐ ACT 1 HERO

**Assets used:** `b5-pill-awaiting-seller.png`, `b5-pill-agreed.png`, `b5-pill-in-escrow.png`

**Peak motion MUST land on the drum hit at 0:28.7.**

From 0:28–0:28.4, a pile of £400 (4-5 layered indigo+cream banknote rectangles, slight tilt) slides into centre-frame from offstage left, 400ms.

From 0:28.4–0:28.55, stylised SVG vault appears centre-frame (rounded square, concentric rings, brushed-steel grey outline). Shutter at 90° open. 150ms via opacity + slight scale-in.

From 0:28.55–0:28.7, money compresses inward toward the vault (`scale: 1 → 0.6`), 150ms. Reads as being sucked in.

**At 0:28.7 — DRUM HIT.** Single-frame keyframe: vault snaps shut, shutter rotates 90° → 0° instantly. Vault icon scale jolts `1 → 1.08 → 1` in 2 frames. NO intermediate animation.

From 0:28.7–0:28.78, screen shake on entire composition: `translate(±3px, ±1.5px)` using `Math.sin(frame * 8)` for 2-3 frames (80ms).

From 0:28.78–0:29.2, three concentric pulse rings emanate from vault centre, 120ms stagger. Each: `scale: 0 → 1, opacity: 0.4 → 0`, 400ms. Indigo, 1.5px stroke.

From 0:29–0:30.5, status pill cascade bottom-right, three pills cross-fading:
- 0:29 — `b5-pill-awaiting-seller.png` appears (`scale: 0.9 → 1, opacity: 0 → 1`, 300ms)
- 0:29.4 — cross-fade to `b5-pill-agreed.png`
- 0:29.8 — cross-fade to `b5-pill-in-escrow.png` (MONEY HELD — keep pulsing dot)

From 0:29–0:31, below vault, mono tagline "receive your money, on time." (lowercase, italic gradient on "on time.") types word-by-word, 80ms stagger.

From 0:31–0:33, hold composition. Vault centred, indigo MONEY HELD pill at bottom-right pulsing. Ambient breathing on vault (`scale: 1 → 1.005 → 1`, 1.4s loop).

**Transition out (0:33):** Radial cream wipe from vault centre outward (`clip-path: circle(0% → 150%)`), 350ms easeInOut. **The wipe expands cream onto cream — NO fade to black.** Continuous cream into Beat 6.

---

### Beat 6 — Time skip (0:33–0:37) · cream canvas

**Assets used:** none — pure typography + abstract calendar pages rendered from design system Card component

Continuous cream from Beat 5. From 0:33–0:34, render 6 stylised calendar pages stacked centre-frame at slight angles (±2°). Each is a design-system Card (180×220px) with a Fraunces semibold date number (56px) top-centred: 21, 22, 23, 24, 25, 26.

From 0:34–0:36, pages flip forward one at a time, 80ms apart. Each flip: `rotate3d(1, 0, 0, 0° → 90° → 0°)` + `scale: 1 → 0.95 → 1` + `opacity: 0.7 → 1`. Front page changes per flip. ~2s total cascade with overlap.

From 0:34.5–0:36, bottom-left day counter ticks "Day 1" → "Day 5" via key-change with `popLayout`. Lands "Day 5" at 0:36.

From 0:36–0:37, subtitle types in below the calendar stack: **"5 days later."** in italic Fraunces (32px), word-by-word, 200ms each, 400ms total. Holds 1s.

**Transition out (0:37):** Cross-dissolve to Beat 7's signoff page. Cream continues. **NO fade to black.**

---

### Beat 7 — Receipt prompt (0:37–0:42) · cream canvas

**Assets used:** `b7-signoff-in-escrow.png`, `b7-parcel-arrived.jpg`

Continuous cream. `b7-signoff-in-escrow.png` is the main stage, positioned slightly right of centre, perspective-tilted `perspective(2000px) rotateY(-5deg)` (mirror of Beat 4's angle).

From 0:37–0:38.5, Vera waveform indicator pulses inside the Sarah voice CTA on the signoff card.

From 0:38–0:39, `b7-parcel-arrived.jpg` slides in from off-screen-bottom, 600ms. Lands slightly left of the signoff card, rotated ~-8° (set-down-naturally angle), soft drop shadow.

From 0:39–0:39.5, Sarah's voice plays. Reactive 4-bar waveform animates inside the signoff card (~500ms higher-amplitude window).

From 0:39.5–0:41, **checkmark BEGINS to form on top of the signoff card. SVG path `pathLength: 0 → 0.4`, 1.5s. PARTIAL DRAW ONLY — completes in Beat 8.**

From 0:41–0:42, hold composition. Parcel next to signoff card, partial checkmark forming. Indigo glow ramps behind the checkmark (`box-shadow: 0 0 24px rgba(82, 102, 235, 0.4)`, opacity 0 → 1 over 1s).

**No transition — continuous motion into Beat 8. The forming checkmark from Beat 7 feeds DIRECTLY into Beat 8's hero tick as the same animation continuing.**

---

### Beat 8 — Release payoff (0:42–0:47) · cream canvas ⭐ ACT 1 PAYOFF

**Assets used:** `b8-pill-released.png`, `b4-marcus-avatar-warsaw.png` (Marcus receiving money), `b1-tagline-on-time.png` (tagline reference)

**HARD CUT TO BLACK at exactly 0:47.000 — the music drop.**

From 0:42–0:43, complete the partial checkmark from Beat 7: `pathLength: 0.4 → 1.0`, 500ms. Single pulse ring fires from the checkmark centre on completion (`scale: 0 → 1, opacity: 0.6 → 0`, 400ms).

From 0:43–0:43.4, hero tick scale-in: large success-green checkmark on a white circle (120px diameter, semantic success color) appears centre-frame. `scale: 0 → 1.15 → 1`, 350ms, single concentric ring pulse on the overshoot.

From 0:43.4–0:44.4, `£0` counter appears below the tick. Ticks UP £0 → £609.89 over 700ms, per-digit increment animation. Fraunces semibold, 64px.

From 0:43.4–0:45.4, simultaneously, money slides from vault position (off-screen left) to Marcus's avatar (off-screen right) via SVG motion path. `offsetPath` + `offsetDistance: 0% → 100%`, 1.2s easeInOut. Marcus's avatar `b4-marcus-avatar-warsaw.png` enters from the right at 0:44 at the path's endpoint.

From 0:44.4–0:45.2, money lands on Marcus. Avatar gets a `1` badge top-right + 200ms pulse ring (`scale: 1 → 1.04 → 1`).

From 0:45.2–0:46, bottom third of frame, tagline "Receive your money, on time." appears word-by-word (italic gradient on "on time."), 120ms between words. Final word "time." lands at 0:46.97.

At 0:46.97, `b8-pill-released.png` cross-fades in next to the tagline.

**At 0:47.000 — HARD CUT TO BLACK** (single frame, no fade). Music drops simultaneously.

---

## ⬇ ACT BREAK — HARD CUT TO BLACK at 0:47 ⬇

---

### Beat 9 — Dispute opens (0:47–0:52) · dark canvas

**Assets used:** `b9-cracked-iphone.jpg`

From 0:47–0:47.3, pure black hold (9 frames at 30fps). Music sub-bass impact at 0:47.3.

From 0:47.3–0:47.7, `b9-cracked-iphone.jpg` fades up from black (`opacity: 0 → 1`, 400ms easeOutQuart). Ken Burns micro-zoom `scale: 1.05 → 1.0` same window.

From 0:47.7–0:48, hold the photo. No motion.

From 0:48–0:48.8, lower-third tagline "Every deal, kept." types word-by-word, 4 words × 200ms stagger. Italic indigo→stripe-purple gradient on "kept." 800ms total.

From 0:48.8–0:52, hold composition 3.2s. Photo breathes subtly (`scale: 1 → 1.01 → 1`, 2s loop, almost imperceptible). **NO additional decoration.**

**Transition out (0:52):** 300ms cross-dissolve directly into Beat 10's cards. The cracked phone fades out as Beat 10's cards slide in. **Cream surface returns under the dissolve.**

---

### Beat 10 — Vera replays original promise (0:52–0:57) · cream canvas ⭐ MOAT

**Assets used:** `b10-replay-card.png`, `b10-evidence-card.png`

From 0:52–0:52.6, both cards enter staggered. TOP card (`b10-replay-card.png`) slides from above (`y: -200 → centre, opacity: 0 → 1`), 600ms easeOutQuart. BOTTOM card (`b10-evidence-card.png`) slides from below 120ms later, same duration. Both land centred horizontally, stacked with 60px gap.

From 0:52.6–0:53.5, hold. TOP card has indigo accent border (active). BOTTOM has neutral warm border (subdued).

From 0:53.5–0:54.5, Marcus's diegetic audio plays. On the TOP card's waveform, animate the bar positioned where "scratches" lands — `scale: 1 → 1.6 → 1` over 300ms with peak at 0:54 (synced to the word). Concentric pulse ring from that bar (`scale: 0 → 1, opacity: 0.6 → 0`, 400ms).

From 0:53.8–0:54, background highlight pill draws behind "no scratches" text — clipPath wipe left-to-right (`inset(0 100% 0 0) → inset(0)`), 200ms. Warning-soft semantic color. Stays visible for rest of beat.

From 0:54.5–0:56, BOTTOM card border ramps neutral warm → indigo accent over 400ms. Once at indigo, breathe (`opacity: 1 → 0.7 → 1`, 1.4s loop).

From 0:56–0:57, hold. Both cards in their highlighted states.

**Transition out (0:57):** Both cards collapse + merge centre via FLIP (`scale: 0.85, opacity: 0.6`), 400ms easeInOut, cross-fade to Beat 11. **Cream continues.**

---

### Beat 11 — Verdict + refund (0:57–1:02) · cream canvas

**Assets used:** `b11-verdict-card.png`, `b11-pill-refunded.png`, `b11-sarah-avatar.png`, `b12-tagline-lockup.png`

Cream background with subtle top-centred indigo radial glow (`radial-gradient(ellipse 60% 40% at 50% 30%, rgba(82, 102, 235, 0.10) 0%, transparent 70%)`).

From 0:57–0:57.6, `b11-verdict-card.png` slides up into centre (`y: 100 → 0, scale: 0.96 → 1, opacity: 0 → 1`), 500ms. Glassmorphism: `backdrop-filter: blur(22px) saturate(170%)`, white-translucent surface (`rgba(255,255,255,0.65)`).

From 0:58–0:58.4, card heading "Refund to Sarah." reveals word-by-word (80ms stagger). "Sarah" in italic indigo.

From 0:59–1:00.2, below the card, money reversal. £-symbol cluster slides BACK from Marcus's position (off-screen right) toward Sarah (off-screen left) via REVERSE of Beat 8's motion path. `offsetPath` + `offsetDistance: 0% → 100%` along reversed path, 1.2s easeInOut.

From 0:59–0:59.8, £-amount counter beneath verdict card ticks DOWN £609.89 → £0 over 800ms.

At 1:00.5, `b11-pill-refunded.png` cross-fades in next to the counter (now £0), 300ms.

From 1:01–1:01.3, Sarah's avatar (`b11-sarah-avatar.png`) at money's destination does micro-bounce `scale: 1 → 1.06 → 1`, 250ms, no spring.

From 1:01.3–1:02, hold. Verdict card centred-top, Sarah's avatar left with REFUNDED pill. Below, `b12-tagline-lockup.png` ("Every deal, kept.") cross-fades in as closing anchor.

**Transition out (1:02):** Cross-fade from cream into Beat 12's dark canvas — cream surface fades to black over 400ms, wordmark of Beat 12 emerges from the resulting darkness.

---

### Beat 12 — Brand close (1:02–1:05) · dark canvas

**Assets used:** `b12-vouch-wordmark.png`

Dark canvas `#0c0c14`. From 1:02–1:03, `b12-vouch-wordmark.png` scale-ins centre-frame: `scale: 0.92 → 1`, **1.5s** easeOutQuart. Opacity `0 → 1` over 1.0s. **DELIBERATELY SLOW.**

At 1:02.5, wordmark fully visible.

From 1:02.5–1:04.5, beneath the wordmark, Vera waveform indicator pulses gently (ambient variant, breathing 1.4s loop).

From 1:03.5–1:04.7, brand line types in below the waveform, mono, per-word 200ms: **"Trust the handshake. Hold the money."** Final word at 1:04.7. Light grey `rgba(255,255,255,0.7)`.

From 1:04.7–1:05, hold composition. 300ms breath.

**At 1:05.000 — cut to black. End of video.**

---

## End of monolithic prompt — paste everything above the BEGIN MONOLITHIC PROMPT marker

---

## Practical notes for execution

**Render expectation:** This is a complex 65-second scene. Expect Claude Design to take longer than a single-beat render — potentially 5-10 minutes of "Shelling" + generation. Don't refresh.

**If it fails mid-render:** You have Beats 5 and 9 saved as standalone HTML. Worst case, do beats 1-4, 6-8, 10-12 in a smaller monolithic project (~10 beats) and stitch the existing two into CapCut.

**Audio strategy unchanged:** Claude will produce a silent (or with embedded Web Audio thuds) MP4. Mute browser tab BEFORE screen-recording. Layer all music + voice + SFX in Remotion using the per-beat audio cue tables from `demo-video-claude-design-prompts.md`.

**The two HARD CUTS to black are at 0:47 (music drop) and 1:05 (video end).** Everything else is continuous on whichever canvas it occupies (cream or dark).

---

*Generated 2026-05-21. Based on `docs/demo-video-script-v4.md` + `docs/demo-video-claude-design-prompts.md`. Use this for single-project rendering. Per-beat prompts remain valid as fallback.*
