# Vouch demo video — story-driven Claude Design prompt (v3, creative freedom)

**Why this version:** v2 monolithic over-specified motion (5000+ words of frame-perfect choreography across 12 scenes) and produced poor results. This v3 inverts the approach — tells Claude WHAT to show + WHEN it must land + WHY each scene matters, then trusts its motion-design instincts. Shorter prompt, fewer rules, better output.

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

Render the full Vouch demo video as one continuous 65-second scene at 1920×1080, 30fps. Apply the Vouch Design System throughout. Use the uploaded assets where specified. **Choose your own motion choreography, easing curves, and transition styles** — trust your sense for fintech-editorial motion design. The constraints below define what must happen and when; you decide how.

---

## Hard constraints (non-negotiable)

- **Master easing:** easeOutQuart (`cubic-bezier(0.22, 1, 0.36, 1)`). No bouncy springs — they read toy-like on financial UI.
- **Two cuts only:** HARD CUT TO BLACK at 0:47.000 (music drop), CUT TO BLACK at 1:05.000 (video end). Everything else flows continuously on whichever canvas (cream or dark) it occupies.
- **Cream-to-cream transitions are SEAMLESS** — no fades to black between consecutive cream scenes. Pretend each cream scene begins where the last cream scene ended.
- **No escrow language** — never use the word "escrow" in visible copy. The status is "MONEY HELD".
- **Italic gradient emphasis** — only ONE word per headline gets the Fraunces italic indigo gradient treatment (e.g. "on *time.*", "*kept.*", "*handshake.*").
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
| **0:46.970** | Final word "time." of Act 1 tagline lands | Last beat before music drop |
| **0:47.000** | HARD CUT TO BLACK | Music drop |
| **0:47.300** | Cracked iPhone fades up from black | Sub-bass impact |
| **0:54.000** | Waveform bar at "scratches" pulses | Word sync in Marcus's diegetic clip |
| **1:02.500** | Vouch wordmark lands centred | Final sustained chord |
| **1:05.000** | Cut to black | Video end |

---

## ACT 1 — Happy Path (0:00–0:47) · tagline: *"Receive your money, on time."*

### Scene 1 — Hook (0:00–0:05) — dark canvas

**Show:** Hero tagline word-by-word reveal on dark `#0c0c14`. Then a cream surface introduces a real eBay listing (`b1-ebay-no-button.png`). The Pay with Vouch button appears (cross-dissolve to `b1-ebay-with-button.png`). Cursor clicks the button.

**Story:** Real marketplace. New way to pay. One click in.

**Assets:** `b1-ebay-no-button.png`, `b1-ebay-with-button.png`, `b1-button-only.png`

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

**Show:** Marcus's view (`b4-seller-vera-reading.png`) — tilted in 3D perspective with a trust-blue halo. Marcus's avatar with **Warsaw, PL** location tag (`b4-marcus-avatar-warsaw.png`) lands top-right. Vera reads Sarah's terms in Polish (waveform pulses). Marcus's diegetic voice replies *"Zgadzam się."* The Polish text (`b4-polish-text.png`) **transforms letter-by-letter into English** "I agree." (`b4-english-text.png`) — this is the hero moment. The "I agree" button appears (`b4-i-agree-button-default.png`) and gets tapped (`b4-i-agree-button-tapped.png`).

**Story:** Cross-border voice mediation. Two parties, two languages, one agreement.

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

**Show:** Sarah's signoff page (`b7-signoff-in-escrow.png`) tilted right (mirror of Scene 4's left tilt). An iPhone parcel (`b7-parcel-arrived.jpg`) slides in from below, set down naturally. Vera asks "Does it match?" (waveform). Sarah replies "Yes." A large checkmark BEGINS to draw on top of the signoff card — but only partially (path drawn ~40%). The partial checkmark is the cliffhanger that resolves in Scene 8.

**Story:** Item arrives. Voice-confirmed receipt. Almost there.

---

### Scene 8 — Release payoff (0:42–0:47) — cream canvas ⭐ ACT 1 PAYOFF

**Show:** The partial checkmark from Scene 7 **completes** (continuous motion from Scene 7). A hero green tick scales in centre-frame at 0:43.4. A £0 → £609.89 counter ticks up below it. Money slides from the vault → Marcus's avatar (`b4-marcus-avatar-warsaw.png`) on a curved path. Marcus's avatar gets a notification badge + pulse ring. The final tagline "Receive your money, on time." (Fraunces, italic gradient on "on time.") types in word-by-word, last word landing at exactly 0:46.97. The RELEASED pill (`b8-pill-released.png`) appears.

**Story:** The promise delivered. Money lands.

**At 0:47.000 — HARD CUT TO BLACK. Single frame. Synced to music drop.**

---

## ⬇ HARD CUT TO BLACK at 0:47 ⬇

## ACT 2 — Dispute / safety net (0:47–1:02) · tagline: *"Every deal, kept."*

### Scene 9 — Dispute opens (0:47–0:52) — dark canvas

**Show:** 9 frames of pure black. Cracked iPhone photo (`b9-cracked-iphone.jpg`) fades up with a subtle Ken Burns zoom-out (sub-bass impact on land). Hold the silence. Tagline *"Every deal, kept."* (italic gradient on "kept.") types in lower-third over ~800ms. Then hold — almost no motion, just a barely-perceptible breath on the photo.

**Story:** Something went wrong. The drop. The silence.

**This is the most editorially restrained scene in the video. Do not add particles, sparkles, or decoration. Trust silence + image alone.**

---

### Scene 10 — Vera replays original promise (0:52–0:57) — cream canvas ⭐ MOAT

**Show:** Two cards slide into centre-frame, stacked. TOP card `b10-replay-card.png` (Vera replay UI showing "Marcus said: 'no scratches, original box.'") with an indigo accent border. BOTTOM card `b10-evidence-card.png` (Sarah's evidence — cracked phone photo + caption) with a neutral border. Marcus's diegetic voice clip plays — *"No scratches, original box."* — and at 0:54 the waveform bar at "scratches" pulses (scales up + pulse ring). A warning-soft highlight pill wipes in behind the word "scratches" in the text. The bottom card's border transitions from neutral to indigo and breathes.

**Story:** The product's own evidence chain. Marcus's actual voice indicting him. No "he-said-she-said."

---

### Scene 11 — Verdict + refund (0:57–1:02) — cream canvas

**Show:** Verdict card (`b11-verdict-card.png`) with glassmorphism (blur + saturation) slides up centre-frame on a dispute-chime SFX. Heading reads "Refund to Sarah." (italic gradient on "Sarah."). Below, money slides BACK from Marcus → Sarah (reverse of Scene 8's path). £609.89 counter ticks DOWN to £0. REFUNDED pill (`b11-pill-refunded.png`) appears. Sarah's avatar (`b11-sarah-avatar.png`) micro-bounces as her money arrives. Tagline `b12-tagline-lockup.png` ("Every deal, kept.") cross-fades in as the anchor.

**Story:** The system worked. Refund issued. Account flagged.

---

### Scene 12 — Brand close (1:02–1:05) — dark canvas

**Show:** Cross-fade from cream to dark `#0c0c14`. Vouch wordmark (`b12-vouch-wordmark.png`) scales in **slowly** (1.5s — deliberately slow confidence pace) centre-frame, landing at 1:02.5. Subtle Vera waveform breathing beneath. Brand line types in mono below: ***"Trust the handshake. Hold the money."*** Final word at 1:04.7. Hold 300ms.

**At 1:05.000 — cut to black. Video ends.**

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
