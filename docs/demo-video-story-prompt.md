# Vouch demo video — story-driven Claude Design prompt (v3.4)

**What this is:** A single story-driven prompt for the full 67-second Vouch demo video, rendered in Claude Design as one prototype.

**Discipline applied (v3.4):** Declare what to show + when sync moments must land. Do NOT prescribe motion verbs, durations, positions, or compositional micro-choices that Claude's motion-design instincts can handle within the brand system.

**Core rules:**
- Cream is the canvas for the whole video (except Beat 12, the brand close, which is dark)
- Pages render flat — no 3D perspective, no polaroid tilts
- Each speaker gets an animated waveform during their speech
- Each beat stands alone visually — no animation bridging two scenes
- One italic gradient word per headline maximum

---

## Project setup in Claude Design

- New prototype: **"Vouch Demo Video"**
- Hi-fidelity, interactive prototype
- Apply published Vouch Design System
- Upload all 36 assets from `docs/demo-stills/` (listed at the bottom of this doc)
- Paste the prompt block below

---

## BEGIN STORY PROMPT — paste everything between markers

Render the full Vouch demo video as one continuous 67-second scene at 1920×1080, 30fps. Apply the Vouch Design System throughout. The hard constraints below define what must happen and when; the per-scene briefs describe what to show and why. **Choose your own motion choreography, easing curves, positioning, timing, and transitions** — trust your sense for fintech-editorial motion design. You don't need to ask permission to make compositional decisions.

---

## Hard constraints

- **Master easing:** easeOutQuart (`cubic-bezier(0.22, 1, 0.36, 1)`). No bouncy springs.
- **Cream `#f6f5f2`** is the background for the whole video except Beat 12 (dark `#0c0c14`). One continuous canvas — scenes lay on top. The only cut to black is the final end at 1:07.
- **Pages render flat** — no 3D perspective, no polaroid tilts. Product UI is the star.
- **Each beat stands alone** — no animation continuity bridging scenes.
- **Each speaker gets a distinct waveform variant** so viewers can tell Vera / Sarah / Marcus apart. Use bar-count and colour variation within the brand palette (indigo + cinnamon). Waveform animates during the speech, then settles.
- **No "escrow" in user-facing copy.** The status is "MONEY HELD".
- **Italic gradient emphasis** — only ONE word per headline gets the Fraunces italic indigo gradient (e.g. "on *time.*", "*kept.*", "*wrong?*", "*handshake.*").
- **Brand voice:** warm-editorial, anti-decoration. No confetti, no sparkle, no emoji ornaments.

---

## Critical sync moments (must land on the music)

| Time | Moment |
|---|---|
| 0:01.000 | First word of hero tagline lands (music kick) |
| 0:06.000 | Vouch wordmark lands (music downbeat) |
| **0:28.700** | **Vault snaps shut — SINGLE FRAME — with screen shake (DRUM HIT)** |
| 0:43.400 | Hero green tick appears (release-bell SFX) |
| 0:46.970 | Final word "time." of Act 1 tagline lands |
| 0:47.500 | Framing card word "wrong?" lands (music drop) |
| 0:50.000 | Cracked iPhone fully on cream (sub-bass) |
| 0:56.000 | Waveform spike on the word "scratches" |
| 1:04.500 | Vouch wordmark lands (final sustained chord) |
| 1:07.000 | Cut to black — video ends |

---

## ACT 1 — Happy Path (0:00–0:47) · tagline anchor: *"Receive your money, on time."*

### Scene 1 — Hook (0:00–0:05)

**Show:** Hero tagline appears word-by-word: *"Receive your money, on time."* — italic indigo gradient on "*time.*" Then the real eBay listing (`b1-ebay-no-button.png`), then the Pay with Vouch button injects (`b1-ebay-with-button.png`), then a cursor clicks it.

**Story:** Real marketplace. New way to pay. One click in.

**Assets:** `b1-ebay-no-button.png`, `b1-ebay-with-button.png`, `b1-button-only.png`

---

### Scene 2 — Brand reveal (0:05–0:09)

**Show:** Vouch wordmark (`b12-vouch-wordmark-light.png`) lands on the downbeat. Small mono tagline anchor underneath. Vera waveform signature breathes.

**Story:** This is Vouch. Vera is here.

---

### Scene 3 — Buyer intake (0:09–0:18)

**Show:** The `/new` page (`b3-new-q4-vera-speaking.png`). Vera asks her question (her waveform plays). Sarah replies *"By Friday."* (her waveform plays). Four captured-term cards arrive into the right-side strip — item, seller (`Marcus`), amount (`£609.89`), delivery (`By Friday`). Hand off to Marcus's side.

**Story:** Vera captures the whole deal by voice in 9 seconds. Effortless.

**Speakers:** Vera (Q1), Sarah ("By Friday.")

**Assets:** `b3-new-q4-vera-speaking.png`, `b3-captured-card-item.png`, `b3-captured-card-seller.png`, `b3-captured-card-amount.png`, `b3-captured-card-delivery.png`

---

### Scene 4 — Multilingual seller agreement (0:18–0:28) ⭐ MOAT MOMENT

**Show:** Marcus's view (`b4-seller-vera-reading.png`) with his Warsaw avatar (`b4-marcus-avatar-warsaw.png`) nearby. Vera reads Sarah's terms in Polish (her waveform plays). Marcus replies *"Zgadzam się."* (his waveform plays). **The Polish phrase (`b4-polish-text.png`) transforms letter-by-letter into "I agree." (`b4-english-text.png`) — this is the moat moment, make the morph hero-worthy.** Marcus taps "I agree" (`b4-i-agree-button-default.png` → `b4-i-agree-button-tapped.png`).

**Story:** Cross-border voice mediation. Two parties, two languages, one agreement.

**Speakers:** Vera (Polish recital), Marcus ("Zgadzam się.")

---

### Scene 5 — Lock (0:28–0:33) ⭐ ACT 1 HERO

**Show:** A pile of £400 (abstract layered banknote shapes — indigo + cream). A vault. The money goes into the vault. **At 0:28.7 — the drum hit — the vault snaps shut in a single frame, with screen shake.** Pulse rings. Status pills cascade through AWAITING SELLER → AGREED → MONEY HELD. Tagline below in lowercase mono: "receive your money, on time."

**Story:** The drum hit. The lock. Money held safely.

**Critical:** The vault snap at 0:28.7 MUST be a single-frame transition — no soft animation. This is the most precise sync in the whole video.

**Assets:** `b5-pill-awaiting-seller.png`, `b5-pill-agreed.png`, `b5-pill-in-escrow.png`

---

### Scene 6 — Time skip (0:33–0:37)

**Show:** Calendar pages flipping forward. Day counter ticks Day 1 → Day 5. Subtitle: ***"5 days later."***

**Story:** Time passes. Money sits safely.

---

### Scene 7 — Item arrived + receipt prompt (0:37–0:42)

**Show:** Sarah's signoff page (`b7-signoff-in-escrow.png`). The iPhone parcel (`b7-parcel-arrived.jpg`) arrives nearby — both clearly visible, not overlapping. Vera asks *"Does it match?"* (her waveform). Sarah replies *"Yes."* (her waveform). The signoff status updates to receipt-confirmed.

**Story:** Item arrives. Voice-confirmed receipt.

**Speakers:** Vera, Sarah.

---

### Scene 8 — Release payoff (0:42–0:47) ⭐ ACT 1 PAYOFF

**Show:** A hero green tick. £0 → £609.89 counter. Money travels from the vault to Marcus's avatar (`b4-marcus-avatar-warsaw.png`); he gets a notification. Final tagline "Receive your money, *on time.*" lands word-by-word — last word at 0:46.97. RELEASED pill (`b8-pill-released.png`).

**Story:** The promise delivered. Money lands.

---

## ACT 2 — Dispute / safety net (0:47–1:04) · tagline anchor: *"Every deal, kept."*

### Scene 8.5 — Framing card pivot (0:47–0:49)

**Show:** A clean cream canvas. Centred Fraunces text: ***"And when something goes wrong?"*** Italic indigo gradient on "*wrong?*" only. The music drop lands on the "wrong?" reveal at 0:47.5.

**Story:** The Act 1 promise delivered. Now the harder question — Vouch's other promise.

---

### Scene 9 — Dispute opens (0:49–0:54)

**Show:** Cracked iPhone photograph (`b9-cracked-iphone.jpg`). Sub-bass impact on the photo landing. Tagline below: *"Every deal, kept."* — italic gradient on "*kept.*"

**Story:** Here's what went wrong. Vouch's other promise — the safety net.

---

### Scene 10 — Vera replays original promise (0:54–0:59) ⭐ MOAT

**Show:** Two cards: Vera's replay UI on top (`b10-replay-card.png`), Sarah's evidence below (`b10-evidence-card.png`). Marcus's diegetic voice clip plays *"No scratches, original box."* — his waveform animates inside the replay card. At 0:56 the bar at the word "scratches" spikes, and "scratches" gets highlighted in the text. The evidence card reacts (connects visually to the playback).

**Story:** The product's own evidence chain. Marcus's actual voice indicting him. No "he-said-she-said."

**Speakers:** Marcus (diegetic playback, inside the replay card).

---

### Scene 11 — Verdict + refund (0:59–1:04)

**Show:** Verdict card (`b11-verdict-card.png`) with glassmorphism. Dispute-chime SFX on land. Heading: "Refund to *Sarah*." Money returns from Marcus back to Sarah. Counter ticks down to £0. REFUNDED pill (`b11-pill-refunded.png`). Sarah's avatar (`b11-sarah-avatar.png`) reacts. Tagline anchor (`b12-tagline-lockup.png`): "Every deal, *kept.*"

**Story:** The system worked. Refund issued. Account flagged.

---

### Scene 12 — Brand close (1:04–1:07) — dark canvas

**Show:** Canvas darkens from cream to dark navy (NOT through black — interpolated colour shift). Vouch wordmark (`b12-vouch-wordmark.png`) lands at 1:04.5 — confident, unhurried. Vera waveform breathes beneath. Brand line in mono: ***"Trust the *handshake.* Hold the money."*** Hold. Cut to black at 1:07.

**Story:** The brand promise distilled.

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

## Fallback plan

1. Beats 5 + 9 saved as standalone HTML (working renders)
2. Per-beat prompt pack at `docs/demo-video-claude-design-prompts.md` for chunked rendering
3. CapCut for stitching

---

*Generated 2026-05-21. v3.4: directing intent, not motion. Per-scene briefs ~40-60% shorter than v3.3. Sync moments + brand rules retain prescriptive precision; everything else trusts Claude.*
