# Vouch — DEMO-SCRIPT.md

> **The 75-second feature-loaded demo video.** Verbatim Vera/Sarah/Marcus voice lines, shot-by-shot visual cues, audio cue timing, pre-drafted Claude Design prompts for each scene, and Submagic caption text.
>
> **Target length:** 75 seconds (max 90s). Vertical 9:16 for IG Reel / TikTok primary cut; 16:9 for YouTube / X; 1:1 for LinkedIn.
>
> **Tone:** opens with stakes (security), middles with mechanic (voice → escrow → release), ends with brand. Mercury-warm-Mercury but A24-cinematic at the transitions. Visual style follows the elevated hybrid mockup (`6-hybrid-marketing.html`).
>
> **Voice cast:** Vera (lightly British female, late 20s/early 30s, warm-professional), Sarah (American female, mid-20s, energetic), Marcus (American male, mid-20s, casual). All ElevenLabs Voice Design / Voice Cloning generated. No human actors.
>
> **Audio palette:** subtle ambient piano bed (royalty-free), lock-thunk SFX (~150ms) on escrow moments, release-bell SFX (~400ms) on payout moments, Vera's voice as the consistent through-line.

---

## Scene map (visual order)

| # | Sec | Beat | Mode | Audio |
|---|---|---|---|---|
| 0 | 0:00 - 0:05 | Cold-open hook (text + stake) | Black A24 | Ambient piano starts faint |
| 1 | 0:05 - 0:18 | Sarah voice-commits (buyer side) | Phone mockup, dark | Vera + Sarah voice |
| 2 | 0:18 - 0:28 | Marcus voice-commits (seller side) | Phone mockup, light | Vera + Marcus voice |
| 3 | 0:28 - 0:36 | Joint sign-off + money locks | Split-screen → lock animation | Lock-thunk SFX |
| 4 | 0:36 - 0:45 | Freelance variant (10s) | Cream dashboard, Lena + client | Vera voice |
| 5 | 0:45 - 0:55 | Dispute / TruthCheck moment (10s) | Cream + flagged dispute UI | Subtle tension piano |
| 6 | 0:55 - 1:03 | Multilingual moment | Polish text → English text | Vera multilingual |
| 7 | 1:03 - 1:10 | Reputation reveal | Profile card with verified badges | Reverse-bell |
| 8 | 1:10 - 1:18 | Closing — black A24 plate | Tagline + Stripe + ElevenLabs | Ambient resolves |

---

## Scene 0 — Cold open (0:00 – 0:05)

**Visual:**
- Pure black frame. No logo yet.
- Text appears centred, slow fade-in:
  - Line 1: "Every year, **$10 billion** is lost"
  - Line 2: "to peer-to-peer payment scams."
- Subtle particle/grain texture across the black.
- After 3.5s: text fades, replaced by Vouch logo mark (the pulsing purple dot) for 1.0s.

**Voice:**
- No spoken voice in this scene. Text-only.

**Audio:**
- Ambient piano starts at ~0:01, faint (0.08 volume).
- A single soft chime at 0:04 as Vouch logo appears.

**Submagic caption:**
- "$8 BILLION LOST TO P2P SCAMS EACH YEAR"

**Claude Design prompt (for this scene):**
```
Create a 5-second cinematic title card. Pure black background.
Two lines of text appear centred, Fraunces serif 600 italic, weight 500,
letter-spacing -0.025em, white with subtle gradient pull toward stripe purple #635bff.
Line 1: "Every year, $10 billion is lost" — fades in 0.4s, holds 1.4s.
Line 2: "to peer-to-peer payment scams." — fades in 0.4s after Line 1 starts, holds 2.4s.
At 3.5s, both lines fade out (0.5s). At 4.0s, a single 28px white circle with a
3px stripe-purple dot at its centre appears, gently pulses (scale 0.85 → 1.05 over 0.8s).
Subtle dark film grain across the entire frame. No logo wordmark yet.
At 5.0s, cut to next scene.
```

---

## Scene 1 — Sarah voice-commits (0:05 – 0:18)

**Visual:**
- iPhone mockup centred-left on screen, dark theme background behind.
- On the phone: Vouch app's voice intake screen — Sarah's avatar top-left, Vera waveform centred, push-to-talk button at bottom.
- Vera's waveform pulses softly during her question.
- When Sarah speaks, her own waveform appears below Vera's, growing as she talks.
- Live transcript text appears at the bottom of the phone screen as she speaks.
- Camera slowly zooms in 1.5% over 13 seconds (subtle Ken Burns).

**Voice (verbatim):**

> **Vera** *(0:06 – 0:10):* "Sarah, tell me what you're buying — model, condition, what's included."
>
> **Sarah** *(0:11 – 0:16):* "An iPhone 15, 256 gigs, white, unlocked. From Marcus. For $400. Shipped by Friday."
>
> **Vera** *(0:17 – 0:18):* "Got it. I'll check with Marcus."

**Audio:**
- Ambient piano continues.
- A soft "voice-listening" bloom SFX (~300ms) at 0:11 when Sarah's bars start animating.

**Submagic captions** (split across the scene):
- 0:06: "Vera: Sarah, tell me what you're buying."
- 0:11: "iPhone 15, 256 gigs, white, unlocked. $400 from Marcus."
- 0:17: "Vera: Got it. I'll check with Marcus."

**Claude Design prompt:**
```
Create a 13-second scene. Dark background (deep navy gradient #0a0a14 to black).
iPhone-shaped mockup centred-left. Inside the phone screen:

- Top: small circular avatar with initials "SC" + name "Sarah Chen" in 14px Inter 500
- Middle: large voice waveform indicator — Vera's. 10 bars, gradient stripe-purple to violet,
  height 110px, gap 5px, animating at 1.4s ease-in-out (heights vary 18-100%)
- Below Vera's waveform: a smaller live transcript appearing word-by-word in 16px Inter,
  white at 90% opacity. Text appears typewriter-style as Sarah speaks.
- Bottom: a 56px circular push-to-talk button, stripe-purple #635bff fill with subtle glow,
  pulsing scale 0.95-1.0 over 1.6s.

At 0:11s (when Sarah starts speaking), a second waveform appears BELOW Vera's,
slightly smaller (80px), with stripe-purple solid bars. Both waveforms animate
simultaneously, but Sarah's is more active while she's speaking.

Background behind phone: dark with two soft radial gradients (stripe-purple at 18%
opacity top-right, a24-red at 8% opacity bottom-left), animated very slowly.

Camera slowly zooms in 1.5% over the 13 seconds.

At end (0:18), Sarah's waveform fades out, Vera's continues briefly, then cut.
```

---

## Scene 2 — Marcus voice-commits (0:18 – 0:28)

**Visual:**
- Cut to a *different* phone, this time on a lighter background (suggesting it's Marcus's view, separately).
- Same Vouch app voice intake screen, but Marcus's avatar (MA) in top-left.
- Vera's waveform centred, then Marcus's waveform appears.
- Live transcript appears below, same typewriter style.
- Background subtly different (warmer/morning lighting suggesting time + location shift).

**Voice (verbatim):**

> **Vera** *(0:19 – 0:24):* "Marcus, Sarah wants to buy your iPhone 15 — 256 gigs, white, unlocked — for $400, shipped by Friday. Does that match?"
>
> **Marcus** *(0:25 – 0:28):* "Yeah, that's what we agreed. Royal Mail tracked. By Friday end of day."

**Audio:**
- Ambient piano continues, slightly more present.
- Same voice-listening bloom SFX at 0:25.

**Submagic captions:**
- 0:19: "Vera: Sarah wants to buy your iPhone for $400, shipped by Friday."
- 0:25: "Yeah, that's what we agreed. Royal Mail tracked."

**Claude Design prompt:**
```
Create a 10-second scene mirroring the previous, but for Marcus.
Same iPhone mockup composition, but:
- Background: lighter warm tones (cream + soft amber radials, suggesting morning daylight)
- Avatar: "MA" initials, name "Marcus Adebayo"
- Same Vera waveform centred (gradient stripe-purple to violet)
- Marcus's waveform (smaller, below) is solid stripe-purple
- Transcript: same typewriter style

At 0:25s (Marcus starts speaking), his waveform activates.

The scene should feel parallel to Scene 1 — same composition, opposite warmth —
to communicate "two strangers in different places, mediated by the same Vera."

At end, both waveforms fade simultaneously.
```

---

## Scene 3 — Joint sign-off + money locks (0:28 – 0:36)

**Visual:**
- Split-screen — Sarah's phone left, Marcus's phone right. Both showing Vera's "joint sign-off" screen.
- Centred between them: a large gold/purple gradient text "I AGREE" — appears twice, once spoken by each.
- Camera zooms out slightly to reveal both phones side-by-side.
- At 0:33: a $400 figure appears centred over the screens, in Fraunces serif tabular, large.
- At 0:34: the $400 visibly "locks" — animation: the digits compress slightly, a subtle ripple emanates outward, the colour shifts from white to indigo, a thin glow forms around the number.
- A status pill appears below: "IN_ESCROW — held by Stripe Connect" — in JetBrains Mono, with the pulsing locked-dot.

**Voice:**

> **Vera** *(0:28 – 0:32):* "Confirming: Sarah pays $400 for the iPhone, shipped Friday via Royal Mail. Marcus, Sarah — say 'I agree' to lock the deal."
>
> **Sarah** *(0:32 – 0:33):* "I agree."
>
> **Marcus** *(0:33 – 0:34):* "I agree."

**Audio:**
- Vera's voice, then both confirmations.
- At 0:34, **LOCK-THUNK SFX** (soft, ~150ms, slightly metallic but warm) timed with the $400 locking animation.
- Ambient piano deepens slightly at this point.

**Submagic captions:**
- 0:28: "Vera: Sarah pays $400 for the iPhone, shipped Friday."
- 0:32: "Both: I agree."
- 0:34: "$400 LOCKED IN ESCROW"

**Claude Design prompt:**
```
Create an 8-second scene with cinematic money-lock animation.

First 4 seconds (0:28-0:32):
Split-screen — two iPhone mockups side-by-side, both showing the Vouch joint sign-off
screen. On each phone: a deal summary card with item, price, terms, and a single
"I AGREE" button at the bottom (stripe-purple fill, pill radius 999, 14px Inter 500).
Centred between the two phones, hovering: the text "Joint sign-off" in 28px
Fraunces 500 white. Vera's waveform pulses centred-top.

At 0:32: text "I agree" appears in white Fraunces 600 italic centred between
the phones, briefly (0.5s), then duplicates with a slight offset suggesting two voices.

At 0:33: cut to a centred composition — both phones smaller, framing a large
$400 figure in Fraunces 600 tabular, 124px, white. At 0:34, the $400:
- compresses slightly (scale 1.0 → 0.96 over 200ms)
- a soft ripple emanates outward (radial blur reveal)
- colour shifts white → #7a6ce8 (the locked-purple) over 300ms
- a thin 1px stripe-purple glow forms around the digits
- a status pill appears below: "● IN_ESCROW · HELD BY STRIPE" in JetBrains Mono 11px
  uppercase, locked-soft background, locked colour
- pulse-dot before the label animates

Hold the locked composition for 1.5 seconds, then cut to next scene.

Background: black throughout, with subtle stripe-purple radial glow from below.
```

---

## Scene 4 — Freelance variant (0:36 – 0:45)

**Visual:**
- Cut to a different scene: cream background, no phone — a desktop browser-like frame showing the Vouch app dashboard.
- The dashboard shows two avatars (Lena + a client) at the top, with a deal flow visible:
  - "Project: Logo concepts × 3 — $200 — due Friday"
  - Status pill: AGREED → IN_ESCROW → DELIVERED → RELEASED
- The pills animate left-to-right across 5 seconds, each lighting up sequentially with a small chime.
- At the end, a $200 figure animates from "IN_ESCROW" → "RELEASED" — colour shifts indigo to success-green.

**Voice (verbatim):**

> **Vera** *(0:36 – 0:42):* "Same flow for freelancers. Lena agrees to deliver three logo concepts by Friday. $200 locks in escrow. She delivers. Voice-confirm. Released."

**Audio:**
- Ambient piano continues.
- Subtle "step" chimes (very soft, ~50ms) as each status pill lights up.
- At 0:44: **RELEASE-BELL SFX** (warm, ~400ms) when $200 turns green.

**Submagic captions:**
- 0:36: "Same flow for freelancers."
- 0:40: "AGREED → ESCROW → DELIVERED → RELEASED"
- 0:44: "$200 RELEASED TO LENA"

**Claude Design prompt:**
```
Create a 9-second scene with cream-paper aesthetic, showing the Vouch dashboard
for a freelance milestone.

Background: cream #f6f5f2 with subtle warm radial veil (indigo at 5% top-left,
a24-red at 3% bottom-right). Faint 56px grid pattern masked by radial gradient.

Centred: a browser-like frame (radius 12px, subtle drop shadow, top bar with
3 traffic-light dots). Inside the frame:

Top section: two avatars side-by-side. Left "LP" (Lena Park, freelance designer)
with subtitle "Designer · UK". Right "AC" (Acme Co, client) with subtitle "Client".
Between them: 14px Inter 500 ink: "Logo concepts × 3 · $200 · due Friday"

Middle: a horizontal progress timeline with 4 status pills (JetBrains Mono 11px
uppercase) and connecting lines:
  [AGREED] ─── [IN_ESCROW] ─── [DELIVERED] ─── [RELEASED]

Each pill starts grey/dim. Sequentially over 4 seconds (0:36-0:40), each one
"lights up" — gets its semantic colour (warning, locked, warning, success),
with the connecting line filling in indigo behind it. Small subtle chime on each.

At 0:42: a $200 figure appears centred below the timeline, Fraunces 600 tabular,
72px. Initially locked-indigo. At 0:44, with the bell SFX, it transitions to
success-green #2f7d57 with a soft outward glow.

Below: ink-muted caption: "Released to Lena's Stripe account · net $190"

Hold final composition for 1 second, then cut.
```

---

## Scene 5 — Dispute (0:45 – 0:55)

**Visual:**
- Cut to a different deal — same cream/dashboard aesthetic, but with a red callout.
- Top of frame: "DISPUTE OPENED" in JetBrains Mono uppercase, a24-red.
- Below: a glass card showing two voice clips side-by-side:
  - Left: Marcus's recorded statement (waveform thumbnail) — "Phone is perfect, no scratches."
  - Right: Sarah's dispute claim (waveform thumbnail) — "Screen is cracked when it arrived."
- Vera's waveform pulses between them.
- Small ⚠ icon flashes briefly in the corner (5 seconds total of TruthCheck) — this is the deliberate "soft signal" we agreed to keep low-key.
- Resolution status: "AI flagged for human review" — appears in calm grey, not alarmist.

**Voice (verbatim):**

> **Vera** *(0:45 – 0:54):* "If something goes wrong, the recording is the evidence. Vera plays back what was promised, gathers both sides, and most disputes resolve in minutes — not weeks."

**Audio:**
- Slight tension shift in the piano (single sustained low note, ~1s).
- Returns to calm by 0:54.

**Submagic captions:**
- 0:45: "If something goes wrong..."
- 0:48: "Voice IS the evidence."
- 0:52: "Most disputes resolve in minutes — not weeks."

**Claude Design prompt:**
```
Create a 10-second scene showing a dispute resolution flow.

Cream background, same dashboard aesthetic as scene 4.

Top: a callout banner — "DISPUTE OPENED · DEAL_47291" in JetBrains Mono 11px
uppercase, a24-red text on a a24-red-soft background, with the small pulsing
red dot prefix. Spans width of the frame.

Centred main area: two glass cards (blur(22px) saturate(170%), cream-card-glass-hi
background, 16px radius, glass-edge border) side-by-side:

  Left card:
    Header: "MARCUS · SELLER · 14 MAY 14:31"
    Waveform thumbnail (frozen, 5 bars, indigo, height 32px)
    Quote (Fraunces 500 italic, 16px ink): "Phone is perfect, no scratches."
    Small play button bottom-right (▶)

  Right card:
    Header: "SARAH · BUYER · 15 MAY 11:08"
    Waveform thumbnail (frozen, indigo)
    Quote (Fraunces italic): "Screen is cracked when it arrived."
    Small play button

Between the cards, centred: Vera's waveform pulses, with the small text
"VERA MEDIATING" below in mono uppercase.

At 0:48, a subtle ⚠ icon (a24-red) appears in the top-right of the right card,
for 1.2 seconds, then fades. Below it appears: "Flagged for human review"
in 11px ink-muted Inter.

At 0:52: a resolution panel slides up from the bottom showing:
  "Photos requested · Tracking verified · Decision in 14 min"
  in 13px Inter, ink-muted, with small ✓ icons.

Hold for 1 second. Cut.
```

---

## Scene 6 — Multilingual (0:55 – 1:03)

**Visual:**
- Cut to a fast moment showing cross-border deals.
- A phone mockup showing Vera's transcript translating in real-time.
- Left half of phone: Polish text appearing word-by-word ("Cześć Marcus, Sarah chce kupić...")
- Right half: English translation appearing in sync ("Hi Marcus, Sarah wants to buy...")
- A small flag or language indicator pulses at the top.

**Voice (verbatim):**

> **Vera** *(0:55 – 1:02):* "Cross-border deals — in any language. Vera speaks Polish to Marcus, English to Sarah. The deal still works."

**Audio:**
- Ambient piano resumes upward motion.

**Submagic captions:**
- 0:55: "Cross-border deals · in any language."
- 0:59: "Polish ↔ English ↔ Spanish ↔ Japanese"

**Claude Design prompt:**
```
Create an 8-second scene showing real-time multilingual translation.

Background: gradient from cream (left) to a deeper warm tone (right), suggesting
geographic distance. Subtle world-map silhouette at 6% opacity in background.

Centred: a phone-shaped mockup (vertical). Inside the phone screen, two columns
divided by a vertical hairline:

Left column header: 🇵🇱 "POLSKI" in mono 11px uppercase, ink-muted
Right column header: 🇬🇧 "ENGLISH" in mono uppercase

Below headers, two synchronized text blocks:

Left (Polish, appears word-by-word, typewriter style):
  "Cześć Marcus,"
  "Sarah chce kupić"
  "twojego iPhone'a"
  "za 400 funtów."
  (Fraunces 500 italic, 17px, ink)

Right (English, appears word-by-word in sync, ~200ms offset):
  "Hi Marcus,"
  "Sarah wants to buy"
  "your iPhone"
  "for $400."
  (same styling)

Below the phone: a row of language chips fading in/out:
  [POLSKI] [ESPAÑOL] [日本語] [DEUTSCH] [FRANÇAIS]
  Each chip: cream-alt background, JetBrains Mono 11px, indigo text.

Subtle hum sound continues. Translation effect should feel seamless, not glitchy.

At end, cut to next scene.
```

---

## Scene 7 — Reputation (1:03 – 1:10)

**Visual:**
- Cut to a profile card view — Sarah's user profile in the Vouch app.
- Card shows:
  - Large avatar
  - Name + "VERIFIED" green pill
  - Stats: "47 deals · 100% release rate · Member since Mar 2026"
  - 5-star rating cluster
  - Small badge: "Stripe-verified ID · ElevenLabs voice on file"
- A "Trusted Seller" badge animates in last, with a soft chime.

**Voice (verbatim):**

> **Vera** *(1:03 – 1:09):* "Every deal builds your reputation. Real identity, real voice, real track record. Portable across the web."

**Audio:**
- A reverse-bell SFX (~300ms) when "VERIFIED" badge pops in at 1:05.
- A small chime when "Trusted Seller" appears at 1:09.

**Submagic captions:**
- 1:03: "Every deal builds your reputation."
- 1:07: "Verified identity · Verified voice · Portable score."

**Claude Design prompt:**
```
Create a 7-second scene showing a user reputation profile.

Background: cream with subtle warm radial gradient (indigo at 5%, top-right).

Centred: a glass profile card (blur(22px) saturate(170%), cream-card-glass-hi,
24px radius, generous shadow). Card dimensions ~480px wide × 380px tall.

Inside the card:
- Top-left: large circular avatar (88px), gradient background indigo→stripe-purple,
  initials "SC" in white Fraunces 500, 32px.
- Top-right: a small "VERIFIED" pill — green-success bg, mono 11px white, with
  ✓ icon prefix. Appears at 1:05 with a subtle pop animation (scale 0.9→1.05→1.0
  over 400ms).
- Below avatar: name "Sarah Chen" in Fraunces 500, 28px. Subtitle "Beta user
  since Mar 2026" in 13px Inter ink-muted.
- Stats row (3 columns):
    47 deals | 100% release | $19,200 transacted
    Each number Fraunces 500 32px tabular, label below in mono 11px uppercase.
- A row of 5 stars in indigo (Lucide-style), filled.
- Bottom: a row of badges (pills, glassy):
    [● Stripe-verified ID]
    [● ElevenLabs voice on file]
    [● Cross-border verified]
  Each: cream-alt bg, mono 11px, with semantic-coloured dot.

At 1:09, a final "Trusted Seller" badge slides in from below the card —
gradient indigo→stripe-purple background, white text, Fraunces 500 16px,
with subtle bounce arrival.

Background ambient pulse: very faint indigo halo behind the card, breathing
slowly.
```

---

## Scene 8 — Closing (1:10 – 1:18)

**Visual:**
- Cut back to pure black A24 plate.
- Centred: large headline in Fraunces serif 600 — "Trust the handshake."
- Below, second line italic gradient: "*Hold the money.*"
- Below that, in smaller Inter: "5% per deal. No subscriptions."
- A stripe-purple CTA button: "Start your first deal →"
- At the very bottom: "POWERED BY STRIPE + ELEVENLABS" in JetBrains Mono.

**Voice (verbatim):**

> **Vera** *(1:11 – 1:17):* "Trust the handshake. Hold the money. Five per cent per deal. Built on Stripe and ElevenLabs. Try Vouch."

**Audio:**
- Ambient piano resolves — final chord, gentle decay over 5 seconds.
- No SFX in this scene.

**Submagic captions:**
- 1:11: "Trust the handshake. Hold the money."
- 1:15: "5% per deal · No subscriptions"
- 1:18: "VOUCH · POWERED BY STRIPE + ELEVENLABS"

**Claude Design prompt:**
```
Create an 8-second cinematic closing card. Pure black background with a soft
radial stripe-purple glow centred (rgba(99,91,255,0.22) at centre, fading to
transparent at edges).

Centred composition:
- Line 1 (Fraunces 600, 96px, white): "Trust the handshake."
  Appears at 1:11, fades in over 0.6s.
- Line 2 (Fraunces 500 italic, 96px, gradient text fill — linear-gradient
  135deg from #ffffff 0% to #c4b5fd 50% to #635bff 100%): "Hold the money."
  Appears at 1:12, fades in over 0.6s.
- Line 3 (Inter 400, 18px, white-dim rgba(255,255,255,0.72)):
  "5% per deal. No subscriptions."
  Appears at 1:14, fades in over 0.4s.
- CTA button: Stripe purple #635bff fill, white text "Start your first deal →"
  in Inter 500 16px, padding 16px 36px, border-radius 6px, soft purple glow
  beneath. Appears at 1:15, scale-up 0.92→1.0 over 0.3s.
- Bottom strip: small text "VOUCH · POWERED BY STRIPE + ELEVENLABS" in
  JetBrains Mono 11px uppercase, white-mute rgba(255,255,255,0.48),
  letter-spacing 0.14em. Appears at 1:17, fades in over 0.4s.

Subtle ambient grain across the entire frame. The faint stripe-purple radial
glow behind everything breathes very slowly (scale 1.0 → 1.02 over 4s).

Final frame holds for ~0.5s after all elements arrive, then fades to black
at 1:18.
```

---

## Voice generation cheat sheet (paste into ElevenLabs)

### Vera (mediator)

**Voice Design prompt** (use ElevenLabs Voice Design to create the persona):

> *Calm, warm, professional female mediator with a light British accent (RP-adjacent, not BBC newsreader, not London regional). Late 20s / early 30s. Smiles in her voice. Slightly slower than conversational tempo — deliberate, measured, mediator-tempo. Lower-end of variability — steady, not theatrical. Sounds like a calm bank manager who also runs a community choir. Trustworthy, never sentimental. Settings: stability 65, similarity 75, style 20.*

**Lines to generate** (all Vera, in order):

```
[Scene 1, ~4s]: Sarah, tell me what you're buying — model, condition, what's included.
[Scene 1, ~2s]: Got it. I'll check with Marcus.
[Scene 2, ~6s]: Marcus, Sarah wants to buy your iPhone 15 — 256 gigs, white, unlocked — for $400, shipped by Friday. Does that match?
[Scene 3, ~4s]: Confirming: Sarah pays $400 for the iPhone, shipped Friday via Royal Mail. Marcus, Sarah — say "I agree" to lock the deal.
[Scene 4, ~7s]: Same flow for freelancers. Lena agrees to deliver three logo concepts by Friday. $200 locks in escrow. She delivers. Voice-confirm. Released.
[Scene 5, ~9s]: If something goes wrong, the recording is the evidence. Vera plays back what was promised, gathers both sides, and most disputes resolve in minutes — not weeks.
[Scene 6, ~7s]: Cross-border deals — in any language. Vera speaks Polish to Marcus, English to Sarah. The deal still works.
[Scene 7, ~6s]: Every deal builds your reputation. Real identity, real voice, real track record. Portable across the web.
[Scene 8, ~6s]: Trust the handshake. Hold the money. Five per cent per deal. Built on Stripe and ElevenLabs. Try Vouch.
```

### Sarah (buyer in main story)

**Voice description for Voice Design:**

> *American female, mid-20s, energetic but careful. Slight upward inflection at the end of statements. Friendly, relatable. Sounds like someone who's been burned by a Marketplace deal before and is being a bit cautious now but still warm. Settings: stability 50, similarity 75, style 35.*

**Lines:**

```
[Scene 1, ~5s]: An iPhone 15, 256 gigs, white, unlocked. From Marcus. For $400. Shipped by Friday.
[Scene 3, ~1s]: I agree.
```

### Marcus (seller in main story)

**Voice description:**

> *American male, mid-20s, casual but security-conscious. Slightly reserved, working-professional energy. Distinguishable from Sarah immediately (deeper, slower). Sounds like someone who's done a few sales like this and knows the drill. Settings: stability 55, similarity 75, style 25.*

**Lines:**

```
[Scene 2, ~3s]: Yeah, that's what we agreed. Royal Mail tracked. By Friday end of day.
[Scene 3, ~1s]: I agree.
```

---

## Audio asset list (royalty-free sourcing)

| Asset | Source | Search terms | Approx length |
|---|---|---|---|
| Ambient piano bed | [Pixabay](https://pixabay.com/music/) / [Mixkit](https://mixkit.co/free-stock-music/) | "soft piano ambient minimal" | 90s loop, gentle |
| Lock-thunk SFX | Pixabay / Mixkit / Zapsplat | "lock click subtle" | ~150ms |
| Release-bell SFX | Pixabay | "soft bell chime warm" | ~400ms |
| Voice-listening bloom | Pixabay | "ui notification bloom" | ~300ms |
| Reverse-bell (reputation) | Pixabay | "reverse chime ui" | ~300ms |
| Step-chime (status progress) | Mixkit | "ui tick subtle" | ~50ms |

Keep the entire mix conservative — Vera's voice should be the loudest element, ambient piano at ~25% of Vera's volume, SFX at ~40% volume but quick decay.

---

## Edit checklist (CapCut / Submagic flow)

1. **Generate all Vera/Sarah/Marcus voice lines in ElevenLabs.** Save each as a separate WAV. Time them out — confirm each fits its slot.
2. **Generate each Claude Design scene.** Export each as HTML, screen-record via Claude2Video or screen-record at 1920×1080 60fps. Save as separate MP4s.
3. **In CapCut:**
   - Drop all scene MP4s on the timeline in order. Trim to exact times.
   - Drop ambient piano bed underneath everything, low volume.
   - Drop Vera/Sarah/Marcus voice clips at scene-start markers.
   - Drop SFX clips at exact frame timings.
   - Add subtle 200ms crossfades between scenes (except hard cuts within the same act).
4. **In Submagic:**
   - Upload final mix.
   - Generate auto-captions.
   - Override with the verbatim caption text from this script (cleaner than auto).
   - Style: Fraunces serif (if available — else Inter 600), white, with subtle drop shadow.
   - Position: lower third, with safe margins for 9:16, 1:1, 16:9 cuts.
5. **Export three cuts:**
   - 9:16 vertical (IG Reel, TikTok)
   - 1:1 square (LinkedIn)
   - 16:9 horizontal (X, YouTube)

---

## Submission text (cover description for ElevenHacks form)

```
Title: Vouch — voice-recorded escrow for freelancers and high-value P2P sellers
Description (1-2 paragraphs):
  Vouch is voice-recorded escrow built on Stripe + ElevenLabs. Sellers and buyers
  agree to the terms in a 60-second voice call with Vera, our AI mediator.
  Stripe holds the money. When the item or work is delivered, a 10-second voice
  confirmation releases the money. If there's a dispute, the original voice
  recordings are the evidence — and Vera mediates most cases in minutes,
  not weeks.
  
  We replaced "handshake" — broken on the internet — with voice-recorded contracts
  + Stripe escrow + AI mediation. 5 ElevenLabs APIs structurally required: ConvAI
  (Vera live), Voice Design (her persona), Scribe (transcript-as-contract), TTS
  (contract readback), and Multilingual TTS (cross-border deals). 5 Stripe primitives:
  Connect (custodial escrow), Identity (KYC both sides), Subscriptions (premium tier),
  Customer Portal (self-serve), Tax (multi-jurisdiction).
  
  $10.2bn is lost annually to P2P payment fraud. 20% is what Upwork takes from
  freelancers. Vouch is 5% per deal — to both sides protected.

Tags: stripe, elevenlabs, escrow, voice, fintech, freelancers, p2p, agi
```

---

*Demo script locked 2026-05-15. Ready for production Days 5-6.*
