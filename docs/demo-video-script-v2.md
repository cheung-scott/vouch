# Vouch — Demo Video Script v2

**Length:** 65 seconds (Track 4 length, fade-out at ~60s, music tail to 65s, CapCut polishes the final fade)
**Music:** Track 4 — `hitslab-product-launch-advertisement-commercial-music-301409.mp3`
**Editorial frame:** Confident product anthem. Two-act structure. Vera silent in Act 2 (dispute). Chrome extension is the entry point.

---

## What changed from v1

| Change | Why |
|---|---|
| **Dual taglines instead of one universal slogan** | Each persona (freelancer / P2P) gets its own anchor without compromise |
| **Tagline 1 (Act 1):** *"Receive your money, on time."* (freelancer/seller angle) | Locked. Hero italic gradient on "**on time**" in the opening reveal |
| **Tagline 2 (Act 2):** *"Every deal, kept."* (buyer-protection / P2P angle) | Locked. Lands on the dispute pivot at 0:47 + verdict at 0:57 |
| **Closing brand line:** *"Trust the handshake. Hold the money."* | Becomes the synthesis line on the final frame |
| **Chrome extension is the ENTRY POINT** | Demo opens on Sarah on eBay, not on a black plate. Shows distribution + context in 3 seconds |
| **Multilingual integrated into Beat 4** (Vera seller agreement) | Letter-by-letter Polish→English transformation animation under Marcus's "Zgadzam się" |
| **Vera silent in dispute beats 9–11** | Music + visuals carry the climax. Trailers do this on purpose |
| **No standalone stat beat** | The dispute scene IS the stat in narrative form — more persuasive than "49% of scams happen on marketplaces" said out loud |

**Scope promotion:** Chrome extension moves from "Day 5 stretch" to "Day 4 must-have" — it's now the demo's narrative entry point. Build spec at the bottom of this doc.

---

## Track-mapped shot list (v2)

Each beat:
- **Time** — start–end (sec)
- **Music** — what Track 4 is doing
- **Tagline on screen** — which of the two act-taglines is visible
- **On-screen** — typography / UI / visual element
- **VO** — Vera narration (rendered later via `pnpm vera:ab` narrator-mode preset)
- **Animation** — motion description + reference slot to fill
- **Transition out** — how the beat ends
- **SFX** — any sound punctuation

---

### 🎬 ACT 1 — happy path (0:00–0:47) · tagline anchor: *"Receive your money, on time."*

#### 1. Hook + Chrome extension entry (0:00–0:05)

| | |
|---|---|
| **Music** | Intro stab, kick lands on 0:01 |
| **Tagline** | *"Receive your money, on time."* — word-by-word reveal, hero italic gradient on "**on time**" |
| **On-screen** | Real eBay listing page (iPhone 15 256GB, $400, seller Marcus). Vouch Chrome extension injects a "**Pay with Vouch**" button next to the eBay "Buy It Now" button. Button has a subtle glow + pulse animation. Sarah's cursor moves toward it. |
| **VO** | (silent for the first 2s, then) *"Receive your money, on time."* (Vera, narrator-mode) starts on word 1 of the typography reveal |
| **Animation** | Page loads → extension button slides in from the right edge of the buy-box → glows → cursor click → cream-surface wipe enters from below as we transition to Vera. Reference clip needed: **"Chrome extension button injection on a familiar marketplace + glow + click"** |
| **SFX** | Soft UI tick on button land + light click on cursor |
| **Transition out** | Cream surface wipes up from below to fill the frame |

**Why this beat is the most important visual decision in the demo:** the eBay listing in frame 1 instantly communicates *"this is where Vouch lives, in the marketplaces you already use."* No exposition needed. Distribution story told in 3 seconds.

---

#### 2. Solution intro + product reveal (0:05–0:09)

| | |
|---|---|
| **Music** | Sustained energy, groove begins |
| **Tagline** | *"Receive your money, on time."* lingers as the secondary line under the wordmark |
| **On-screen** | Vouch wordmark + Vera waveform indicator. Cream `/new` page partially visible behind. |
| **VO** | *"Vouch is voice-recorded escrow. Built on Stripe."* |
| **Animation** | Wordmark wipes on, Vera waveform pulses. Reference clip needed: **"clean fintech product reveal — logo + tagline land"** |
| **SFX** | Light UI tick on wordmark land |
| **Transition out** | Cream surface fills frame, transitions into the buyer flow |

---

#### 3. Vera buyer intake (0:09–0:18)

| | |
|---|---|
| **Music** | First main groove section |
| **Tagline** | (off-screen — typography slot has the captured-terms cards) |
| **On-screen** | `/new` page (Sarah's flow). **Pre-filled from the extension:** item title, price, currency, seller all already populated. Sarah only needs to confirm + answer Q4 (delivery) + Q5 (extras). Vera asks Q4: *"When and how is it being delivered?"* Sarah's voice waveform animates. Captured term cards fly into the right panel. |
| **VO** | *"Speak the deal. Vera captures the terms."* (Vera, narrator-mode, 1.5s — overlaps the visual) |
| **Animation** | Voice waveform animates as Sarah speaks. Captured terms cards fly in one by one (item / amount / delivery / extras). Reference clip needed: **"voice-driven form filling — captured fields flying into a panel"** |
| **SFX** | Soft chime per captured field |
| **Transition out** | Whip-pan / lateral slide to Marcus's view |

**Note:** the extension pre-populating cuts the visible question count from 5 to 2, which keeps this beat under 10 sec. Otherwise the Q&A flow would eat too much real estate.

---

#### 4. Vera seller agreement + multilingual (0:18–0:28) ⭐ MULTILINGUAL MOMENT

| | |
|---|---|
| **Music** | Sustained groove, slight intensity rise |
| **Tagline** | (off-screen — multilingual animation gets the typography slot) |
| **On-screen** | Marcus's view of `/deal/[ref]/seller`. Avatar location tag: **"Marcus · Warsaw, PL"**. Vera reads Sarah's terms in **Polish**. Marcus's voice waveform animates as he responds *"Zgadzam się."* The Polish phrase appears under his avatar in mono, then **letter-by-letter morphs into English: "I agree."** Underneath, smaller, in italic Fraunces. "I agree" button pulses → tap → confirm. |
| **VO** | *"Both parties confirm. Stripe holds the money."* (Vera, narrator-mode, English — for the audience) |
| **Animation** | The Polish→English letter-by-letter transformation is the hero animation of this beat. Reference clip needed: **"text language transformation — letter-by-letter morphing between languages"**. The button-pulse-then-tap is the secondary motion. |
| **SFX** | Soft hum during Polish recital, gentle morphing sound under the text transformation, confirm tone on tap |
| **Transition out** | Lock-thunk transition into escrow lock beat |

**Why multilingual lives here:** it shows the multilingual capability *in service of the actual deal* (Marcus literally needs Polish to agree), not as a "look what else we can do" capability flash. Earns its 3 seconds.

---

#### 5. Money locks in escrow (0:28–0:33) ⭐ HERO ANIMATION OF ACT 1

| | |
|---|---|
| **Music** | Drum hit / accent — verify exact timestamp by listening |
| **Tagline** | *"receive your money, on time."* lands small in mono under the lock animation |
| **On-screen** | Big cream surface with **escrow lock animation**. Pile of $400 (or stack-of-cards visual) slides into a vault / lock. Status pill: AWAITING_SELLER → AGREED → IN_ESCROW. |
| **VO** | (silence — let music + SFX carry) |
| **Animation** | **PEAK MOMENT.** Lock-thunk visual: vault snaps shut, brief 2–3px screen shake. The tagline appears AS the money locks — reinforcing the promise just made. Reference clip needed: **"satisfying mechanical lock animation — vault / safe / lockbox click"** |
| **SFX** | 🔒 **Lock-thunk SFX (150ms, low frequency)** — the most important SFX in the video |
| **Transition out** | Whoosh / cinematic time-skip |

---

#### 6. Time skip (0:33–0:37)

| | |
|---|---|
| **Music** | Sustained groove |
| **Tagline** | (off-screen) |
| **On-screen** | Calendar pages fan forward. Day counter ticks 1 → 2 → 3 → 4 → 5. Subtitle: **"5 days later."** Italic Fraunces, small. |
| **VO** | (silent) |
| **Animation** | Fast calendar-page flip + day counter. Reference clip needed: **"cinematic time-skip — calendar flipping / day counter ticking up"** |
| **SFX** | Brief tick-tick-tick paper-flip whoosh |
| **Transition out** | Whoosh into delivery view |

---

#### 7. Item arrived + voice confirm (0:37–0:42)

| | |
|---|---|
| **Music** | Energy holds, anticipation building |
| **Tagline** | (off-screen) |
| **On-screen** | Sarah's view: iPhone box (delivered, tracking label visible). Vera prompt: *"It's arrived. Does it match?"* Sarah's voice waveform animates: she says "Yes." |
| **VO** | *"Voice-confirm to release."* (Vera, 1.5s) |
| **Animation** | Box delivery visual → voice waveform pulse → checkmark begins to form. Reference clip needed: **"package delivery + voice confirmation"** |
| **SFX** | Soft chime on voice register |
| **Transition out** | The forming checkmark feeds into Beat 8's release animation |

---

#### 8. Tick + money released (0:42–0:47) ⭐ ACT 1 PAYOFF

| | |
|---|---|
| **Music** | **BUILD into the drop** at 0:47 — Track 4's drop is the editorial pivot |
| **Tagline** | *"Receive your money, on time."* lands one last time as the money slides to Marcus — the freelancer/seller's payoff moment |
| **On-screen** | Big animated ✓ tick lands center-screen. $400 amount counter releases from escrow to Marcus's avatar. Marcus gets a notification chime visual. The tagline + Marcus's avatar share the frame for ~1 second — the promise is kept. |
| **VO** | (silent — visual + SFX punctuate) |
| **Animation** | **HERO TICK** — bold scale-in, satisfying weight. Money slides out of vault toward Marcus. Reference clip needed: **"satisfying checkmark tick animation"** + **"money transfer / coin slide"** |
| **SFX** | 🔔 Release bell (gentle, ~400ms) on tick land |
| **Transition out** | **HARD CUT to black** at exactly frame 1410 (= 0:47.00 at 30fps) synced to Track 4's drop |

---

## ⬇ MUSIC DROPS at 0:47 ⬇

### 🎬 ACT 2 — dispute / safety net (0:47–0:62) · tagline anchor: *"Every deal, kept."* · Vera silent

#### 9. Dispute opens (0:47–0:52)

| | |
|---|---|
| **Music** | **DROP / BREATH** — sparse, low — Track 4's pivot moment |
| **Tagline** | *"Every deal, kept."* types in under the photo — the three-word promise lands as the music breaks |
| **On-screen** | Hard cut from black to: photograph of a **cracked iPhone** with tracking-label visible. Tagline 2 types underneath in Fraunces italic + gradient hero on "**kept**". |
| **VO** | (NONE — pure visual + caption + music drop) |
| **Animation** | Cracked iPhone photo fades up from black on the music drop, tagline types underneath. Reference clip needed: **"product damage reveal — slow zoom + caption land"** (or just use a stock photo with a subtle Ken-Burns zoom) |
| **SFX** | A single sub-bass impact on the image land |
| **Transition out** | Smooth cross-dissolve to Vera's replay UI |

**Why this beat is the moat:** the music drop + the new tagline + the cracked iPhone all land in the same instant. Three signals saying *"the system you just watched ALSO handles this."* No narration needed.

---

#### 10. Vera replays original promise (0:52–0:57) ⭐ MOAT ANIMATION OF ACT 2

| | |
|---|---|
| **Music** | Building back up |
| **Tagline** | (off-screen — UI gets the focus) |
| **On-screen** | Two stacked cards: **TOP** — Vera replay UI: *"Marcus said: no scratches, original box."* Audio waveform highlighted at the exact moment Marcus's voice said "scratches" 5 days ago. **BOTTOM** — Sarah's evidence photo + delivery-day timestamp. |
| **VO** | (NONE — UI speaks for itself) |
| **Animation** | Top card animates the audio waveform; the word "scratches" is highlighted/scrubbed as if Vera is playing it back. Bottom card has a glowing border indicating the evidence is registered. Reference clip needed: **"side-by-side evidence comparison UI with highlighted contradiction"** |
| **SFX** | Brief audio scrub / waveform pulse |
| **Transition out** | Cards merge / consolidate into the verdict frame |

**This is the second hero animation moment of the demo** (after the lock-thunk at 0:25). It's the proof that voice-recorded escrow is materially different from PayPal G&S — Vera has the receipt because the receipt is a *voice*.

---

#### 11. Verdict + refund (0:57–0:62)

| | |
|---|---|
| **Music** | Full energy return |
| **Tagline** | *"Every deal, kept."* lands small under the verdict card as confirmation — the promise pays off |
| **On-screen** | Verdict card slides in: **"Ruling: refund to Sarah. Marcus's account flagged."** Beneath: $400 amount slides back from escrow to Sarah's avatar. Status pill: REFUNDED. Tagline appears small underneath. |
| **VO** | (NONE — possibly a single Vera *"Done."* if you want, but my recommendation: silence) |
| **Animation** | Money reversal — animated coin-stream back to Sarah. Verdict card lands authoritatively. Tagline appears. Reference clip needed: **"refund / money returning to buyer animation"** + **"verdict / ruling card reveal"** |
| **SFX** | Soft chime on verdict; coin/cash sweep on money return |
| **Transition out** | Fade slightly, hold the resolution beat |

---

#### 12. Close — brand synthesis (0:62–0:65)

| | |
|---|---|
| **Music** | Tail of Track 4, fading naturally (CapCut polishes the final 1–2s fade) |
| **Tagline** | All three lines synthesise on the final frame: |
| **On-screen** | Centred composition: **Vouch wordmark** large. Under it: *"Trust the handshake. Hold the money."* in small mono — the brand line that ties the two act-taglines together. |
| **VO** | *"Trust the handshake. Hold the money."* (Vera, narrator-mode, 2 sec) — closes the loop |
| **Animation** | Wordmark + brand line land together. No sting needed; Vera's voice + the music tail carry. Reference clip needed: **"tagline reveal with wordmark — soft, confident landing"** |
| **SFX** | None (let the music tail fade) |
| **Transition out** | Hold the wordmark for ~1s after music ends, then cut to black |

---

## 📋 Tagline placement summary

| Beat | Time | Tagline visible | Purpose |
|---|---|---|---|
| 1 | 0:00–0:05 | **"Receive your money, on time."** — hero reveal | Open Act 1 with the freelancer/seller framing |
| 2 | 0:05–0:09 | **"Receive your money, on time."** — lingers as secondary | Reinforces under the wordmark land |
| 5 | 0:28–0:33 | **"receive your money, on time."** — small mono | Anchors the escrow-lock beat as Marcus's promise of payment |
| 8 | 0:42–0:47 | **"Receive your money, on time."** — full lockup | Marcus literally receives his money — the payoff lands the tagline |
| 9 | 0:47–0:52 | **"Every deal, kept."** — types in on the music drop | Opens Act 2 with the buyer-protection framing |
| 11 | 0:57–0:62 | **"Every deal, kept."** — small under verdict | Sarah literally gets her money back — the payoff lands the tagline |
| 12 | 0:62–0:65 | **"Trust the handshake. Hold the money."** — closing | Synthesises both act-taglines as the unified brand line |

Each tagline appears with its **literal payoff in the same shot** — Marcus receiving money under "Receive your money," Sarah getting her refund under "Every deal, kept." That's what makes them stick.

---

## 🔧 Chrome extension — build spec (Day 4 deliverable)

The demo's entry point. Minimum-viable real implementation, lives in `vouch/extension/` (or sibling repo `vouch-extension`).

### What it does
1. User visits an eBay listing (`*.ebay.co.uk/itm/*` or `*.ebay.com/itm/*`)
2. Content script injects a "**Pay with Vouch**" button next to the existing "Buy It Now" button
3. Click → reads item title, price, currency from the page DOM
4. Opens `vouch.app/new?source=ebay&item=<title>&price=<price>&currency=<currency>&seller=<username>` in a new tab
5. `/new` reads query params and pre-populates the deal intake (skip Q1–Q3, Sarah only needs to answer Q4 delivery + Q5 extras)

### Scope
- **Build:** manifest.json (Manifest V3), one content script (~60–80 lines), one icon set
- **Permissions:** `activeTab`, host permissions for `*.ebay.co.uk/*` and `*.ebay.com/*`
- **No background script needed** for this minimum version
- **Page DOM selectors** for eBay's current product page structure — likely brittle (eBay redesigns frequently) but acceptable for hackathon
- Build size: ~5–15 KB total

### What this earns in the submission
- README claim: *"Includes a working Chrome extension that integrates with eBay listings."*
- Live demo capability: judges can install the .crx if they want
- Demo video: we screen-record the real extension working on an actual eBay listing — no mocking needed for the entry beat

### Day 4 sequencing
```
Day 4 AM (2-3 h)
├─ Scaffold extension/ with manifest + content script + icons
├─ Implement button injection + DOM scraping for eBay listing pages
├─ Implement query-param pre-population in app/new/page.tsx (reads URL params on mount)
├─ Manual test: install extension in Chrome dev mode, visit eBay listing, click button, verify pre-population
└─ Document in extension/README.md + main README.md
```

### Alternative scope (if Day 4 morning gets crunched)
Mock the extension behaviour for the demo video specifically:
1. Take a real eBay listing screenshot
2. Edit in the Pay-with-Vouch button overlay using Figma
3. Use the still in Claude Design with a button-click animation
4. README still claims "proof-of-concept" but downgrades the verb

We default to building real. Fall back to mock only if Day 4 morning runs long.

---

## 📋 What you need to source / produce (updated for v2)

### Reference clips (12 slots, same as v1 + 1 new for the language morph)

| # | Slot | Where | Priority |
|---|---|---|---|
| 1 | **Chrome ext button injection on a marketplace + glow + click** ⭐ new | Beat 1 entry | ⭐⭐ critical (it's frame 1) |
| 2 | Word-by-word typography reveal on a product surface | Beat 1 tagline | ⭐ |
| 3 | Fintech logo + tagline reveal | Beat 2 | ⭐ |
| 4 | Voice-driven form filling — fields flying in | Beat 3 | ⭐ |
| 5 | **Text language transformation — letter-by-letter morph** ⭐ new | Beat 4 multilingual | ⭐⭐ |
| 6 | **Mechanical lock / vault click** | Beat 5 hero | ⭐⭐⭐ |
| 7 | Time-skip / calendar flip | Beat 6 | ⭐ |
| 8 | Voice confirmation moment | Beat 7 | ⭐ |
| 9a | Hero checkmark tick | Beat 8 | ⭐⭐ |
| 9b | Money transfer / coin slide | Beat 8 | ⭐ |
| 10 | Product damage reveal / Ken-Burns | Beat 9 | ⭐ |
| 11 | **Evidence-comparison UI with highlighted contradiction** | Beat 10 moat | ⭐⭐⭐ |
| 12a | Refund / money returning | Beat 11 | ⭐ |
| 12b | Verdict / ruling card reveal | Beat 11 | ⭐ |
| 13 | Tagline reveal with wordmark — confident landing | Beat 12 | ⭐ |

**If you can only find the three ⭐⭐⭐ ones (lock-thunk + evidence-comparison + chrome-ext-injection), the demo still works.** Everything else degrades gracefully into Claude-Design-from-scratch generation.

### Screen recordings to capture (when /demo is ready)
1. eBay listing → extension button → click → opens `/new` with pre-filled params *(Day 4 deliverable)*
2. `/new` buyer Q&A flow (Q4 + Q5 only thanks to pre-fill) at 30fps
3. `/deal/[ref]/seller` page — Polish version! Need to swap Vera's recital text to Polish on Day 4 PM
4. `/deal/[ref]/signoff` — lock-escrow moment + state transition
5. Receipt confirmation flow
6. `/deal/[ref]/dispute` — for the replay / verdict frames

Tool: OBS / Cursorful. Save to `D:\Projects\vouch\tmp\screen-rec\`.

### Stills / mocks to produce
1. Cracked iPhone photograph (stock — search "broken iPhone screen on table" or similar) — for Beat 9
2. Marcus's avatar with "Warsaw, PL" location tag — generate via Claude Design or use a placeholder
3. Vouch wordmark — already exists in mockups, just need a clean isolation

### Voice lines to render (via `pnpm vera:ab` once keys land)

All in narrator-mode preset (confident-product tuning: stability ~0.55, style ~0.30 — see Section below):

1. *"Receive your money, on time."* (Beat 1, 2.5s)
2. *"Vouch is voice-recorded escrow. Built on Stripe."* (Beat 2, 2.5s)
3. *"Speak the deal. Vera captures the terms."* (Beat 3, 1.5s)
4. *"Both parties confirm. Stripe holds the money."* (Beat 4, 2s)
5. *"Voice-confirm to release."* (Beat 7, 1.5s)
6. *"Trust the handshake. Hold the money."* (Beat 12, 2s)

Plus the Polish line for Beat 4 (rendered via multilingual TTS):
- *"Sarah ustawiła ofertę, którą chciałaby zrobić z tobą. Pozwól mi przeczytać warunki."* (Vera, eleven_v3 multilingual, ~6s)

Total VO: ~14 sec of English + ~6 sec of Polish. Save to `public/audio/vera/`.

### SFX to source (same as v1)

| SFX | Where | Source |
|---|---|---|
| UI tick | Beat 1 ext button + Beat 2 wordmark | Mixkit "Notification" |
| Cursor click | Beat 1 | Mixkit |
| Soft chime per field | Beat 3 | Mixkit |
| Text-morph sound | Beat 4 multilingual | Freesound "subtle morph" |
| Confirm tone | Beat 4 button tap | Mixkit |
| **Lock-thunk** ⭐ | Beat 5 | Freesound "vault close" / "deep mechanical lock" |
| Tick-tick paper flip | Beat 6 | Mixkit |
| **Release bell** ⭐ | Beat 8 | Freesound "soft bell tap" |
| Sub-bass impact | Beat 9 image land | Freesound |
| Audio scrub | Beat 10 waveform replay | Freesound |
| Verdict chime | Beat 11 | Mixkit |

Save to `public/audio/sfx/`.

---

## 🎙️ Vera narrator-mode tuning (update needed)

Current preset in `scripts/vera-narrator-ab.mjs` was tuned for kurzgesagt-style emotional storytelling. With the editorial shift to confident-product anthem, the narrator preset needs retuning before generating final VO:

```js
// scripts/vera-narrator-ab.mjs — update PRESETS["narrator"].voiceSettings to:
{
  stability: 0.55,        // was 0.40 — more consistent, less wavery
  similarityBoost: 0.85,  // unchanged
  style: 0.30,            // was 0.45 — less dramatic, more professional
  useSpeakerBoost: true,
}
```

I'll patch this when we finalize the voice ID — keeping it in this doc as the spec.

---

## 🎬 Open questions for v2 (only 2 left)

1. **Cracked iPhone visual:** real stock photograph (free from Unsplash / Pexels) or Claude Design illustration? My vote: stock photo. Authenticity sells the dispute moment harder than illustration.
2. **Marcus's "Warsaw, PL" location tag:** is the multilingual demo set in Polish, or do you want a different language? Polish is my recommendation because the linguistic distance from English is high (looks visibly foreign) and Vera's voice handles it well on eleven_v3. Alternatives: Spanish (broader reach) or German (closer to English so the morph is less dramatic).

Lock these and v2 is final until product surfaces are ready to screen-record.

---

## 🗓️ Production sequencing (revised for v2)

```
Day 2 EOD (today)            → Script v2 locked
Day 3                        → Stripe keys + ElevenLabs keys land, /demo polished, voice flow E2E
Day 4 AM (~3h)               → Build the Chrome extension (entry-point requirement)
Day 4 PM (~3h)               → Multilingual Polish session-type variant + dispute UI polish
Day 5 AM                     → Screen recordings of all /demo + extension flows
Day 5 PM                     → Source Claude Design references, I draft per-scene prompts
Day 5 evening + Day 6 AM     → Generate scenes in Claude Design, drop into Remotion public/scenes/
Day 6 PM                     → Master render + CapCut fade polish + Submagic 9:16 captions + 3 aspect-ratio exports
Day 7 AM                     → Final review + submit
```

Tight but achievable. The Chrome extension is the only addition vs original timeline — and it's a 2-3h slot on Day 4 AM, fits comfortably.
