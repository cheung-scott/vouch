# Claude Design Scene Prompts — Vouch Demo Video

> **For Day 6 master render**. Paste each prompt into Claude Design (claude.ai/design). One scene per beat. Drop the rendered MP4 into `vouch-demo-remotion/public/scenes/0X.mp4` (e.g. `01.mp4` for Beat 1).
>
> **Brand constants** to mention in every prompt for consistency:
> - Mode: Stripe × A24 marketing — pure black canvas, oversized italic serif display, Stripe purple `#635bff` as primary, A24 red `#d9351c` as one-off accent
> - Display font: Fraunces (italic for the emphasised word per headline)
> - Body font: Inter
> - Mono: JetBrains Mono (uppercase eyebrows + technical labels, letter-spacing 0.14em)
> - Aspect: 1920×1080 (16:9), 30fps unless stated otherwise
> - Voice: clean, confident, fintech-product-anthem energy — not playful, not corporate
>
> **Source of truth**: `docs/demo-video-script-v3.md`. If a prompt below disagrees with the script, the script wins.

---

## Scene 01 — Hook + Chrome extension entry (0:00–0:05, 5s)

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: A clean screen recording aesthetic of a desktop browser window showing a real eBay product listing — "iPhone 15 256GB, white, unlocked" with seller "Marcus Adebayo" and price "$400.00". The listing looks authentic, with eBay's familiar layout.

ANIMATION SEQUENCE:
- 0.0s–0.8s: Listing page loads, Sarah's cursor hovers over the price area
- 0.8s–1.5s: A "Pay with Vouch" button slides in from the right edge of the page, positioned next to eBay's "Buy It Now" button. The Vouch button has a subtle indigo-to-purple gradient background (#5266eb to #635bff) with a soft glow and gentle pulse animation
- 1.5s–2.5s: The cursor moves toward the Vouch button with deliberate ease
- 2.5s–3.0s: Cursor click — a small ripple emanates from the click point
- 3.0s–5.0s: A cream-coloured surface (#f6f5f2) wipes UP from the bottom of the frame, filling the screen, ending in clean cream

AUDIO: silent (music + SFX added in post)

TYPE OVERLAY: "Receive your money, on time." — Fraunces italic, large, hero gradient on "on time" (white → #c4b5fd → #635bff), word-by-word reveal timed to the first beat of the music (assume kick lands at 0.5s). Position: bottom-left margin, anchor low.

REFERENCES: Stripe.com home page energy, Linear.app product reveal style, real eBay UI (recognisable but not infringing).

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration.
```

---

## Scene 02 — Solution intro + product reveal (0:05–0:09, 4s)

```
Create a 4-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: A cream surface (#f6f5f2) with the VOUCH wordmark and a voice-waveform indicator landing centre-frame.

ANIMATION SEQUENCE:
- 0.0s–0.8s: VOUCH wordmark wipes in from below — Fraunces 600 weight, dark ink colour (#2a2924), large (~140px)
- 0.8s–2.0s: A 5-bar voice waveform pulses next to the wordmark, indicating "Vera is here" — each bar animates with a gentle breathing motion, indigo colour (#5266eb)
- 2.0s–3.5s: Behind the wordmark, a faint blurred preview of the /new page partially shows (low opacity, blurred)
- 3.5s–4.0s: Light cream surface fills frame to prepare for next beat

TYPE OVERLAY:
- Under wordmark: "Receive your money, on time." lingers as secondary line, mono uppercase, letter-spacing 0.14em, smaller (~22px), ink-muted (#5a5548)

AUDIO: silent — light tactile UI tick lands at 0.8s when wordmark seats (added in post)

STYLE: Clean fintech product reveal — Linear or Stripe.com level polish. Confident but not boastful.

OUTPUT: MP4, 1920×1080, 30fps, ~4s duration.
```

---

## Scene 03 — Vera buyer intake (0:09–0:18, 9s) ⭐ DIEGETIC

```
Create a 9-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: A clean web app interface — Vouch's /new page on a cream background (#f6f5f2). Left side: Vera's voice-waveform indicator (animating), her speech bubble shows a question. Right side: a panel of "captured terms" cards that fill in as the conversation progresses.

PRE-FILLED FIELDS (visible from start, slightly faded):
- Item: "iPhone 15, 256GB, white, unlocked"
- Seller: "Marcus Adebayo"
- Amount: "$400 GBP"
(Each prefilled card has a small chip indicating "From eBay")

ANIMATION SEQUENCE:
- 0.0s–1.5s: Vera's waveform pulses (she's speaking — "When and how is it being delivered?" in real audio added in post). Her question appears as a subtle text bubble on the left.
- 1.5s–3.0s: Sarah's voice waveform animates on the right (she's answering — "Royal Mail tracked, by Friday."). A new "Delivery" card flies into the captured-terms panel from the right edge with a soft chime visual.
- 3.0s–5.5s: Vera asks Q5 (off-screen, subtitled or hinted). Sarah's waveform animates. A 5th card "Notes" flies in.
- 5.5s–8.5s: All five cards now stacked, gently breathing. Vera's waveform pulses one more time as she invites confirmation.
- 8.5s–9.0s: Whip-pan / lateral slide effect prepares the transition to the next beat.

TYPE: All UI in Inter — small, dense, Mercury×Linear app mode. Eyebrow labels in JetBrains Mono uppercase. Captured-term cards in glassmorphic style (rgba(255,253,248,0.85) background + blur).

VOICE WAVEFORMS: Vera's waveform is indigo (#5266eb), 5 bars, ~28px tall, breathing animation. Sarah's waveform is darker, similar shape.

OUTPUT: MP4, 1920×1080, 30fps, ~9s duration.
```

---

## Scene 04 — Vera seller agreement + multilingual (0:18–0:28, 10s) ⭐ MULTILINGUAL MOMENT

```
Create a 10-second 16:9 1920×1080 motion video clip at 30fps. THIS IS THE MOST IMPORTANT VISUAL OF ACT 1 — the multilingual reveal.

VISUAL: A clean web app interface — Vouch's /deal/[ref]/seller page on cream background. Marcus's avatar circle (upper-left) with a small location tag underneath: "Marcus · Warsaw, PL". Voice-waveform indicator below.

KEY ANIMATION — LETTER-BY-LETTER LANGUAGE MORPH:

- 0.0s–4.0s: Vera's waveform animates as she recites Sarah's terms in Polish (real Vera audio added in post, ~4s).
  Subtitled under Marcus's avatar in JetBrains Mono: "Sarah ustawiła ofertę..." then "...przeczytaj warunki..." then summary line "...iPhone 15, $400, Royal Mail Tracked..."

- 4.0s–5.0s: Marcus's voice waveform pulses — he says "Zgadzam się." (real audio added in post).

- 5.0s–7.0s: ⭐ THE HERO ANIMATION — the Polish phrase "Zgadzam się" appears under Marcus's avatar in large JetBrains Mono (~36px), then transforms letter-by-letter into the English equivalent "I agree" — like Submagic-style word-morph but at the LETTER level. Each Polish letter individually fades/swaps to its English-equivalent letter (or sometimes a different letter entirely as the words don't align 1:1). The morph takes ~1.5s, finishing on a clean "I agree" in the same font.

- 7.0s–9.0s: An "I agree" button appears below the morphed text, pulses with the Stripe purple glow (#635bff), then a cursor taps it (or the button auto-fires for hands-free demo).

- 9.0s–10.0s: Lock-thunk transition — frame shakes briefly (2-3px), prepping for Scene 05's escrow lock.

STYLE: Cream surface (#f6f5f2), Marcus avatar circular with location tag in mono, voice waveform indigo. The letter morph itself should feel mechanical-but-elegant — Stripe-shipping-card-flip energy, not childish typewriter.

OUTPUT: MP4, 1920×1080, 30fps, ~10s duration.
```

---

## Scene 05 — Money locks in escrow (0:28–0:33, 5s) ⭐ HERO ANIMATION OF ACT 1

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps. PEAK MOMENT.

VISUAL: Big cream surface (#f6f5f2). Centre-frame: an animated vault / escrow lock visual.

ANIMATION SEQUENCE:
- 0.0s–1.0s: A floating "$400" amount counter sits centre-frame, slightly bouncing
- 1.0s–2.5s: The $400 transforms / slides into a stylised mechanical lockbox or vault graphic — like a Stripe-flavoured safe. Coins/notes scatter inwards and consolidate. Status pill (top-right corner) ticks through: "AGREED" → "AWAITING_CONFIRM" → settles on "IN_ESCROW".
- 2.5s–3.0s: ⭐ VAULT SNAPS SHUT — bold satisfying mechanical click. The vault door visually slams closed with a brief 2-3px screen shake. SFX added in post (lock-thunk, 150ms, low-frequency).
- 3.0s–4.5s: Tagline lands AS the money locks: "Receive your money, on time." in small mono under the vault, letter-spacing 0.14em, ink-muted colour
- 4.5s–5.0s: Brief hold, then cinematic time-skip whoosh begins prepping the next beat

STYLE: Mechanical satisfaction — Apple-launch-event grade. Vault should feel HEAVY. Coin scatter should feel TACTILE. The screen shake on the snap should be felt, not just seen.

COLORS: Cream background, vault in warm metallic (gold/brass with brushed-steel highlights, or deep indigo for Vouch consistency — pick whichever reads more "secure money" to you). Status pill in muted purple (#7a6ce8) when settled on IN_ESCROW.

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration.
```

---

## Scene 06 — Time skip (0:33–0:37, 4s)

```
Create a 4-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: A calendar visualisation — pages fanning forward rapidly. Day counter ticks up at the bottom.

ANIMATION SEQUENCE:
- 0.0s–0.5s: Calendar page lands centre-frame, showing today's date (e.g. "16 May")
- 0.5s–3.0s: Pages fan/flip forward rapidly, day counter at bottom ticking: 1 → 2 → 3 → 4 → 5. Subtitle in Fraunces italic, small: "5 days later."
- 3.0s–4.0s: Final page settles. Cinematic whoosh prepares next beat.

STYLE: Tactile, paper-based — like a 1960s movie's calendar-flip montage but more digital. Cream background (#f6f5f2), pages in slightly warmer cream (#fbfaf6), text in dark ink.

AUDIO: silent — tick-tick-tick paper-flip whoosh added in post

OUTPUT: MP4, 1920×1080, 30fps, ~4s duration.
```

---

## Scene 07 — Item arrived + voice confirm (0:37–0:42, 5s) ⭐ DIEGETIC

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: A clean view of Sarah's perspective: iPhone box delivered on her doorstep with a Royal Mail tracking label visible. Cream surface beneath. Vera's voice-waveform prompt visible overlaid on the right.

ANIMATION SEQUENCE:
- 0.0s–1.0s: Package lands gently into frame (zoom-in or down-fade). Tracking label clearly readable: "Royal Mail Tracked · Delivered 21 May".
- 1.0s–2.5s: Vera's waveform pulses on the right (she's asking "It's arrived. Does it match?" in real audio added in post).
- 2.5s–3.5s: Sarah's voice waveform pulses (she's saying "Yes." in real audio added in post). A soft chime visual.
- 3.5s–4.5s: A checkmark begins to form centre-frame — partial draw, not yet complete (the full reveal happens in Scene 08).
- 4.5s–5.0s: Frame holds, ready for the payoff.

STYLE: Cinematic-but-clean. The box can be photographed/illustrated. Voice waveforms in indigo. The not-yet-complete checkmark should feel like anticipation.

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration.
```

---

## Scene 08 — Tick + money released (0:42–0:47, 5s) ⭐ ACT 1 PAYOFF

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps. THIS IS THE EMOTIONAL CLIMAX OF ACT 1.

VISUAL: Big centre-frame ✓ tick animation. $400 amount counter releases from the escrow vault and slides toward Marcus's avatar.

ANIMATION SEQUENCE:
- 0.0s–1.5s: ⭐ HERO TICK — bold scale-in checkmark, satisfying weight. The tick is large (centre 40% of frame), drawn in Stripe purple (#635bff), with a soft glow on completion.
- 1.5s–3.5s: The $400 counter slides out of the vault graphic (left side of frame) and animates toward Marcus's avatar on the right. Coin-flow visual along the path. Marcus's avatar shows a small notification chime visual.
- 3.5s–4.5s: Tagline lands LARGE: "Receive your money, on time." — Fraunces semibold, italic on "on time", hero gradient (white → violet-300 → Stripe purple). Marcus's avatar and the tagline share the final frame.
- 4.5s–5.0s: HARD CUT to BLACK at exactly frame 1410 (= 0:47.00 at 30fps). The music drops at this moment.

STYLE: Cinematic, satisfying, deserved. Apple-launch-event grade. The tick should feel WEIGHTED. The money slide should feel like the resolution of a promise.

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration. END WITH FULL BLACK.
```

---

## Scene 09 — Dispute opens (0:47–0:52, 5s)

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps. ACT 2 BEGINS.

VISUAL: HARD CUT FROM BLACK to a photograph (or photorealistic illustration) of a cracked iPhone screen with the same Royal Mail tracking label visible nearby on a desk.

ANIMATION SEQUENCE:
- 0.0s–1.0s: Cracked iPhone fades up from black on the music drop (timed to land at 0.0s of this clip / 0:47.00 in the master). Photo is clear, crack is undeniable.
- 1.0s–4.0s: Tagline 2 types in under the photo: "Every deal, kept." in Fraunces italic, hero gradient on "kept" (deep red → A24 red #d9351c → indigo).
- 4.0s–5.0s: Smooth cross-dissolve begins, prepping the next beat.

STYLE: Sombre, serious, but not maudlin. The cracked phone should look like a real product photo — not theatrical. The gradient on "kept" should pull in the A24 red as the moat colour for Act 2.

AUDIO: silent — sub-bass impact on image land + music drop continues (added in post)

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration.
```

---

## Scene 10 — Vera replays original promise (0:52–0:57, 5s) ⭐ MOAT ANIMATION OF ACT 2

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps. THIS IS THE DISPUTE MOAT MOMENT.

VISUAL: Two stacked cards on cream background:
- TOP CARD: Vera's replay UI. Title: "Marcus said:" in mono uppercase, letter-spacing 0.14em. Below: quote in Fraunces italic — "no scratches, original box." An audio waveform animates UNDERNEATH the quote, with the word "scratches" SCRUBBING / HIGHLIGHTED as it plays.
- BOTTOM CARD: Sarah's evidence — a thumbnail of the cracked iPhone photo with a delivery-day timestamp below ("21 May 2026 · 11:08") and a small "EVIDENCE" badge in A24 red.

ANIMATION SEQUENCE:
- 0.0s–1.0s: Top card slides in from above, bottom card slides in from below, both settle centre-frame, ~600px width each
- 1.0s–3.0s: Top card's waveform plays — Marcus's actual voice clip "no scratches" highlighted (~0.5s of real audio added in post, scrubbed visually as it plays). The word "scratches" pulses red briefly.
- 3.0s–4.0s: Bottom card's border glows with a soft A24 red — visual emphasis on the contradiction.
- 4.0s–5.0s: Cards begin to merge / consolidate, preparing for the verdict frame.

STYLE: This is the product showing its own evidence chain. Solemn, clinical, unambiguous. The waveform scrub on the top card is the most important micro-interaction — it should feel like dragging a marker on a sound editor.

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration.
```

---

## Scene 11 — Verdict + refund (0:57–0:62, 5s)

```
Create a 5-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: A verdict card slides in centre-frame. Below it, an animation of $400 sliding back from the escrow vault toward Sarah's avatar.

ANIMATION SEQUENCE:
- 0.0s–1.5s: Verdict card slides in from above, lands authoritatively. Card content:
    - Title: "RULING" (mono uppercase, letter-spacing 0.14em, A24 red)
    - Body (Fraunces): "Refund to Sarah. Marcus's account flagged."
    - Status pill at bottom: "REFUNDED" in red
- 1.5s–4.0s: Below the card, animated coin-stream / money-particles flow back from a small vault graphic on the right to Sarah's avatar on the left. Counter ticks up on Sarah's side: "$0 → $400".
- 4.0s–5.0s: Tagline lands small under the verdict: "Every deal, kept." in mono, ink-muted. Brief hold, prep for close.

STYLE: Authoritative, fair, not gloating. The money reversal animation should feel deliberate — the system did its job.

AUDIO: silent — soft chime on verdict land + coin/cash sweep SFX (added in post)

OUTPUT: MP4, 1920×1080, 30fps, ~5s duration.
```

---

## Scene 12 — Close — brand synthesis (0:62–0:65, 3s)

```
Create a 3-second 16:9 1920×1080 motion video clip at 30fps.

VISUAL: Centred composition on cream surface (#f6f5f2).

ANIMATION SEQUENCE:
- 0.0s–1.5s: VOUCH wordmark fades in centre-frame — Fraunces 600 weight, large (~180px), dark ink colour (#2a2924). Slow, deliberate fade-in.
- 1.5s–3.0s: Under the wordmark, the brand line types in: "Trust the handshake. Hold the money." in JetBrains Mono uppercase, letter-spacing 0.14em, ink-muted colour (#5a5548). All three taglines (Receive your money / Every deal kept / Trust the handshake) feel synthesised here.

STYLE: Confident, quiet, deserved. No flourishes — this is the brand line landing. Apple "Designed in California" energy.

AUDIO: silent — music fades naturally (added in post)

OUTPUT: MP4, 1920×1080, 30fps, ~3s duration. End with the wordmark holding centre-frame.
```

---

## Render order + drop-in path

```
Beat 1  →  public/scenes/01.mp4
Beat 2  →  public/scenes/02.mp4
Beat 3  →  public/scenes/03.mp4
Beat 4  →  public/scenes/04.mp4   ⭐ multilingual moment
Beat 5  →  public/scenes/05.mp4   ⭐ Act 1 hero animation
Beat 6  →  public/scenes/06.mp4
Beat 7  →  public/scenes/07.mp4
Beat 8  →  public/scenes/08.mp4   ⭐ Act 1 payoff
Beat 9  →  public/scenes/09.mp4
Beat 10 →  public/scenes/10.mp4   ⭐ Act 2 moat moment
Beat 11 →  public/scenes/11.mp4
Beat 12 →  public/scenes/12.mp4
```

After dropping each MP4, run `python scripts/analyze-scene.py public/scenes/0X.mp4 --hint=<beat-name>` to populate `scene-events.json` for the two-axis audio sync (P-011).

## Quality bar

The ⭐ scenes (4, 5, 8, 10) are the demo's emotional load-bearing beats. Spend disproportionate effort on those. Beats 1, 2, 6, 12 are connective tissue — competent quality is sufficient.

If Claude Design produces a result that's "good but not great" on a star beat, regenerate up to 3 times before settling. For non-star beats, accept first-pass output unless visibly broken.
