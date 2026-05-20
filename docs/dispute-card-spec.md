# Beat 10 — Dispute Replay Card Spec

**Used by:** `docs/demo-video-script-v4.md` § Beat 10 (0:52-0:57) — the moat animation of Act 2. Also used by `app/how-it-works/page.tsx` § "If something goes wrong" → `dispute-replay.png`.

**Why mocked:** The dispute UI doesn't ship in v1 product. These cards are the visual representation of what Vera's playback flow *will* look like — close enough to product-grade for the demo, with the same design tokens.

**Deliverables:**
- `dispute-replay.png` — both cards stacked (1200×750, for /how-it-works)
- `b10-replay-card.png` — top card alone, transparent BG (for demo video)
- `b10-evidence-card.png` — bottom card alone, transparent BG (for demo video)
- `b10-cards-stacked.png` — both composed together (for demo video end-frame)

---

## Design tokens (must match the rest of the product)

| Token | Value | Notes |
|---|---|---|
| Page BG | `#f6f5f2` (cream) | Behind the cards |
| Card BG | `#ffffff` | Surface |
| Card border | `1px solid rgba(50, 30, 5, 0.10)` | Default |
| Card border (highlighted) | `1px solid #5266eb` | Indigo accent for active card |
| Card radius | `12px` (rounded-xl in Tailwind) | |
| Card padding | `24px` (px-6 py-6) | |
| Indigo accent | `#5266eb` | Primary brand |
| Indigo tint BG | `rgba(82, 102, 235, 0.06)` | Subtle highlight wash |
| Warning soft | `#b54a3a` | The "scratches" highlight |
| Warning soft BG | `rgba(181, 74, 58, 0.08)` | Pill behind highlighted word |
| Text primary | `#2a2924` (ink) | Headlines |
| Text secondary | `#5a5548` (ink-dim) | Body |
| Text muted | `#8a8478` (ink-muted) | Eyebrow labels |
| Display font | Fraunces (serif), weight 600 | Headlines |
| Body font | Inter | Body text |
| Mono font | JetBrains Mono / Berkeley Mono | Eyebrows, timestamps |

---

## Card 1 (TOP) — Vera replay UI

**Frame:** 720×320, white BG, indigo border (it's the "active" card).

**Eyebrow** (top-left):
```
VERA · REPLAY · DAY 5
```
Inter Mono, 10px, uppercase, letter-spacing 0.14em, colour `#5266eb`.

**Headline** (under eyebrow, large):
```
Marcus said: "no scratches, original box."
```
Fraunces, 24px, semibold, colour `#2a2924`. The phrase **"no scratches"** is wrapped in a `<span>` with:
- Background pill: `rgba(181, 74, 58, 0.08)` rounded 4px, 2px padding
- Text colour stays `#2a2924`
- No underline — the pill is the highlight

**Waveform** (under headline, full width):
- 5 vertical bars, 8px wide, 4px gap
- Bars 1, 2, 3, 5: indigo `#5266eb`, height 40px
- **Bar 4 (the "scratches" bar): height 60px, deeper indigo `#4253d4`**, with a thin concentric pulse ring around it (`stroke: #5266eb`, `stroke-opacity: 0.3`, 1px, ring radius 18px from bar center)
- All bars rounded ends (2px radius)
- Underneath the waveform, a thin grey baseline (`#e8e6e0`, 1px)

**Timestamp** (bottom-left, under waveform):
```
0:18 · captured during SELLER_ONBOARDING
```
Inter Mono, 10px, colour `#8a8478`.

**Play button** (bottom-right, optional):
- 32×32 circle, `#5266eb` fill, white play triangle SVG inside
- Just for visual context — Vera plays automatically in the video

---

## Card 2 (BOTTOM) — Sarah's evidence

**Frame:** 720×320, white BG, default cream border (border-warm, the "supporting" card).

**Eyebrow** (top-left):
```
EVIDENCE · DAY 5
```
Same mono style as above, colour `#8a8478` (muted, not indigo — it's the supporting card).

**Headline:**
```
What Sarah received
```
Fraunces, 20px, semibold, colour `#2a2924`.

**Photo placeholder** (under headline, left side, 280×180):
- Rounded 8px
- Border `1px solid rgba(50, 30, 5, 0.10)`
- For the mock: drop in the same cracked-iPhone Unsplash photo used in Beat 9
- A subtle drop-shadow `0 4px 12px rgba(0,0,0,0.06)`

**Caption** (right of photo, vertically aligned middle):
```
Cracked screen.
Box wasn't sealed.
```
Inter, 14px regular, colour `#5a5548`, line-height 1.5.

**Timestamp** (bottom):
```
delivered 5 days after lock · photo timestamp 14:22 GMT
```
Inter Mono, 10px, colour `#8a8478`.

---

## Layout — both cards stacked (1200×750 canvas)

```
┌─────────────────────────────────────────────────┐
│  cream BG (#f6f5f2), 1200×750                   │
│                                                 │
│           ┌──────────────────────────┐          │
│           │ ┃ Vera replay (indigo)   │ 720×320  │
│           └──────────────────────────┘          │
│                       │                         │
│                  60px gap                       │
│                       │                         │
│           ┌──────────────────────────┐          │
│           │   Sarah evidence (cream) │ 720×320  │
│           └──────────────────────────┘          │
│                                                 │
└─────────────────────────────────────────────────┘
```

- Both cards horizontally centered (240px margins L/R)
- Vertical gap between them: 60px
- Top margin: 30px, bottom margin: 30px

---

## Claude Design / animation notes (for video use)

When you bring these into Claude Design for the Beat 10 animation:

1. **Enter:** Both cards slide in — TOP from above, BOTTOM from below — staggered 120ms, 600ms total, easeOutQuart `cubic-bezier(0.22, 1, 0.36, 1)`. Use the stacked PNG as end frame.
2. **Waveform highlight:** Bar 4 scales `1 → 1.6 → 1` over 300ms, synced to the diegetic Marcus "no scratches" clip word boundary.
3. **Concentric pulse:** Single ring expands from bar 4 (`scale: 0 → 1`, `opacity: 0.6 → 0`, 400ms).
4. **Pill draw-in:** The warning-soft pill behind "no scratches" animates via `clipPath: inset(0 100% 0 0) → inset(0)` (200ms easeOutQuart left-to-right), landing exactly when Marcus says the word "scratches".
5. **Evidence card border breath:** After both cards land, the BOTTOM card's border animates from `border-warm` to indigo over 400ms, then back, on a 1.4s loop. Subtle — don't compete with the waveform.

---

## Font fallbacks (if Fraunces / Inter Mono aren't loaded in your design tool)

| Spec font | Closest substitute |
|---|---|
| Fraunces | Playfair Display, Source Serif Pro |
| Inter | SF Pro Text, Helvetica Neue |
| Inter Mono / JetBrains Mono | IBM Plex Mono, Fira Mono |

Match weight + letter-spacing rather than exact font — designers can swap later.
