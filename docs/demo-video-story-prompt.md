# Vouch demo video — story-driven Claude Design prompt (v3.3)

**What this is:** A single story-driven prompt for the full 67-second Vouch demo video, rendered in Claude Design as one prototype. Trust Claude's motion-design instincts within the brand guardrails — the constraints below define what must happen and when; Claude decides how.

**Core rules:**
- Cream is the canvas for the whole video (except the final 3-second brand close, which is dark)
- Pages render flat — no 3D perspective, no polaroid tilts
- Every speaker (Vera, Sarah, Marcus) gets an animated waveform whenever they talk
- Each beat stands alone — no animation continuity bridging scenes
- One italic gradient word per headline maximum

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

- **Master easing:** easeOutQuart (`cubic-bezier(0.22, 1, 0.36, 1)`). No bouncy springs.
- **Cream `#f6f5f2` is the background for the entire video** except Beat 12 (the brand close, which uses dark `#0c0c14`). The cream surface is one continuous canvas — everything else lays on top of it. The only cut to black in the whole video is the final end at 1:07.
- **Pages render flat** — no 3D perspective tilts, no polaroid rotations. Show product UI prominently and upright.
- **Each beat stands alone visually** — no animation continuity bridging two beats (no "partial checkmark continues into next scene" tricks). Each scene starts fresh.
- **Speakers always get an animated waveform** when they talk. Three speaker variants throughout:
  - **Vera** — indigo 3-bar waveform (design system component), higher amplitude
  - **Sarah** — warmer cinnamon 4-bar waveform, lower amplitude
  - **Marcus** — deeper indigo 4-bar waveform, medium amplitude
  - Waveform pulses for the duration of the speech, then settles to ambient breathing
- **No escrow language** — never use the word "escrow" in visible copy. The status is "MONEY HELD".
- **Italic gradient emphasis** — only ONE word per headline gets the Fraunces italic indigo gradient treatment (e.g. "on *time.*", "*kept.*", "*wrong?*", "*handshake.*").
- **Brand voice:** warm-editorial, anti-decoration. No confetti, no sparkle, no emoji ornaments, no stock-photo feel.

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

### Scene 1 — Hook (0:00–0:05)

**Show:** Hero tagline reveals word-by-word in dark ink: *"Receive your money, on time."* — "on time." in italic Fraunces with indigo gradient. First word "Receive" lands on the music kick at 0:01. Tagline holds briefly, then cross-fades to the eBay listing (`b1-ebay-no-button.png`) full-bleed. The Pay with Vouch button appears (cross-dissolve to `b1-ebay-with-button.png`). Cursor moves to it and clicks.

**Story:** Real marketplace. New way to pay. One click in.

**Assets:** `b1-ebay-no-button.png`, `b1-ebay-with-button.png`, `b1-button-only.png`

---

### Scene 2 — Brand reveal (0:05–0:09)

**Show:** Vouch wordmark centred (`b12-vouch-wordmark-light.png`) landing on the music downbeat at 0:06. Small mono tagline under it. Subtle Vera waveform breathing nearby.

**Story:** This is Vouch. Vera is here.

---

### Scene 3 — Buyer intake (0:09–0:18)

**Show:** The `/new` page (`b3-new-q4-vera-speaking.png`). **Vera waveform** (indigo 3-bar, higher amplitude) animates while Vera asks her question. Then waveform switches to **Sarah's variant** (cinnamon 4-bar, lower amplitude) as Sarah replies "By Friday." Four captured-term cards fly into the right-side strip one at a time over ~4 seconds: `b3-captured-card-item.png`, `b3-captured-card-seller.png`, `b3-captured-card-amount.png`, `b3-captured-card-delivery.png`. End the scene with a whip-pan right to transition to Marcus's side.

**Story:** Vera captures the whole deal by voice in 9 seconds. Effortless.

**Speakers:** Vera (Q1), Sarah (reply). Both get animated waveforms.

---

### Scene 4 — Multilingual seller agreement (0:18–0:28) ⭐ MOAT

**Show:** Marcus's view (`b4-seller-vera-reading.png`) displayed prominently centre-frame, with a subtle trust-blue halo behind it. Marcus's avatar with **Warsaw, PL** location tag (`b4-marcus-avatar-warsaw.png`) lands top-right. **Vera waveform** (indigo 3-bar) animates while she reads Sarah's terms in Polish. Then waveform switches to **Marcus's variant** (deeper indigo 4-bar, medium amplitude) for his diegetic *"Zgadzam się."* The Polish text (`b4-polish-text.png`) **transforms letter-by-letter into English** "I agree." (`b4-english-text.png`) — this is the hero moment. The "I agree" button appears (`b4-i-agree-button-default.png`) and gets tapped (`b4-i-agree-button-tapped.png`).

**Story:** Cross-border voice mediation. Two parties, two languages, one agreement.

**Speakers:** Vera (Polish recital), Marcus (Polish "Zgadzam się"). Both get animated waveforms.

---

### Scene 5 — Lock (0:28–0:33) ⭐ ACT 1 HERO

**Show:** A pile of £400 (rendered as abstract layered banknote rectangles — indigo and cream) slides into centre-frame. A stylised SVG vault appears behind it (rounded square, concentric rings, brushed-steel grey on cream). The money compresses into the vault. **At 0:28.7 the vault SNAPS shut — single frame, no soft animation. Screen shake for 2-3 frames.** Three concentric pulse rings emanate. The status pill cascade fires bottom-right: `b5-pill-awaiting-seller.png` → `b5-pill-agreed.png` → `b5-pill-in-escrow.png` (the final MONEY HELD pill keeps its pulsing dot). Below the vault, the mono tagline "receive your money, on time." types in word-by-word, lowercase, italic gradient on "on time."

**Story:** The drum hit. The lock. Money is held safely.

**The drum hit at 0:28.7 must be a SINGLE FRAME transition. Spend frames on it.**

---

### Scene 6 — Time skip (0:33–0:37)

**Show:** Calendar pages stacked centre-frame fan-flip forward (no assets — render abstract Card-style calendar pages with date numbers in Fraunces). A day counter ticks "Day 1 → Day 5". Subtitle types in: ***"5 days later."*** in italic Fraunces.

**Story:** Time passes. Money sits safely.

---

### Scene 7 — Item arrived + receipt prompt (0:37–0:42)

**Show:** Sarah's signoff page (`b7-signoff-in-escrow.png`) displayed prominently. An iPhone parcel (`b7-parcel-arrived.jpg`) slides in from below, positioned alongside the signoff page (not overlapping — both clearly visible). **Vera waveform** (indigo 3-bar) animates while she asks *"Does it match?"* Then waveform switches to **Sarah's variant** (cinnamon 4-bar) for her reply *"Yes."* The signoff page's status indicator updates to show receipt confirmed. Hold the composition.

**Story:** Item arrives. Voice-confirmed receipt.

**Speakers:** Vera (receipt prompt), Sarah ("Yes."). Both get animated waveforms.

---

### Scene 8 — Release payoff (0:42–0:47) ⭐ ACT 1 PAYOFF

**Show:** A hero green checkmark scales in centre-frame at 0:43.4 — fresh entry, not continuing from any previous animation. A £0 → £609.89 counter ticks up below it. Money slides from the vault position → Marcus's avatar (`b4-marcus-avatar-warsaw.png`) on a curved path. Marcus's avatar gets a notification badge + pulse ring. The final tagline "Receive your money, on time." (Fraunces, italic gradient on "on time.") types in word-by-word, last word landing at exactly 0:46.97. The RELEASED pill (`b8-pill-released.png`) appears.

**Story:** The promise delivered. Money lands.

---

## ACT 2 — Dispute / safety net (0:47–1:04) · tagline: *"Every deal, kept."*

### Scene 8.5 — Framing card pivot (0:47–0:49) ⭐ NEW

**Show:** Beat 8's final composition gracefully clears off-screen, leaving the clean cream canvas. Large Fraunces text types in centred: ***"And when something goes wrong?"*** — word-by-word, ~250ms stagger. The word "**wrong?**" is in italic Fraunces with the indigo gradient. The **music drop lands precisely on the "wrong?" word reveal at 0:47.5** — this is the editorial pivot moment. Hold the question for ~1 second.

**Story:** The Act 1 promise delivered. Now the harder question — and Vouch's other promise.

**Notes:**
- Type-in feels confident, not dramatic — editorial pace
- Italic gradient on "wrong?" is the only emphasis; rest of line in dark ink
- Music drop syncs to the "wrong?" reveal

---

### Scene 9 — Dispute opens (0:49–0:54)

**Show:** The framing question fades up and away. The cracked iPhone photo (`b9-cracked-iphone.jpg`) enters centred — flat upright rectangular image with a subtle drop shadow to lift it off the cream. Photo scale-ins from `scale: 1.05 → 1.0` (Ken Burns micro-zoom). Sub-bass impact on the photo landing. Hold ~1s. Tagline *"Every deal, kept."* (italic gradient on "kept.") types in below the photo over ~800ms. Then hold — photo breathes subtly.

**Story:** Here's what went wrong. Vouch's other promise — the safety net.

---

---

### Scene 10 — Vera replays original promise (0:54–0:59) ⭐ MOAT

**Show:** Two cards slide into centre-frame, stacked. TOP card `b10-replay-card.png` (Vera replay UI showing "Marcus said: 'no scratches, original box.'") with an indigo accent border. BOTTOM card `b10-evidence-card.png` (Sarah's evidence — cracked phone photo + caption) with a neutral border. **Marcus's waveform variant** (deeper indigo 4-bar) plays alongside his diegetic voice clip *"No scratches, original box."* — visualised as the audio waveform embedded INSIDE the TOP replay card. At 0:56 the waveform bar at "scratches" pulses (scales up + pulse ring). A warning-soft highlight pill wipes in behind the word "scratches" in the text. The bottom card's border transitions from neutral to indigo and breathes.

**Speakers:** Marcus (diegetic playback). Waveform inside the replay card animates throughout his clip.

**Story:** The product's own evidence chain. Marcus's actual voice indicting him. No "he-said-she-said."

---

### Scene 11 — Verdict + refund (0:59–1:04)

**Show:** Verdict card (`b11-verdict-card.png`) with glassmorphism (blur + saturation) slides up centre-frame on a dispute-chime SFX. Heading reads "Refund to Sarah." (italic gradient on "Sarah."). Below, money slides BACK from Marcus → Sarah (reverse of Scene 8's path). £609.89 counter ticks DOWN to £0. REFUNDED pill (`b11-pill-refunded.png`) appears. Sarah's avatar (`b11-sarah-avatar.png`) micro-bounces as her money arrives. Tagline `b12-tagline-lockup.png` ("Every deal, kept.") cross-fades in as the anchor.

**Story:** The system worked. Refund issued. Account flagged.

---

### Scene 12 — Brand close (1:04–1:07) — dark canvas

**Show:** Cream surface darkens to `#0c0c14` over ~600ms via colour interpolation (cream tones smoothly shift to dark navy — the canvas itself is changing colour). Vouch wordmark (`b12-vouch-wordmark.png`) scales in **slowly** (1.5s — deliberately slow confidence pace) centre-frame, landing at 1:04.5. Subtle Vera waveform breathing beneath. Brand line types in mono below: ***"Trust the handshake. Hold the money."*** Final word at 1:06.7. Hold 300ms.

At 1:07.000 — cut to black. Video ends.

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
