# Vouch — Demo Video Script v4 (combined: narrative + motion + audio)

**Length:** 65 seconds (Track 4)
**Music:** Track 4 — `hitslab-product-launch-advertisement-commercial-music-301409.mp3`
**Editorial frame:** Narrated product film. Vera narrates money-movement moments + dispute resolution; Sarah + Marcus appear diegetically. No external narrator.
**Status:** Ready for Day 6 Remotion render. Locked.

This document supersedes:
- `docs/demo-video-script-v3.md` (narrative + audio direction — partially outdated, see deltas below)
- `Vault/Projects/Vouch/Research/Motion-Script-v3-Combined-2026-05-19.md` (motion archetypes + Framer recipes — current)

It bakes in the user's audio-pick decisions made 2026-05-19 evening.

---

## Deltas from v3 (locked decisions)

| Decision | v3 (original) | v4 (locked) | Why |
|---|---|---|---|
| Vera narration scope | 3 clips (Beats 3, 4, 7) | **7 clips (Beats 3, 4, 5, 7, 8, 10, 11)** | Added narration over lock/release/dispute/verdict to anchor money-movement comprehension. Trade-off: shifts from "product film" toward "narrated product film." |
| Beat 4 Polish text | Full recital (~6s, all terms) | **Shortened (~3s, key terms + closing question)** | 17s actual render at contract preset was too long for fast-paced demo |
| Beat 5 audio (lock) | Music + lock-thunk SFX only ("No voice") | **+ Vera: "Four hundred pounds is now locked with Stripe." (~3s)** | Drops "escrow" jargon for lay-audience clarity |
| Beat 8 audio (release) | Music + release-bell SFX only ("No voice") | **+ Vera: "Four hundred pounds is being released to Marcus right now. Thanks for using Vouch." (~4s)** | Anchors the release moment narratively |
| Beat 10 audio (dispute) | Diegetic Marcus "no scratches" ONLY | **Diegetic Marcus + Vera: "Marcus said: 'iPhone 15, no scratches, original box.' That was the deal." (~4s, mediating preset)** | Diegetic Marcus alone risked judges missing the moat moment |
| Beat 11 audio (verdict) | Music + soft chime + coin sweep ("No voice") | **+ Vera: "Ruling: refund to Sarah. Marcus's account flagged for review." (~3s)** | Closing punchline before silent money sweep |
| Motion direction | Reference clips needed per beat | **Zelios archetypes + Framer Motion / Remotion / GSAP recipes per beat** | Day 5 motion synthesis added implementation detail |
| Beat numbering (audio) | Audio file names didn't match script beats | **Standardised** (see Audio file map below) | Three audio files misnumbered in old script |

### Design tension callout

The locked v3 thesis was *"product film, NOT explainer — no external narration. Acts 1 lock/release + Act 2 entirety silent."* v4 adds Vera VO at money-movement moments, which softens the "the product showing its own evidence chain" pitch in Act 2.

**Mitigation in v4:** Vera's lines are tight (≤4s each), conversational not explanatory, and run UNDER the visual action — they don't replace the silence, they texture it. The diegetic Marcus "no scratches" clip still plays in Beat 10; Vera contextualises rather than narrates over it.

If you reverse this decision before render, all Vera Beat 5/8/10/11 clips drop. Visuals + SFX + music + diegetic Marcus carry everything per original v3.

---

## Master rules (from motion-v3)

- **Master ease:** `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuart)
- **Default durations:** 500ms text, 700ms UI, 800ms morph
- **No bouncy springs** on fintech UI (toy-like on escrow per Zelios StoreTrack flag)
- **Single decisive snap, then static** for the lock — no continuous loops on the vault animation
- **Anti-patterns**: bouncy springs on money movements, continuous looping decoration during voice lines, sub-200ms beats stacked back-to-back, animation peaks landing OFF music cues, radial wipes between every beat (Beat 5 ONLY), layout morphs between UI states (cross-fade), fake cursor mimicry that doesn't drive a real interaction

---

## Music skeleton (Track 4)

Verify exact timestamps with `useAudioData()` in Remotion before locking frame numbers.

```
0:00         Intro stab → 0:01 kick lands
0:01–0:05    Groove begins
0:05–0:18    First main groove (Vera buyer intake)
0:18–0:28    Sustained groove + intensity rise (multilingual moment)
0:28         ⚠ DRUM ACCENT — escrow lock peak (CRITICAL sync point)
0:33–0:47    Build into the drop
0:47         ⚠ HARD CUT to black + music drop (structural pivot)
0:47–0:62    Sparse, breathy (dispute beat)
0:62–0:65    Music tail fade (CapCut polishes the final 1–2s)
```

---

## 🎬 ACT 1 — Happy Path (0:00–0:47) · tagline anchor: *"Receive your money, on time."*

### Beat 1 — Hook + Chrome extension entry (0:00–0:05)

| Field | Spec |
|---|---|
| **Music** | Intro stab + kick at 0:01 |
| **Tagline** | *"Receive your money, on time."* — word-by-word reveal, italic gradient on **"on time"** |
| **On-screen** | Real eBay listing (iPhone 15 256GB, £400, seller Marcus). Vouch Chrome extension injects **"Pay with Vouch"** button next to "Buy It Now." Glow + pulse. Sarah's cursor moves toward it. |
| **Audio** | Music only. Cursor click SFX on tap. |
| **Animation** | Stagger word-by-word reveal synced to kick at 0:01. Extension button slides in from right (400ms easeOutQuart), settle, 200ms scale pulse glow. Cursor on quadratic Bézier path, click at 0:04. Cream surface wipe up from below (`clip-path: inset(100% 0 0 0) → inset(0)`, 400ms). |
| **Transition out** | Cream surface wipes up to mask Beat 2 |
| **Zelios archetype** | Stagger word reveal (Slack) + cursor-tap mimicry (LangEase 0:01-1.5) |

```tsx
const words = ["Receive", "your", "money,", "on", "time."];
<motion.h1>
  {words.map((w, i) => (
    <motion.span
      key={i}
      initial={{ y: 24, opacity: 0, letterSpacing: '0em' }}
      animate={{ y: 0, opacity: 1, letterSpacing: '-0.025em' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.12 }}
    >{w} </motion.span>
  ))}
</motion.h1>
```

---

### Beat 2 — Solution intro + product reveal (0:05–0:09)

| Field | Spec |
|---|---|
| **Music** | Groove begins. Logo lands on downbeat at 0:06. |
| **Tagline** | Lingers as secondary line under wordmark (small mono) |
| **On-screen** | Vouch wordmark + Vera waveform indicator. Cream `/new` page partially visible behind. |
| **Audio** | Music + light UI tick on wordmark land. **No voice.** |
| **Animation** | Logo spring scale (`scale: [0, 1.06, 1]`, 500ms) + radial mask BG expansion (`clip-path: circle(0%) → circle(150%)`, 600ms) + Vera waveform pulse (3 bars min, 22-28px inline per DESIGN.md §4) |
| **Transition out** | Cream holds, content cross-fades to Beat 3's `/new` page (200ms crossfade — don't animate layout) |
| **Zelios archetype** | ⭐ LangEase logo reveal — Vouch's clearest signature borrow |

---

### Beat 3 — Vera buyer intake (DIEGETIC DIALOGUE) (0:09–0:18)

| Field | Spec |
|---|---|
| **Music** | First main groove. Ducks -3dB during VO. Captured-field chimes on off-beats (4 chimes — feel them not count them). |
| **Tagline** | (off-screen — captured-terms cards have the slot) |
| **On-screen** | `/new` page (Sarah's flow). Pre-filled from extension: item, price, currency, seller already populated. Sarah only needs to confirm + answer Q4 (delivery) + Q5 (extras). Vera asks Q4 → Sarah's voice waveform animates. Captured term cards fly into right panel. |
| **Audio** | **Vera (mediating):** *"When and how is it being delivered?"* (~1.5s) · **Sarah (real human voice clip):** *"Royal Mail tracked, by Friday."* (~1.5s) · Soft chime per captured field. |
| **Animation** | Reactive voice waveform (Remotion `useAudioData()` + `visualizeAudio()`). Captured terms fly in via `motion.div layoutId` + AnimatePresence, `x: 200 → 0, opacity: 0 → 1`, 450ms easeOutQuart, triggered on Vera's TTS `onTimeUpdate` hitting field-mention timestamps. |
| **Transition out** | Whip-pan to Marcus's view: parent `translateX(-100%)` in 250ms easeInOut + 30px motion blur (only during move) |
| **Zelios archetype** | ⭐ Chaos-to-stack collapse INVERTED (Jobster 0:03) — fields fly INTO order |

---

### Beat 4 — Multilingual seller agreement (DIEGETIC DIALOGUE) (0:18–0:28) ⭐ MULTILINGUAL HERO

| Field | Spec |
|---|---|
| **Music** | Sustained groove with intensity rise. Confirm tone on "I agree" tap should land on a snare/clap near 0:27 if Track 4 has one. |
| **Tagline** | (off-screen — multilingual animation has the slot) |
| **On-screen** | Marcus's view of `/deal/[ref]/seller`. Avatar location tag: **"Marcus · Warsaw, PL"**. Vera reads Sarah's key terms in Polish. Marcus's voice waveform animates as he responds *"Zgadzam się."* Polish phrase appears under his avatar in mono, then **letter-by-letter morphs into English "I agree."** Button pulses → tap. |
| **Audio** | **Vera (contract preset, eleven_v3 multilingual):** *"[confidently] iPhone piętnaście, czterysta funtów, do piątku. Zgadzasz się?"* (~3s — translation: "iPhone 15, 400 pounds, by Friday. Do you agree?") · **Marcus (real human voice clip, Polish):** *"Zgadzam się."* (~1s) · Soft confirm tone on tap. |
| **Animation** | **Polish→English letter-by-letter morph is the hero animation of this beat.** Option A (recommended): per-char `motion.span` fade/scale staggered 30ms — Polish out (0:25.5-0:26.3), English in (0:26.3-0:27.1). Option B (fallback): slot machine slide-up overlap. Marcus's phone: `perspective(2000px) rotateY(7deg) rotateX(2deg)` + trust-blue radial halo. "I agree" button pulse `scale: 1 → 1.04 → 1` (250ms) + box-shadow ripple. |
| **Transition out** | Lock-thunk transition — 80ms frame freeze, circular `clip-path` wipe from "I agree" button outward as lock-thunk SFX lands |
| **Zelios archetype** | Letter-by-letter type-on (LangEase 0:48) + floating angled mockup (Slack signature) |

---

### Beat 5 — Money locks in escrow (0:28–0:33) ⭐ ACT 1 HERO

| Field | Spec |
|---|---|
| **Music** | ⚠ Drum hit between 0:28-0:30. **Vault snap MUST land on it.** Single most critical sync point. |
| **Tagline** | *"receive your money, on time."* small mono under the lock animation |
| **On-screen** | Cream surface. Pile of £400 (stack-of-cards visual) slides into vault/lock. Status pill: AWAITING_SELLER → AGREED → IN_ESCROW. |
| **Audio** | Music + 🔒 **Lock-thunk SFX (`lock-thunk-v3-take5.mp3`, ~150ms)** — most important SFX in the video. **+ Vera (mediating): *"[confidently] Four hundred pounds is now locked with Stripe."* (~3s, runs UNDER the lock animation, NOT over the SFX)** |
| **Animation** | **PEAK MOMENT.** Sequence:<br/>1. 0:28.0-0:28.4 — Money slides to centre (400ms, staggered)<br/>2. 0:28.4-0:28.55 — Vault appears (SVG), shutter open at 90°<br/>3. 0:28.55-0:28.7 — Money compresses (`scale: 1 → 0.6`)<br/>4. 0:28.7 — ⭐ DRUM HIT → vault snaps shut (80ms keyframe scale jolt)<br/>5. 0:28.7-0:28.78 — 2-3px SCREEN SHAKE on root composition<br/>6. 0:28.78-0:29.2 — Concentric pulse rings (3 rings, stagger 120ms)<br/>7. 0:28.9-0:29.5 — Status pill cascade<br/>8. 0:29-0:31 — Tagline mono types in underneath<br/>9. 0:31-0:33 — Hold + ambient breathing<br/>**Vera VO begins at ~0:30 (after the drum hit) so SFX has clean air.** |
| **Transition out** | Cinematic whoosh — radial mask expanding from vault centre to fill frame with cream, 350ms easeInOut + whoosh SFX |
| **Zelios archetype** | ⭐⭐ Concentric pulse + radial wipe + screen shake (Jobster 0:58 + Slack USE-ONCE) |

```tsx
// Screen shake recipe
const frame = useCurrentFrame();
const shake = frame > shakeStart && frame < shakeStart + 2
  ? Math.sin(frame * 8) * 3 : 0;
<div style={{ transform: `translate(${shake}px, ${-shake * 0.5}px)` }}>
```

---

### Beat 6 — Time skip (0:33–0:37)

| Field | Spec |
|---|---|
| **Music** | Sustained groove. Paper-flip SFX rides without competing. |
| **Tagline** | (off-screen) |
| **On-screen** | 6 calendar pages fan forward. Day counter ticks 1 → 5. Subtitle: **"5 days later."** Italic Fraunces. |
| **Audio** | Music + brief tick-tick-tick paper-flip whoosh. No voice. |
| **Animation** | 6 calendar pages, 80ms apart. Per page: rotate3d perspective flip, `scale: 1 → 0.95 → 1`, opacity 0.7 → 1. Day counter: `<motion.span>` with key-change + AnimatePresence `mode="popLayout"`. Italic Fraunces subtitle fades in at 0:36 (400ms). |
| **Transition out** | Whoosh + cross-dissolve into delivery view (250ms) |

---

### Beat 7 — Item arrived + voice confirm (DIEGETIC DIALOGUE) (0:37–0:42)

| Field | Spec |
|---|---|
| **Music** | Energy holds, anticipation building (Track 4 starts the build here). Soft chime on register at 0:41. |
| **Tagline** | (off-screen) |
| **On-screen** | Sarah's view: iPhone box delivered (tracking label visible). Vera prompt shown. Sarah's voice waveform animates: she says "Yes." |
| **Audio** | **Vera (mediating):** *"It's arrived. Does it match?"* (~1.5s) · **Sarah:** *"Yes."* (~0.5s) · Soft chime on register. |
| **Animation** | Phone mockup at `perspective(2000px) rotateY(-5deg)` (opposite to Marcus's Beat 4 angle). Parcel SVG slides in from off-screen-bottom (600ms easeOutQuart). Sarah's "Yes." 4-bar reactive waveform (~500ms active). Checkmark **begins to form** at end via `motion.path` `pathLength: 0 → 0.4` (only partial — completes in Beat 8). |
| **Transition out** | No cut — forming checkmark feeds directly into Beat 8 as continuous motion |
| **Zelios archetype** | UI mockup floating-angled with parallax ghosts (Slack signature) |

---

### Beat 8 — Tick + money released (0:42–0:47) ⭐ ACT 1 PAYOFF

| Field | Spec |
|---|---|
| **Music** | ⚠ **BUILD into the drop at 0:47.** HERO TICK at 0:43-0:44, money slide at 0:45-0:46, tagline lockup at 0:46. HARD CUT to black at exactly frame 1410 (0:47.00 at 30fps). |
| **Tagline** | *"Receive your money, on time."* full lockup, lands AS Marcus's money arrives |
| **On-screen** | Big animated ✓ tick lands center-screen. £400 amount counter releases from escrow → Marcus's avatar. Marcus's notification chime visual. Tagline + Marcus's avatar share the frame. |
| **Audio** | 🔔 **Release-bell SFX (`release-bell-v2-take5.mp3`, ~400ms)** on tick land. **+ Vera (mediating): *"[confidently] Four hundred pounds is being released to Marcus right now. [warmly] Thanks for using Vouch."* (~4s, runs UNDER the build/release moment)** |
| **Animation** | Sequence:<br/>1. 0:42-0:43 — Checkmark completes (`pathLength: 0.4 → 1.0`, 500ms easeOutQuart) + single pulse ring on completion<br/>2. 0:43-0:44 — HERO TICK scale-in (`scale: [0, 1.15, 1]`, 350ms) + single ring pulse<br/>3. 0:44-0:45 — £400 counter ticks up from £0 → £400 (700ms easeOutQuart via Framer `animate()`)<br/>4. 0:44-0:46 — Money slides vault → Marcus's avatar via SVG path (`offsetPath` + `offsetDistance: 0% → 100%`, 1.2s easeInOut)<br/>5. 0:46-0:47 — Tagline word-by-word lockup, final word at frame 1409 (0:46.97)<br/>6. 0:47.0 — HARD CUT to black (1 frame) |
| **Transition out** | **HARD CUT to black** synced to Track 4's drop |
| **Zelios archetype** | ⭐ Concentric pulse + MotionPath (Jobster 0:58 adapted) |

> ⚠ Marcus notification chime visual + money slide MUST complete BEFORE the hard cut. Don't let the music drop interrupt motion mid-arc.

---

## ⬇ MUSIC DROPS — HARD CUT TO BLACK at 0:47 ⬇

## 🎬 ACT 2 — Dispute / safety net (0:47–0:62) · tagline anchor: *"Every deal, kept."*

### Beat 9 — Dispute opens (0:47–0:52)

| Field | Spec |
|---|---|
| **Music** | **DROP / BREATH** — sparse, low. Sub-bass impact on image-land at 0:47.3. |
| **Tagline** | *"Every deal, kept."* types in under the photo — italic gradient on **"kept"** |
| **On-screen** | Hard cut from black to: photograph of a **cracked iPhone** with tracking label visible. Tagline 2 types underneath. |
| **Audio** | Music drop carries everything. Single sub-bass impact on image land. **No voice.** |
| **Animation** | 0:47.0-0:47.3 pure black hold (3 frames). 0:47.3 cracked iPhone fades up (`opacity: 0 → 1`, 400ms easeOutQuart) + slight scale `1.05 → 1.0` (Ken Burns micro-zoom) + sub-bass SFX on opacity-1 frame. 0:48-0:52 tagline types word-by-word (4 words × 200ms stagger), italic gradient on "kept", holds 3.2s while photo breathes. |
| **Transition out** | Smooth cross-dissolve (300ms) to Vera's replay UI |
| **Zelios archetype** | Pain→solution pivot INVERTED (StoreTrack 00:05-07) |

> Anti-pattern check: Don't add particles, dust, or decoration. Silence + image alone is the move.

---

### Beat 10 — Vera replays original promise (0:52–0:57) ⭐ MOAT ANIMATION OF ACT 2

| Field | Spec |
|---|---|
| **Music** | Building back up. Waveform scrub on "scratches" lands precisely on the rebuild moment. |
| **Tagline** | (off-screen — UI has the focus) |
| **On-screen** | Two stacked cards. **TOP** — Vera replay UI: *"Marcus said: no scratches, original box."* Audio waveform highlighted at "scratches." **BOTTOM** — Sarah's evidence photo + delivery-day timestamp. |
| **Audio** | Music rebuilding. **Diegetic Marcus voice clip plays MARCUS'S ACTUAL recording saying "no scratches"** (~0.5s, reused from Marcus's Beat 4 seller-agreement recording — see Audio sourcing note). **+ Vera (mediating): *"[confidently] Marcus said: 'iPhone 15, no scratches, original box.' That was the deal."* (~4s, contextualises the diegetic moment)** |
| **Animation** | Both cards enter from off-screen (TOP from above, BOTTOM from below), stagger 120ms, total 600ms easeOutQuart. Waveform highlight on "scratches": 5-bar waveform across top card, the "scratches" bar scales `1 → 1.6 → 1` (300ms) + concentric pulse ring from that bar (Jobster pattern scaled down) + background highlight pill draws under the word (clipPath wipe left-to-right, 200ms easeOutQuart, warning-soft colour). Bottom card glow: 1px border animates border-warm → indigo (400ms), then breathes (1.4s loop). |
| **Transition out** | Both cards collapse + merge centre-frame using FLIP (Framer `layoutId` swap), 400ms easeInOut, into verdict frame |
| **Zelios archetype** | ⭐ Concentric pulse on waveform + side-by-side evidence cards (Jobster) |

> This is the moat. Diegetic replay of Marcus's actual recorded voice IS the differentiator. Don't undersell with weak motion.

---

### Beat 11 — Verdict + refund (0:57–0:62)

| Field | Spec |
|---|---|
| **Music** | Full energy return. Verdict card lands on a music accent. Coin sweep SFX bridges into money reversal. |
| **Tagline** | *"Every deal, kept."* small under verdict card |
| **On-screen** | Verdict card slides in: **"Ruling: refund to Sarah. Marcus's account flagged."** Beneath: £400 slides back from escrow → Sarah's avatar. Status pill: REFUNDED. |
| **Audio** | Music. 🔔 **Dispute-chime SFX (`dispute-chime-take3.mp3`)** on verdict. Coin/cash sweep SFX on money return. **+ Vera (contract preset): *"[seriously] Ruling: refund to Sarah. Marcus's account flagged for review."* (~3s, lands as verdict card appears)** |
| **Animation** | 0:57.0-0:57.6 — Verdict card slides up (`y: 100 → 0, scale: 0.96 → 1, opacity: 0 → 1`, 500ms easeOutQuart, glassmorphism backdrop blur 22px saturate 170%). 0:58.0-0:58.4 — "Ruling..." word-by-word (80ms stagger). 0:59.0-1:00.2 — £400 slides BACK (MotionPath reverse of Beat 8). Counter ticks £400 → £0 (800ms). 1:00.5 — REFUNDED status pill cross-fades in (success colour). 1:00-1:01.5 — Sarah's avatar micro-bounce (`scale: 1 → 1.06 → 1`, 250ms, no spring). 1:01.5-1:02.0 — Tagline holds. |
| **Transition out** | Slight fade (200ms), hold resolution beat 500ms, cross-fade to Beat 12 |
| **Zelios archetype** | ⭐ Pain→solution pivot completion + MotionPath reverse |

---

### Beat 12 — Close / brand synthesis (1:02–1:05)

| Field | Spec |
|---|---|
| **Music** | Tail of Track 4, fading naturally (CapCut polishes the final 1–2s fade). Wordmark lands at 1:02.5 on last sustained chord. |
| **Tagline** | Brand synthesis: **"Trust the handshake. Hold the money."** |
| **On-screen** | Centred composition. **Vouch wordmark** large. Under it: *"Trust the handshake. Hold the money."* in mono. |
| **Audio** | Music fades. **No voice.** |
| **Animation** | 1:02.0 — Vouch wordmark scale-in (`scale: 0.92 → 1`, 1.5s easeOutQuart — deliberately SLOW confidence pace) + opacity 0 → 1 over 1.0s. 1:02.5 — Vera waveform pulse beneath wordmark (subtle, 22-28px inline). 1:03.5 — Brand line types underneath (mono, per-word 200ms, no flourish). Lands at 1:04.7. 1:04.7-1:05.5 — Hold wordmark composition. 1:05.5 — Cut to black (frame 1965 at 30fps). |
| **Transition out** | Cut to black after ~1s hold post-music-end |
| **Zelios archetype** | ⭐ Slow deliberate reveal (Slack closer) + morph chain finale (LangEase signature) |

> Anti-pattern check: Do NOT add a CTA button. v3 explicitly drops external narrator + external CTAs — the wordmark IS the close. Resist the urge.

---

## 📋 Audio file → demo beat mapping

The script's beat numbering (1-12) and the audio file prefix (beat-3, beat-4, beat-7, beat-8, beat-9, beat-10, beat-12) diverged historically. v4 documents the mapping; renaming the files is optional polish for post-submission.

| Demo beat (this doc) | Audio file prefix | Notes |
|---|---|---|
| Beat 3 (buyer intake Q4) | `beat-3-q4-*` | matches |
| Beat 4 (Polish recital) | `beat-4-polish-recital-*` | matches |
| Beat 5 (lock) | `beat-8-lock-confirmation-*` | **MISMATCH — historical; "lock" is Beat 5 not Beat 8** |
| Beat 7 (receipt ask) | `beat-7-receipt-ask-*` | matches |
| Beat 8 (release) | `beat-9-release-confirmation-*` | **MISMATCH — "release" is Beat 8 not Beat 9** |
| Beat 10 (dispute replay) | `beat-10-dispute-replay-*` | matches |
| Beat 11 (verdict) | `beat-12-verdict-*` | **MISMATCH — "verdict" is Beat 11 not Beat 12** |

---

## 📋 Final voice asset list (LOCKED — A/B'd 2026-05-19)

### Vera TTS clips (7 total, all in `public/audio/demo-vera/`)

| Beat | File | Preset | Text |
|---|---|---|---|
| 3 | `beat-3-q4-tight.mp3` | mediating | *"When and how is it being delivered?"* |
| 4 | `beat-4-polish-recital-default.mp3` | contract | *"[confidently] iPhone piętnaście, czterysta funtów, do piątku. Zgadzasz się?"* |
| 5 | `beat-8-lock-confirmation-tight.mp3` | mediating | *"[confidently] Four hundred pounds is now locked with Stripe."* |
| 7 | `beat-7-receipt-ask-loose.mp3` | mediating | *"It's arrived. Does it match?"* |
| 8 | `beat-9-release-confirmation-tight.mp3` | mediating | *"[confidently] Four hundred pounds is being released to Marcus right now. [warmly] Thanks for using Vouch."* |
| 10 | `beat-10-dispute-replay-?.mp3` | mediating | *"[confidently] Marcus said: 'iPhone 15, no scratches, original box.' That was the deal."* (take pending re-A/B) |
| 11 | `beat-12-verdict-default.mp3` | contract | *"[seriously] Ruling: refund to Sarah. Marcus's account flagged for review."* |

### Human voice clips (3 total, in `public/audio/personas/`)

| Beat | File | Source |
|---|---|---|
| 3 | `sarah-delivery-consistent-1.mp3` | Sarah: *"Royal Mail tracked, by Friday."* (~1.5s) |
| 4 | `marcus-zgadzam-balanced.mp3` | Marcus (Polish): *"Zgadzam się."* (~1s) |
| 7 | `sarah-yes-expressive-1.mp3` | Sarah: *"Yes."* (~0.5s) |

### Diegetic clip reuse

| Beat | File | Notes |
|---|---|---|
| 10 | `marcus-zgadzam-balanced.mp3` (excerpt OR new recording) | "no scratches" clip — see sourcing note below |

> **Audio sourcing note on Marcus's "no scratches"**: v3 specified this be reused from Marcus's Beat 4 seller-agreement recording at 0:18-0:28. Currently `personas/` only has Marcus saying "Zgadzam się" — no "no scratches" recording exists. **Action before Day 6 render**: either (a) generate Marcus's "no scratches" clip via EL TTS using the same voice ID, ~0.5s, or (b) restructure Beat 10 to lean entirely on Vera's narration line + visual waveform animation without diegetic playback. Recommendation: generate via TTS.

---

## 📋 Final SFX list (LOCKED — A/B'd 2026-05-19)

| Beat | File | Spec |
|---|---|---|
| 5 (lock) | `lock-thunk-v3-take5.mp3` | Clean designed UI lock thud, ~0.5s |
| 8 (release) | `release-bell-v2-take5.mp3` | Cartoon game-show ding, ~0.5s |
| 11 (verdict) | `dispute-chime-take3.mp3` | Sombre notification chime, half-step descending, ~0.7s |

---

## 📋 Tagline placement (typography only — no VO carries them)

| Beat | Time | Tagline visible | How it lands |
|---|---|---|---|
| 1 | 0:00–0:05 | **"Receive your money, on time."** | Hero word-by-word reveal, italic gradient on "on time" |
| 2 | 0:05–0:09 | Lingers as secondary under wordmark | Small mono |
| 5 | 0:29–0:33 | **"receive your money, on time."** small mono | Under the lock animation, types in after the drum hit |
| 8 | 0:46–0:47 | **"Receive your money, on time."** | Full lockup, lands AS Marcus's money arrives |
| 9 | 0:47–0:52 | **"Every deal, kept."** types in | On the music drop, with cracked iPhone |
| 11 | 0:57–0:62 | **"Every deal, kept."** small under verdict | Anchors Sarah's refund |
| 12 | 1:02–1:05 | **"Trust the handshake. Hold the money."** under wordmark | Synthesis line, slow fade-in |

---

## 📋 Implementation order (Remotion build, Day 6)

1. **Spike the drum hit at 0:28** — identify exact frame in Track 4 via `<Audio>` + `useAudioData()`. Whole Act 1 climax orbits this single beat.
2. **Build Beat 5 first** (lock peak). If this lands, rest of Act 1 has its anchor.
3. **Build Beat 9 second** (drop / silence). Hardest editorial — silence IS the move.
4. **Build Beats 2, 8, 10, 12** (the four Zelios-archetype beats) — the differentiators.
5. **Fill in beats 1, 3, 4, 6, 7, 11** with the recipes above.
6. **Pre-render all voice clips first** (already done — see voice asset list).
7. **Pre-analyse voice clips with `useAudioData()`** so waveform animations are deterministic at render time, not runtime.

---

## 📋 Cross-references

- Repo: `D:/Projects/vouch/`
- Remotion sibling: `D:/Projects/vouch-demo-remotion/`
- Visual mockups: `D:/Projects/vouch/docs/reference-html-mockups/`
- Music: `vouch-demo-remotion/public/audio/track-4.mp3`
- Beat anchors: `vouch-demo-remotion/src/beats.json` (librosa-derived from Track 4)
- Scene-event analyser: `D:/Projects/vouch/scripts/analyze-scene.py`
- Audio cue helper: `vouch-demo-remotion/src/timing.ts` → `audioCueFrame()`
- Design tokens: `D:/Projects/vouch/docs/DESIGN.md`
- Vera system prompt: `D:/Projects/vouch/docs/VERA-SYSTEM-PROMPT.md`
- Tool definitions: `D:/Projects/vouch/docs/vera-tools.json`

---

## 📋 Open questions

1. **Marcus's "no scratches" diegetic clip** — generate via TTS or remove from Beat 10? (Recommendation: generate.)
2. **Audio file renumbering** — rename `beat-8-lock-confirmation.mp3` → `beat-5-lock-confirmation.mp3` etc. now or post-submission? (Recommendation: defer.)
3. **Cracked iPhone visual (Beat 9)** — stock photograph from Unsplash search "broken iPhone screen on table," or Claude Design illustration? (Still open from v3.)
4. **Vera narration trade-off (callout above)** — keep all 7 Vera clips (current v4 lock), or revert to v3's 3-clip silent-lock-release minimal scope? (Default: keep.)

---

*Supersedes `demo-video-script-v3.md` and `Vault/Projects/Vouch/Research/Motion-Script-v3-Combined-2026-05-19.md`. Both v3 + v3-combined retained as historical inputs. v4 is the working doc for Day 6 Remotion build.*
