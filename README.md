# Vouch

> **Voice-recorded escrow for freelancers and high-value peer-to-peer sales.**
>
> Vera, the AI mediator, handles the agreement. Stripe holds the money. Voice-recorded contracts mean disputes resolve in minutes, not weeks. 5% per deal.

[![Built with Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![ElevenLabs](https://img.shields.io/badge/Voice-ElevenLabs-635bff)](https://elevenlabs.io)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635bff?logo=stripe&logoColor=white)](https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Submitted to [ElevenHacks 2026 Hack #9: Stripe](https://hacks.elevenlabs.io/hackathons/8) (14–21 May 2026).

---

## What Vouch is

Selling something valuable to a stranger on Facebook Marketplace? Hiring a freelancer who might ghost on the invoice? Vouch holds the money in escrow with Stripe, and Vera — our AI mediator — handles the voice agreement on both sides. Every commitment is recorded. Every release is voice-confirmed. Disputes resolve fast because the contract is the actual recording, not a screenshot of a Messenger chat.

**Two ICPs:**

- **High-value P2P sellers** — phones, watches, used MacBooks, designer goods. Anyone who's been burned by "Venmo and pray."
- **Freelancers** — designers, developers, copywriters who've delivered work and been ghosted on the invoice. Vouch holds the client's payment before the work ships.

**Five ElevenLabs APIs structurally required:** ConvAI (Vera live), Voice Design (her persona), TTS (contract readback), Scribe (transcript-as-contract), Multilingual TTS (cross-border).

**Five Stripe primitives:** Connect (custodial escrow), Identity (KYC both sides), Subscriptions (premium tier), Customer Portal (self-serve), Tax (multi-jurisdiction).

---

## Tech stack

| Layer | Stack |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 (`@theme inline`) + shadcn/ui |
| Motion | Motion 12 (formerly Framer Motion) |
| Icons | Lucide |
| Voice | ElevenLabs JS SDK (ConvAI + Voice Design + TTS + Scribe + Multilingual TTS) |
| Payments | Stripe SDK (Connect + Identity + Subscriptions + Customer Portal + Tax) |
| Validation | Zod |
| Deploy | Vercel |
| Package manager | pnpm 10 |

---

## Getting started

```bash
# 1. Clone
git clone https://github.com/cheung-scott/vouch.git
cd vouch

# 2. Install
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Stripe and ElevenLabs keys

# 4. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required environment variables

See `.env.example` for the full list. Minimum for local dev:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ELEVENLABS_API_KEY=...
ELEVENLABS_VERA_AGENT_ID=...
```

---

## Project structure

```
app/
  (marketing)/         # Public-facing — landing, pricing, FAQ
    page.tsx
  (app)/               # Authenticated product surface
    deals/
      page.tsx         # Dashboard — active deals list
      [id]/page.tsx    # Deal-detail view
    new/page.tsx       # Voice intake flow
  api/
    vera/              # Vera tool webhooks (extract_terms, lock_escrow, etc)
    stripe/            # Stripe webhook handlers
  layout.tsx
  globals.css          # Design system tokens (see docs/DESIGN.md)
components/
  Waveform.tsx         # Vouch's signature voice motif
  VeraIndicator.tsx    # The Vera floating pill / inline status
  AmbientAudio.tsx     # Marketing-only ambient audio toggle
  CommandBar.tsx       # ⌘K shortcut
  ui/                  # shadcn primitives (restyled per DESIGN.md)
lib/
  utils.ts             # cn(), formatMoney(), dealReference()
docs/
  DESIGN.md            # Persistent design system spec — source of truth
  DEMO-SCRIPT.md       # 75-second demo video script + voice lines
  VERA-SYSTEM-PROMPT.md  # ConvAI agent configuration
  reference-html-mockups/
    landing.html       # The landing-page spec (Stripe × A24 hero)
    app.html           # The in-app dashboard spec (Mercury × Linear)
```

---

## Design system

The visual language is **Stripe × A24** (marketing/hero — full-bleed black, oversized italic serif, Stripe purple CTA) flowing into **Mercury × Linear** (in-app — cream paper, indigo accent, Linear-density tables).

Both modes share one typographic system: Fraunces (display), Inter (body), JetBrains Mono (eyebrow labels + transaction IDs). Tabular numerals on every money figure.

Full spec: [`docs/DESIGN.md`](docs/DESIGN.md). HTML mockups: [`docs/reference-html-mockups/`](docs/reference-html-mockups/).

The CSS variables in `app/globals.css` are ported pixel-faithful from the mockups. If the mockup and the code ever drift, **the mockup wins** and the code is brought back into alignment.

---

## Deploy

```bash
# Push to main → Vercel auto-deploys
git push origin main
```

Custom domain → Vercel project settings.

---

## Brand note

"Vouch" is the hackathon project name. It's not affiliated with [vouch.com](https://vouch.com) (startup insurance) — different product, different market. Long-term rebrand TBD.

---

## License

MIT — see [`LICENSE`](LICENSE).

---

*Built for [ElevenHacks 2026 Hack #9: Stripe](https://hacks.elevenlabs.io/hackathons/8) by [Scott Cheung](https://github.com/cheung-scott).*
