# Vouch demo video — story-driven Claude Design prompt (v3.2, cream-only + flat pages)

**Why this version (v3.2):**
- v2 monolithic over-specified motion (5000+ words of frame-perfect choreography across 12 scenes) and produced poor render
- v3 inverted the approach — story + sync moments + creative freedom — and produced a working render but with editorial issues
- v3.1 removed all fades to black + added the framing card pivot
- v3.2 additionally removes ALL 3D perspective tilts on pages — show the product UI flat and prominent:
  - **Beat 1 opens on cream**, not dark canvas (cream is Vouch's home surface)
  - **Act 1 → Act 2 pivot uses a framing card on cream** ("And when something goes wrong?"), NOT a hard cut to black
  - **Beat 9 cracked iPhone is a flat photo on cream** (NOT polaroid tilted), still emotionally impactful but design-clean
  - **Beat 4 + Beat 7 product pages render flat** (no `perspective(2000px) rotateY()`) — the UI is the star, show it off cleanly
  - **Total runtime 67s** (Act 2 shifted +2s for the framing card)
  - **Only ONE legitimate cut to black** in the entire video — the final end at 1:07

**Use this version for the monolithic render.** Keep v1 (per-beat) and v2 (monolithic-explicit) as references.

---

## Project setup in Claude Design

- New prototype: **"Vouch Demo Video"**
- Hi-fidelity, interactive prototype
- Apply published Vouch Design System
- Upload all 36 assets from `docs/demo-stills/` (listed at the bottom of this doc)
- Paste the prompt block below

---

## BEGIN STORY PROMPT — paste everything between markers

Render the full Vouch demo video as one continuous 67-second scene at 1920×1080, 30fps. Apply the Vouch Design System throughout. Use the uploaded assets where specified. **Choose your own motion choreography, easing curves, and transition styles** — trust your sense for fintech-editorial motion design. The constraints below define what must happen and when; you decide how.

---

## Hard constraints (non-negotiable)

- **Master easing:** easeOutQuart (`cubic-bezier(0.22, 1, 0.36, 1)`). No bouncy springs — they read toy-like on financial UI.
- **NO FADES TO BLACK anywhere except the final video end at 1:07.000.** Everything else flows continuously on the cream canvas. The Act 1 → Act 2 pivot at 0:47 uses a typographic framing card on cream (NOT a hard cut to black). The cracked iPhone in Beat 9 sits ON cream, not over black. The only legitimate black moment in the entire video is the closing cut at 1:07.
- **Cream is the default surface** — Beats 1-11 ALL render on cream `#f6f5f2`. Only Beat 12 (the brand close) uses the dark canvas `#0c0c14`. Transitions between cream scenes are seamless (each scene's final frame is the next scene's first frame).
- **No escrow language** — never use the word "escrow" in visible copy. The status is "MONEY HELD".
- **Italic gradient emphasis** — only ONE word per headline gets the Fraunces italic indigo gradient treatment (e.g. "on *time.*", "*kept.*", "*wrong?*", "*handshake.*").
- **Brand voice:** warm-editorial, anti-decoration. No confetti, no sparkle, no emoji ornaments, no stock-photo feel, no generic fintech sky-blue.

---

## Critical sync moments

These are the moments that MUST land on the music. If you nail nothing else, nail these.

| Time | Moment | Why |
|---|---|---|
| **0:01.000** | Hero tagline "Receive" lands | Music kick |
| **0:06.000** | Vouch wordmark lands centred | Music downbeat |
| **0:28.700** | Vault snaps shut, screen shake | DRUM HIT — single most important sync in the whole video |
| **0:43.400** | Hero green tick appears | Release-bell SFX |
| **0:46.970** | Final word "time." of Act 1 tagline lands | Last word before pivot |
| **0:47.500** | Framing card word "wrong?" lands on cream | Music drop — the editorial pivot moment, no black |
| **0:50.000** | Cracked iPhone polaroid lands fully on cream | Sub-bass impact (Beat 9 now starts at 0:49 after the framing card) |
| **0:56.000** | Waveform bar at "scratches" pulses | Word sync in Marcus's diegetic clip (~+2s from original) |
| **1:04.500** | Vouch wordmark lands centred | Final sustained chord |
| **1:07.000** | Cut to black | Video end (ONLY hard cut in the whole video) |

---

## ACT 1 — Happy Path (0:00–0:47) · tagline: *"Receive your money, on time."*

### Scene 1 — Hook (0:00–0:05) — cream canvas

**Show:** Open on cream `#f6f5f2`. Hero tagline reveals word-by-word in dark ink: *"Receive your money, on time."* — "on time." in italic Fraunces with indigo gradient. First word "Receive" lands on the music kick at 0:01. Tagline holds briefly, then cross-fades to the eBay listing (`b1-ebay-no-button.png`) full-bleed on the cream. The Pay with Vouch button appears (cross-dissolve to `b1-ebay-with-button.png`). Cursor moves to it and clicks.

**Story:** Real marketplace. New way to pay. One click in.

**Assets:** `b1-ebay-no-button.png`, `b1-ebay-with-button.png`, `b1-button-only.png`

**Critical:** Open on cream — NO dark canvas. The tagline text reads as dark ink on cream, with italic indigo gradient only on "on time." This is the editorial standard for Vouch.

---

### Scene 2 — Brand reveal (0:05–0:09) — cream canvas

**Show:** Vouch wordmark centred (`b12-vouch-wordmark-light.png`) landing on the music downbeat at 0:06. Small mono tagline under it. Subtle Vera waveform breathing nearby.

**Story:** This is Vouch. Vera is here.

---

### Scene 3 — Buyer intake (0:09–0:18) — cream canvas

**Show:** The `/new` page (`b3-new-q4-vera-speaking.png`). Vera asks her question (waveform pulses to indicate Vera speaking). Sarah replies (waveform changes to Sarah's voice). Four captured-term cards fly into the right-side strip one at a time over ~4 seconds: `b3-captured-card-item.png`, `b3-captured-card-seller.png`, `b3-captured-card-amount.png`, `b3-captured-card-delivery.png`. End the scene with a whip-pan right to transition to Marcus's side.

**Story:** Vera captures the whole deal by voice in 9 seconds. Effortless.

---

### Scene 4 — Multilingual seller agreement (0:18–0:28) — cream canvas ⭐ MOAT

**Show:** Marcus's view (`b4-seller-vera-reading.png`) displayed **flat and prominent** centre-frame on cream — NO 3D perspective tilt, NO rotation. The page sits straight, showing the product UI clearly with a subtle trust-blue halo behind it. Marcus's avatar with **Warsaw, PL** location tag (`b4-marcus-avatar-warsaw.png`) lands top-right. Vera reads Sarah's terms in Polish (waveform pulses). Marcus's diegetic voice replies *"Zgadzam się."* The Polish text (`b4-polish-text.png`) **transforms letter-by-letter into English** "I agree." (`b4-english-text.png`) — this is the hero moment. The "I agree" button appears (`b4-i-agree-button-default.png`) and gets tapped (`b4-i-agree-button-tapped.png`).

**Story:** Cross-border voice mediation. Two parties, two languages, one agreement.

**Critical:** Pages render flat (no perspective transforms). The product UI is the star — show it off cleanly.

---

### Scene 5 — Lock (0:28–0:33) — cream canvas ⭐ ACT 1 HERO

**Show:** A pile of £400 (rendered as abstract layered banknote rectangles — indigo and cream) slides into centre-frame. A stylised SVG vault appears behind it (rounded square, concentric rings, brushed-steel grey on cream). The money compresses into the vault. **At 0:28.7 the vault SNAPS shut — single frame, no soft animation. Screen shake for 2-3 frames.** Three concentric pulse rings emanate. The status pill cascade fires bottom-right: `b5-pill-awaiting-seller.png` → `b5-pill-agreed.png` → `b5-pill-in-escrow.png` (the final MONEY HELD pill keeps its pulsing dot). Below the vault, the mono tagline "receive your money, on time." types in word-by-word, lowercase, italic gradient on "on time."

**Story:** The drum hit. The lock. Money is held safely.

**The drum hit at 0:28.7 must be a SINGLE FRAME transition. Spend frames on it.**

---

### Scene 6 — Time skip (0:33–0:37) — cream canvas

**Show:** Calendar pages stacked centre-frame fan-flip forward (no assets — render abstract Card-style calendar pages with date numbers in Fraunces). A day counter ticks "Day 1 → Day 5". Subtitle types in: ***"5 days later."*** in italic Fraunces.

**Story:** Time passes. Money sits safely.

---

### Scene 7 — Item arrived + receipt prompt (0:37–0:42) — cream canvas

**Show:** Sarah's signoff page (`b7-signoff-in-escrow.png`) displayed **flat and prominent** on cream — NO perspective tilt. An iPhone parcel (`b7-parcel-arrived.jpg`) slides in from below, positioned alongside the signoff page (not overlapping it — both clearly visible). Vera asks "Does it match?" (waveform). Sarah replies "Yes." A large checkmark BEGINS to draw on top of the signoff card — but only partially (path drawn ~40%). The partial checkmark is the cliffhanger that resolves in Scene 8.

**Story:** Item arrives. Voice-confirmed receipt. Almost there.

---

### Scene 8 — Release payoff (0:42–0:47) — cream canvas ⭐ ACT 1 PAYOFF

**Show:** The partial checkmark from Scene 7 **completes** (continuous motion from Scene 7). A hero green tick scales in centre-frame at 0:43.4. A £0 → £609.89 counter ticks up below it. Money slides from the vault → Marcus's avatar (`b4-marcus-avatar-warsaw.png`) on a curved path. Marcus's avatar gets a notification badge + pulse ring. The final tagline "Receive your money, on time." (Fraunces, italic gradient on "on time.") types in word-by-word, last word landing at exactly 0:46.97. The RELEASED pill (`b8-pill-released.png`) appears.

**Story:** The promise delivered. Money lands.

**At 0:47.000 — NO BLACK CUT.** Beat 8's final cream composition holds momentarily, then transitions smoothly into the framing card below. The music drop lands DURING the framing card (not on a black cut).

---

## ⬇ Editorial pivot via framing card on cream — NO BLACK ⬇

## ACT 2 — Dispute / safety net (0:47–1:04) · tagline: *"Every deal, kept."*

### Scene 8.5 — Framing card pivot (0:47–0:49) — cream canvas ⭐ NEW

**Show:** Beat 8's final composition (Marcus + money + RELEASED pill + tagline) gracefully clears off-screen or cross-dissolves to a clean cream canvas. Large Fraunces text types in centred: ***"And when something goes wrong?"*** — word-by-word, ~250ms stagger. The word "**wrong?**" is in italic Fraunces with the indigo gradient. The **music drop lands precisely on the "wrong?" word reveal at 0:47.5** — this is the editorial pivot moment, replacing what was previously a hard cut to black. Hold the question on cream for ~1 second.

**Story:** The Act 1 promise delivered. Now the harder question — and Vouch's other promise.

**Critical:**
- Open on cream, not black
- Type-in feels confident, not dramatic — match the editorial brand voice
- The italic gradient on "wrong?" is the only emphasis — rest of the line in dark ink
- Music drop syncs to the "wrong?" reveal, not to any cut
- This beat is 2 seconds long; everything in Act 2 shifts +2s from the original timing

---

### Scene 9 — Dispute opens (0:49–0:54) — cream canvas

**Show:** The framing question lifts away (fade up + slight scale, NOT to black — just fades off the cream). The cracked iPhone photo (`b9-cracked-iphone.jpg`) enters **flat and centred** on the cream surface — NO rotation, NO polaroid tilt. The photo sits as a clean rectangular image (with a subtle drop shadow to lift it off the cream, but otherwise upright). Photo scale-ins from `scale: 1.05 → 1.0` (Ken Burns micro-zoom). Sub-bass impact on the photo landing. Hold ~1s. Tagline *"Every deal, kept."* (italic gradient on "kept.") types in below the photo over ~800ms. Then hold — photo breathes subtly.

**Story:** Here's what went wrong. Vouch's other promise — the safety net.

**Critical:**
- **NO black background.** The cream surface is ALWAYS visible around the photo.
- **NO tilt or rotation** on the photo — display it flat, upright, prominent
- Subtle drop shadow only (to separate from cream), no other decoration
- No silence pause from black — flows continuously from the framing card's cream
- Tagline is dark ink on cream, italic gradient on "kept." only

---

---

### Scene 10 — Vera replays original promise (0:54–0:59) — cream canvas ⭐ MOAT

**Show:** Two cards slide into centre-frame, stacked. TOP card `b10-replay-card.png` (Vera replay UI showing "Marcus said: 'no scratches, original box.'") with an indigo accent border. BOTTOM card `b10-evidence-card.png` (Sarah's evidence — cracked phone photo + caption) with a neutral border. Marcus's diegetic voice clip plays — *"No scratches, original box."* — and at 0:56 the waveform bar at "scratches" pulses (scales up + pulse ring). A warning-soft highlight pill wipes in behind the word "scratches" in the text. The bottom card's border transitions from neutral to indigo and breathes.

**Story:** The product's own evidence chain. Marcus's actual voice indicting him. No "he-said-she-said."

---

### Scene 11 — Verdict + refund (0:59–1:04) — cream canvas

**Show:** Verdict card (`b11-verdict-card.png`) with glassmorphism (blur + saturation) slides up centre-frame on a dispute-chime SFX. Heading reads "Refund to Sarah." (italic gradient on "Sarah."). Below, money slides BACK from Marcus → Sarah (reverse of Scene 8's path). £609.89 counter ticks DOWN to £0. REFUNDED pill (`b11-pill-refunded.png`) appears. Sarah's avatar (`b11-sarah-avatar.png`) micro-bounces as her money arrives. Tagline `b12-tagline-lockup.png` ("Every deal, kept.") cross-fades in as the anchor.

**Story:** The system worked. Refund issued. Account flagged.

---

### Scene 12 — Brand close (1:04–1:07) — dark canvas

**Show:** Smooth transition from cream → dark `#0c0c14`. **Do NOT fade through black.** Instead, the cream surface darkens directly to `#0c0c14` over ~600ms (cream pixels animate to dark navy via a colour ramp, NOT via opacity-to-black). Vouch wordmark (`b12-vouch-wordmark.png`) scales in **slowly** (1.5s — deliberately slow confidence pace) centre-frame, landing at 1:04.5. Subtle Vera waveform breathing beneath. Brand line types in mono below: ***"Trust the handshake. Hold the money."*** Final word at 1:06.7. Hold 300ms.

**At 1:07.000 — cut to black. Video ends. This is the ONLY hard cut to black in the entire video.**

**Critical:** The cream → dark transition uses a colour interpolation (cream tones smoothly shift to dark navy) — NOT a fade through black. Pretend the canvas itself is changing colour; the wordmark emerges from that darkened canvas.

---

## End of story prompt — paste everything above the BEGIN marker

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

### Act 2 + Brand close
- `b9-cracked-iphone.jpg`
- `b10-replay-card.png`
- `b10-evidence-card.png`
- `b11-verdict-card.png`
- `b11-pill-refunded.png`
- `b11-sarah-avatar.png`
- `b12-vouch-wordmark.png`
- `b12-vouch-wordmark-light.png`
- `b12-tagline-lockup.png`

---

## Why this version should work where v2 failed

| v2 (over-specified) | v3 (story-driven) |
|---|---|
| 5000+ words of motion choreography | ~2000 words total, mostly story |
| Per-scene: frame-by-frame transforms, easings, durations | Per-scene: emotion + must-include elements |
| Claude has to reverse-engineer 100+ specific instructions | Claude designs motion within clear constraints |
| Fragility — any missed detail breaks the beat | Robustness — Claude fills gaps with sensible defaults |
| Cognitive overload across 12 scenes simultaneously | Manageable per-scene complexity, easier to render coherently |

**The trade-off:** v3 sacrifices frame-perfect motion precision for output quality. The drum hit at 0:28.7 may not be 1-frame perfect, but the overall video will look polished. If after rendering the drum hit feels mushy, re-render just Scene 5 with v1's per-beat prompt and stitch in CapCut.

---

## Fallback plan if v3 also fails

1. You still have Beat 5 + Beat 9 saved as standalone HTML (perfect renders)
2. Per-beat prompt pack at `docs/demo-video-claude-design-prompts.md` works as fallback for chunked render
3. CapCut handles whatever stitching is needed

Don't lose hope. The render IS achievable.

---

*Generated 2026-05-21 (submission day). Based on lessons learned from v2 monolithic failure. Use this for next render attempt.*
