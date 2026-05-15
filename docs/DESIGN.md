# Vouch — DESIGN.md

> **Source of truth for Vouch's visual language.** Drop into Claude Design as project context. Port to `app/globals.css` as the production design system. Use as the brief for v0 / Cursor / Claude Code.
>
> **Aesthetic family:** Stripe × A24 (marketing/hero) + Mercury × Linear (in-app/functional). Hybrid by surface, not by page. Both modes share typography, accent colours, and numerical discipline.
>
> **Inspirations:** Mercury (the cream-canvas fintech warmth), Linear (surgical density + ⌘K muscle memory), Stripe (Söhne-clean grid + purple as the only trust signal), A24 (full-bleed black hero plates + display-serif theatre), Hacker News++ (layered backgrounds + glassmorphism craft + ambient audio).
>
> **What Vouch is:** Voice-recorded escrow + AI mediator (Vera) for high-value P2P sales and freelance milestones. Stripe holds the money. ElevenLabs powers the voice. 5% per deal. The handshake, recorded.

---

## 1. Visual theme & atmosphere

Two modes, one identity.

**Marketing mode (Stripe × A24)** — Pure black canvas, oversized italic serif headlines, Stripe purple as the only CTA, A24 red as a one-per-page callout. Full-bleed hero plates. Cinematic-but-trust-preserving. Used for: hero, closing CTA, any "first impression" surface, demo video plates.

**App mode (Mercury × Linear)** — Cream paper, warm-grey ink, Mercury indigo as the only saturated voice. Linear-density tables and command-bar muscle memory. Tabular numerals on every money figure. Used for: dashboard, deal flow, voice intake UI, settings, every interior product surface.

**Mood vector (across both):** trustworthy · deliberate · fast at rest · instant under fingers · slightly cinematic at the boundaries.

**Rule:** mode is dictated by surface type, not by section within a page. Marketing pages can have one black A24 hero plate at the top and one at the bottom; everything between is Mercury × Linear cream. App pages are all-cream, no black plates.

---

## 2. Colour palette & roles

```css
:root {
  /* ─── SHARED ACROSS BOTH MODES (CTAs, accents, semantic) ─── */
  --stripe-purple:        #635bff;   /* primary CTA — never substitute */
  --stripe-purple-hover:  #5048e5;
  --stripe-purple-soft:   rgba(99,91,255,0.12);
  --indigo:               #5266eb;   /* Mercury indigo — secondary accent + in-app primary */
  --indigo-hover:         #4255d4;
  --indigo-soft:          rgba(82,102,235,0.10);
  --indigo-tint:          #e2e6fb;
  --a24-red:              #d9351c;   /* one-per-page callout only — never CTA */

  /* ─── STRIPE × A24 MODE (black) ─── */
  --black:                #000000;
  --black-alt:            #0a0a0a;
  --black-surface:        #141414;
  --white:                #ffffff;
  --white-dim:            rgba(255,255,255,0.72);
  --white-mute:           rgba(255,255,255,0.48);
  --white-trace:          rgba(255,255,255,0.18);
  --border-dark:          rgba(255,255,255,0.10);
  --border-dark-med:      rgba(255,255,255,0.18);
  --glass-edge-dark:      rgba(255,255,255,0.06);

  /* ─── MERCURY × LINEAR MODE (cream) ─── */
  --cream:                #f6f5f2;   /* page background */
  --cream-alt:            #ebe8e0;   /* surface lift / nav rail */
  --cream-card-glass:     rgba(255,253,248,0.55);
  --cream-card-glass-hi:  rgba(255,253,248,0.85);
  --surface:              #ffffff;   /* solid card / table */
  --surface-alt:          #fbfaf6;   /* hover row, subtle lift */
  --ink:                  #2a2924;
  --ink-muted:            #5a5548;
  --ink-dim:              #8a8478;
  --border-warm:          rgba(50,30,5,0.10);
  --border-warm-med:      rgba(50,30,5,0.18);
  --border-warm-strong:   rgba(50,30,5,0.28);
  --glass-edge:           rgba(255,255,255,0.55);

  /* ─── SEMANTIC (works across modes) ─── */
  --success:              #2f7d57;   /* RELEASED, completed */
  --success-soft:         rgba(47,125,87,0.12);
  --warning:              #c98a42;   /* AGREED, REVIEWING, awaiting */
  --warning-soft:         rgba(201,138,66,0.14);
  --danger:               #b54a3a;   /* dispute, error */
  --danger-soft:          rgba(181,74,58,0.12);
  --locked:               #7a6ce8;   /* IN_ESCROW status — distinct from CTA purple */
  --locked-soft:          rgba(122,108,232,0.12);
}
```

**Arbitration rules** (when colours might compete):

- **Stripe purple wins all CTAs across both modes.** Never substitute with A24 red or Mercury indigo for primary action.
- **A24 red is used at most once per viewport** — as a callout label (stat, sale tag, single label). Never CTA. Never body text.
- **Indigo is used as a secondary saturated voice in cream mode**, primarily for hyperlinks, status pills, focus rings, and the "Recommended" tier highlight. In black mode, indigo is replaced by Stripe purple to avoid confusion.
- **Tabular numerals are mandatory on every money figure**, every transaction row, every chart label. Never proportional figures on money.
- **Pure white (`#ffffff`) is forbidden as a page background in cream mode.** Always cream `#f6f5f2`. Pure white only inside cards on top of cream.

---

## 3. Typography

Three fonts, three roles. No exceptions.

| Role | Font | Weights | Notes |
|---|---|---|---|
| **Display** (hero, large h1/h2, statement) | **Fraunces** | 500, 600 | Optical-size aware. Use weight 600 for poster-sized A24 hero. Weight 500 for cream-mode h2 headlines. Letter-spacing −0.025em at 48px+, −0.04em at 96px+. Italic is reserved for the *one emphasised word* per headline (e.g. "*on time*"). |
| **Body / UI** | **Inter** | 400, 500, 600 | All UI labels, buttons, body copy, table cells. Letter-spacing −0.5% at headline sizes, 0 at body. |
| **Mono** | **JetBrains Mono** | 400, 500 | Mono only for: transaction IDs, deal references, eyebrow labels (with `letter-spacing: 0.14em–0.16em`, uppercase), live counter labels, code/API references, command-bar shortcuts, status pill abbreviations. Tabular by default. |

**Scale (modular ramp):**

```
11 / 12 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64 / 96 / 124
```

- Display serif only fires at **36px and above**. Below that, Inter for everything.
- App body is 14px. Marketing body is 16-18px.
- Display serif sets `text-wrap: balance` for headlines, `text-wrap: pretty` for body.

**Italic discipline:** italic is gradient-text territory. The one emphasised word per headline gets:
```css
font-style: italic;
background: linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, var(--stripe-purple) 100%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
```
In cream mode, swap the gradient stops to `var(--indigo) → var(--stripe-purple)`.

**Eyebrow labels** (above section headlines) are always JetBrains Mono, 12px, uppercase, letter-spacing 0.16em, colour `var(--ink-muted)` (cream mode) or `var(--white-mute)` (black mode). Prefixed with a `24px × 1px` horizontal bar before the text.

---

## 4. Component stylings

### Buttons

```
Primary (Stripe CTA, both modes):
  background: var(--stripe-purple)
  color: white
  padding: 12-14px / 24-28px
  border-radius: 6px
  font-weight: 500
  font-size: 14-15px
  no-shadow at rest, soft purple glow on hover
  cursor: pointer
  active: scale(0.98)

Secondary (cream mode marketing):
  background: var(--cream-alt)
  color: var(--ink)
  border-radius: 999px (pill)
  same padding/size as primary

Secondary (black mode marketing):
  background: transparent
  color: white
  border: 1px solid var(--border-dark-med)
  border-radius: 6px

In-app primary (cream mode app):
  background: var(--indigo)
  border-radius: 6px (sharper in app — never pill in dashboards/tables)
  no-shadow

In-app secondary (cream mode app):
  background: var(--surface)
  color: var(--ink)
  border: 1px solid var(--border-warm-med)
  border-radius: 6px
```

**Geometry rule:** pill radius (999px) is for marketing surfaces only. App / dashboard / tables always use 6px sharp radius. Enforced by surface, not by component type.

### Cards

**Marketing glass card (cream mode, "flow-card"):**
```
background: var(--cream-card-glass)
backdrop-filter: blur(22px) saturate(170%)
border: 1px solid var(--glass-edge)
border-radius: 16px
padding: 32-36px
box-shadow: 0 4px 16px rgba(40,20,5,0.08), 0 12px 40px rgba(40,20,5,0.06)
::before pseudo-element with linear-gradient top edge (rgba(255,255,255,0.7))
hover: translateY(-3px), bigger shadow, border darkens to var(--border-warm-med)
```

**App glass card (cream mode app, "summary-card"):**
```
background: var(--cream-card-glass-hi)  /* 0.85 opacity — more solid */
backdrop-filter: blur(20px) saturate(170%)
border: 1px solid var(--glass-edge)
border-radius: 10px
padding: 20-22px
box-shadow: subtle (--shadow-sm)
hover: translateY(-2px), small shadow lift
```

**Solid card (no glass — used on solid backgrounds inside the app):**
```
background: var(--surface)
border: 1px solid var(--border-warm)
border-radius: 8px
no shadow at rest
```

**Featured tier card (pricing):**
```
border: 1px solid var(--indigo)
box-shadow: 0 0 0 1px var(--indigo-soft), 0 0 48px rgba(82,102,235,0.18), 0 4px 16px rgba(40,20,5,0.08)
"Recommended" pill chip in top-right
```

### Inputs

```
App mode:
  background: var(--surface)
  border: 1px solid var(--border-warm)
  border-radius: 6px
  padding: 8/12 - 10/14
  focus: 2px var(--accent) ring + 2px offset

Marketing mode:
  background: var(--surface)
  border: 1px solid var(--border-warm)
  border-radius: 999px (pill — only on marketing forms)
  padding: 10/16
  focus: 2px var(--accent) ring
```

### Tables (Linear-density discipline)

```
font-size: 13-14px
border-collapse: collapse
thead:
  background: rgba(235,232,224,0.4)
  th: 10px padding (vertical) / 22px (horizontal)
  font: 11px JetBrains Mono uppercase, letter-spacing 0.12em
  color: var(--ink-muted)
  font-weight: 600
  border-bottom: 1px solid var(--border-warm)
tbody:
  td: 12-14px padding (vertical) / 22px (horizontal)
  height: 40px minimum
  border-bottom: 1px solid var(--border-warm)
  hover row: background rgba(251,250,246,0.6)
  selected row: var(--accent-soft) + 3px var(--accent) left inset shadow
money columns: text-align: right, font-variant-numeric: tabular-nums, font-weight: 500
```

### Status pills / badges

```
display: inline-flex
align-items: center
gap: 5px
font-family: var(--mono)
font-size: 10px
padding: 3px 9px
border-radius: 4px
font-weight: 600
letter-spacing: 0.06em
text-transform: uppercase
Prefix dot (5px × 5px) before label

Variants:
  IN_ESCROW    — bg var(--locked-soft),   color var(--locked),   pulsing dot
  AGREED       — bg var(--warning-soft),  color var(--warning)
  REVIEWING    — bg var(--warning-soft),  color var(--warning)
  RELEASED     — bg var(--success-soft),  color var(--success)
  DISPUTED     — bg var(--danger-soft),   color var(--danger)
```

### Command bar (⌘K — Linear muscle memory)

Floating panel, `var(--surface)` background, 1px `var(--border-warm-med)` border, 12px radius, max-width 640px. Mono input. Result rows in 14px Inter with 12px mono shortcut hints right-aligned. Triggered globally with ⌘K. **Required on every app screen** — not optional.

### Voice waveform (Vouch's signature motif)

Inline horizontal bars representing voice activity. Used everywhere voice is referenced.

```
.waveform-bars {
  display: inline-flex;
  align-items: center;
  gap: 3px;  /* tighten to 2px for inline-row use */
  height: 28px;  /* scale to 12-14px inline, 110px hero watermark */
}
.waveform-bars span {
  display: block;
  width: 3px;  /* 2px for inline, 5px for hero */
  background: var(--accent);  /* swap per surface mode */
  border-radius: 2px;
  animation: wave 1.4s ease-in-out infinite;
}
```

Bar heights are non-uniform (vary 18% → 100%) to look organic. Animation delays staggered by 0.08–0.10s. **Black mode:** bars use gradient `linear-gradient(180deg, var(--stripe-purple) 0%, #a855f7 100%)`. **Cream mode:** flat `var(--indigo)` or `var(--accent)`.

Three sizes:
- **Hero watermark:** 110px tall, 10 bars, bottom-right corner of hero, 42% opacity, gradient bars
- **Card / pill inline:** 22-28px tall, 5-6 bars, full opacity
- **Row inline / mini-wave:** 12-14px tall, 5 bars, 55% opacity, sits next to deal description

---

## 5. Layout principles

```
App shell:        1280px max, 240px persistent sidebar, content right
Marketing shell:  1180px max, 24px gutter, 12-column
Long-form (FAQ):  720px max reading column
Base unit:        4px
Spacing scale:    4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160
```

- App mode is dense — tables breathe through hairlines, not padding.
- Marketing mode is unhurried — section breaks at 96-160px vertical rhythm.
- Sidebar collapses to icon rail at 1024px, full drawer at 768px.

---

## 6. Depth & elevation

**Cream mode is essentially flat.** Depth comes from:
- Surface tone shifts (cream → cream-alt → surface)
- 1px hairline borders (`var(--border-warm)`)
- Glassmorphism (the `blur + saturate` trick — only on glass cards, never on solid surfaces)
- Type weight contrast

**Reserved shadows:**
- Modals / command bar: `0 12px 32px rgba(40,20,5,0.12)`
- Popovers / dropdowns: `0 4px 12px rgba(40,20,5,0.06)`
- Card hover (lift): `0 8px 32px rgba(40,20,5,0.10), 0 24px 80px rgba(40,20,5,0.10)`

**Never:** drop shadows on table rows, buttons, tiles, inputs. No neumorphism. No glow except on the Stripe-purple CTA on hover in black mode.

**Black mode** adds soft purple radial glows around CTAs and the closing-CTA section. Subtle backdrop-blur on the fixed nav (`blur(12px)` over scrolled content).

---

## 7. The HN++ craft layer (Layer 3 — applied to landing + key surfaces)

These are the patterns that elevate Vouch above default v0 / SaaS template output. They're not optional — they're the differentiator.

### 7.1 Layered background composition (hero only)

Six stacked layers, all `position: fixed; inset: 0; pointer-events: none; z-index: 0-2`:

1. **Photo-tone substrate** — radial gradients in warm tones, low opacity, suggesting ambient depth
2. **Warm veil** — secondary radial overlay pulling colour temperature
3. **Subtle grid** — 56px grid lines at 4-5% opacity, masked by `radial-gradient(ellipse 80% 60% at 50% 30%, black 0%, transparent 85%)`
4. **Blob 1** — large purple (Stripe purple), `filter: blur(90px)`, 45% opacity, animated `float 14s alternate`
5. **Blob 2** — smaller A24-red, blurred, 18% opacity, animation-delay -7s
6. **Decorative API code text** — JetBrains Mono at 11px in `rgba(255,255,255,0.045)`, scrolling Stripe API calls + voice contract phrases as ambient decoration. Mask top + bottom.

The code text in layer 6 IS the brand — turning real Stripe API calls into decorative texture.

### 7.2 Glassmorphism (proper)

The key magic line:
```css
backdrop-filter: blur(22px) saturate(170%);
```

The `saturate(170%)` is what makes the glass feel alive, not just blurred. Standard glassmorphism omits this. Vouch glass is always 22px blur + 170% saturate, on rgba surfaces (0.55-0.85 opacity).

Used on:
- Marketing flow cards
- Marketing pricing tiers
- App summary cards
- App deals table card
- App sidebar
- App topbar
- App deal-detail panel
- Floating Vera button
- Ambient audio toggle (with lower saturation, `blur(14px)`)

Never on: solid app cards inside the dashboard (those are `var(--surface)` solid), tables (rows have no glass), inputs (would distract from content).

### 7.3 Ambient audio loop (marketing only)

```js
const a = new Audio('/audio/landing-loop.mp3');
a.loop = true;
a.volume = 0.16;
a.muted = true;   // starts muted — autoplay-safe
a.play().catch(() => {});  // graceful fail
```

Fixed bottom-right toggle button. Muted by default. Clicking unmutes. Track: subtle ambient piano + faint voice-hum texture, ~30s loop, royalty-free (Pixabay / Mixkit).

### 7.4 Idle effects (marketing live strip)

Live counters that bump every ~3 seconds with small random increments. Driven by `setInterval(3200ms)`. Random gates so different counters update at different rates.

```js
escrow   += Math.floor(Math.random() * 240) + 30;  // ~50% of intervals
released += Math.floor(Math.random() * 320) + 80;  // ~35% of intervals
disputes += 1;                                      // ~8% of intervals
```

Paired with pulsing live-indicator dots (6px circles with `animation: blink 2s ease-in-out infinite`) on the labels.

### 7.5 First-run tour (app only — Day 5 stretch)

3-step spotlight tour on first app load:
1. "Speak the deal." → highlights New Deal button
2. "Money locks in escrow." → highlights summary cards
3. "Voice-confirm to release." → highlights an active deal

Glassmorphic bubble, localStorage persistence (`vouch:tour:dismissed = true` after completion).

### 7.6 Sonified moments (demo + product)

- **Lock sound** — soft `thunk` (~150ms) when escrow status pill switches to IN_ESCROW
- **Release sound** — gentle bell (~400ms) when status switches to RELEASED
- **Vera join sound** — subtle bloom (~600ms) when Vera enters a deal session

All royalty-free from Pixabay / Mixkit. Loaded but muted-by-default for accessibility; opt-in via the ambient audio toggle.

---

## 8. Do's & Don'ts

### ✅ Do
- Use Stripe purple (`#635bff`) for every primary CTA across both modes.
- Set transaction tables in `font-variant-numeric: tabular-nums`. Always.
- Use italic + gradient for the *one* emphasised word per headline ("*on time*", "*recorded*", "*handshake*").
- Use pill buttons (radius 999) on marketing surfaces. Sharp (radius 6) on app/dashboard surfaces.
- Pair Mercury indigo with cream secondary. Never two saturated buttons.
- Render every voice reference with the voice-waveform motif.
- Use ⌘K command bar on every app screen.
- Cream-on-near-coal for any dark mode in app (`#15140f` not pitch black). Pure black is for hero plates only.
- Layered backgrounds on hero. Solid cream on app. No mixing.

### ❌ Don't
- Use Linear purple (`#5e6ad2`) — Mercury indigo is the in-app accent. Token-lock indigo and remove Linear purple.
- Use pill-radius buttons inside dashboard tables.
- Add card shadows or hover lift to solid cards (only glass cards can lift).
- Drop shadows on table rows.
- Use display serif below 36px (reads decorative, not functional).
- Use pure white as a page background in cream mode.
- Introduce a second saturated accent for "balance up" or "alerts" — use warm-grey hierarchy + semantic colours only.
- Use any gradient as a CTA background (the gradient is reserved for italic text).
- Glassmorphism on table rows or inputs.

### Forbidden AI-slop fingerprints (from awesome-claude-design audit)

These are the markers of generic Claude Design output. Vouch must avoid:

- ❌ Teal accent anywhere on the page
- ❌ Blinking status dot in the top-right of the nav (it's fine inside live-stat labels, never in nav)
- ❌ Container soup (pills wrapping cards wrapping pills)
- ❌ Default serif headline (Tiempos-adjacent — we use Fraunces explicitly)
- ❌ Accent bar left of every card (only on selected table rows)
- ❌ Generic three-column feature grid in hero (we use the flow-card pattern with mono "01 · Voice" prefix and the mini-waveform footer)
- ❌ Lucide icon stack as decoration
- ❌ Default 3-tier pricing (we have 2 tiers — sellers + freelancers)
- ❌ "Trusted by [logos]" rail without real logos

---

## 9. Responsive behaviour

```
1280px+    — full app shell, marketing 1180px
1024-1280  — sidebar collapses to icon rail; marketing same
768-1024   — sidebar drawer with hamburger; pricing tiers stack
< 768      — full mobile, single column, hero hides waveform watermark,
              feature rows collapse 200/1fr → 1fr, summary cards 1-column,
              hero h1 scales 124 → 56px
< 640      — live-strip 1-column, table simplifies (hide description column),
              floating Vera button shrinks
```

Touch targets: 44px minimum on mobile. Buttons retain their cream-paper or black-poster aesthetic at all sizes.

---

## 10. Agent prompt guide (for any AI-assisted generation)

**When prompting Claude Design / v0 / Cursor for Vouch surfaces, bias toward:**

- Cream warm canvas + Mercury indigo as the only saturated colour in app surfaces.
- Stripe purple as the only CTA colour, in both modes, never substituted.
- Linear-tight 4px base scale + 14px Inter body in app.
- Fraunces tabular numerals on every money figure.
- Hairline 1px borders for depth (no shadows on solid surfaces).
- Glass cards only, using `blur(22px) saturate(170%)`.
- Command bar (⌘K) on every app screen.
- Dual-mode layout: pill buttons in marketing, sharp 6px buttons in app.
- Voice-waveform motif everywhere a voice is referenced.
- A24 red used at most once per viewport, never as CTA.
- Eyebrow labels in JetBrains Mono uppercase with 24×1px bar prefix.

**Reject:**
- Linear purple, pill radius inside tables, proportional figures on money, drop shadows on cards/tiles, second saturated accent, Fraunces in app UI controls, pure white surfaces, hover lift on solid cards, gradients as button backgrounds, multiple "Trusted by" logo rails, default Lucide icon decoration, generic 3-column hero feature grid, hero illustrations.

---

## 11. Per-week / per-build context

**Built for ElevenHacks 2026 — Hack #9 (Stripe), 14-21 May.**

Two judges:
- **Rajan Patel** (Solutions Architect EMEA, Stripe) — values real Stripe customer feel, multi-primitive depth, commercial fit
- **Joe Reeve** (Growth, ElevenLabs) — values multi-API depth, cinematic demo polish, emotional resonance

Vouch is engineered to clear both bars:
- Multi-Stripe-primitive integration (Connect + Identity + Subscriptions + Customer Portal + Tax) → Rajan
- 5 ElevenLabs APIs (ConvAI, Voice Design, TTS, Scribe, Multilingual TTS) → Joe
- Hybrid aesthetic (A24 hero theatre + Mercury × Linear functional warmth) → both

Stripe brand assets are not used directly — instead, Vouch's hero echoes the Stripe Sessions aesthetic (full-bleed black + Söhne/Fraunces typography + purple CTA) without copying logos.

---

## 12. File-system port (for the Vouch repo)

When porting to the production Next.js codebase:

```
/app/globals.css           ← This file's CSS variables, in :root + [data-theme="dark"]
/tailwind.config.ts        ← Minimal: just font families (Fraunces, Inter, JetBrains Mono)
/app/components/
   /ui/                    ← shadcn primitives, restyled per this DESIGN.md
   /Waveform.tsx           ← the signature motif (3 sizes)
   /VeraIndicator.tsx      ← floating pill, used app-wide
   /AmbientAudio.tsx       ← landing-only, muted by default
   /CommandBar.tsx         ← ⌘K
/app/(marketing)/
   /page.tsx               ← landing (the elevated mockup, ported)
/app/(app)/
   /deals/page.tsx         ← dashboard (the in-app mockup, ported)
   /deals/[id]/page.tsx    ← deal-detail
   /new/page.tsx           ← voice intake flow
/docs/reference-html-mockups/
   /landing.html           ← 6-hybrid-marketing.html (the spec)
   /app.html               ← 6-hybrid-app.html (the spec)
   /DESIGN.md              ← this file
```

The mockups in `docs/reference-html-mockups/` are the **source of truth**. The Next.js code is the implementation. If they ever drift, the mockups win and the code is brought back into alignment.

---

*Last updated: 2026-05-15 — locked for ElevenHacks Stripe build.*
