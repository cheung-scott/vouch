<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (Next.js 16) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — brief for AI agents working on Vouch

You are working on **Vouch**, a voice-recorded escrow product for ElevenHacks 2026 Hack #9 (Stripe). Submission deadline: **Thu 21 May 17:00 UK**.

## What Vouch is

Read `README.md` first. Short version: voice-recorded contracts + Stripe escrow + AI mediator (Vera) for high-value P2P sales and freelance milestones. Sellers and buyers voice-agree, Stripe holds the money, voice-confirm releases it. Disputes resolve based on the recording.

## Tech stack — verify against `package.json`

- Next.js 16 + React 19 + App Router + Turbopack
- TypeScript 5 strict
- Tailwind CSS 4 (`@theme inline` pattern — NOT old `tailwind.config.js` for tokens)
- shadcn/ui (added incrementally — only the components actually needed)
- Motion 12 (formerly Framer Motion)
- ElevenLabs JS SDK 2.x
- Stripe SDK 22.x
- Zod for validation
- pnpm 10

## Design system

`docs/DESIGN.md` is the **source of truth**. Don't invent design decisions — read it first.

Quick reference:
- Colours, fonts, spacing, components: all defined as CSS variables in `app/globals.css`, exposed as Tailwind utilities via `@theme inline`
- HTML mockups in `docs/reference-html-mockups/landing.html` and `app.html` show the exact final visual target — port pixel-faithful into React components
- If a generated UI ever drifts from the mockups, **the mockups win**

Forbidden cliches (catches generic AI-generated UI):
- Teal accent anywhere on the page
- Blinking status dot in nav (only inside live-stat labels)
- Drop shadows on solid cards or buttons
- Linear purple (`#5e6ad2`) — we use Mercury indigo `#5266eb`
- Pill-radius buttons inside app tables (only in marketing)
- Default Lucide icon stack as feature decoration
- Generic 3-column features grid (we use the `01 · Voice` flow-card pattern)
- Hero illustrations — we use layered backgrounds + waveform motif

## File conventions

- Path alias: `@/*` resolves to repo root
- App router: `app/(marketing)/` for public, `app/(app)/` for authenticated
- Components: PascalCase filename (`Waveform.tsx`, not `waveform.tsx`)
- Lib helpers: lowercase (`lib/utils.ts`, `lib/stripe.ts`)
- API routes: kebab-case folders (`app/api/vera/extract-terms/route.ts`)
- Use named exports (`export function Foo()`), not default exports, for components

## Naming + voice

- Vouch's AI mediator is **Vera** (lightly British female, late 20s/early 30s, warm-professional). Her ConvAI prompt lives in `docs/VERA-SYSTEM-PROMPT.md`. Don't drift from her persona.
- The user-facing tagline: *"Trust the handshake. Hold the money."*
- The hero one-liner: *"You should receive your money on time."* (italic gradient on "*on time*")
- Brand voice: warm, professional, lightly British. Avoid Americanisms in copy. Never use "Sure thing", "Awesome", "No worries".

## Coding rules

- Server components by default; `"use client"` only when needed
- Stripe operations on server-side only — never expose secret keys to client
- Money in **minor units** (pence/cents) throughout — Stripe convention
- All deals reference: `VCH_xxxxxx` (lib/utils.ts → `dealReference`)
- All user-facing money: `formatMoney(amountInPence)` from `lib/utils.ts`
- No `any` — use `unknown` and narrow with Zod schemas

## What's already locked

- ✅ Idea: voice-recorded escrow + Stripe + ElevenLabs
- ✅ Aesthetic: Stripe × A24 (marketing) + Mercury × Linear (in-app)
- ✅ Vera persona: lightly British, female, warm-professional
- ✅ Demo script (`docs/DEMO-SCRIPT.md`): 75-second feature-loaded video
- ✅ Tech stack: Next 16 + React 19 + Tailwind 4 + Motion + shadcn

## What's pending user decision

- ⏳ Domain name (probably `vouch.app` or fallback)
- ⏳ Mockup design changes (user has a feedback list — see `vault/CHANGES-PENDING.md`)
- ⏳ v0 bake-off (user will try v0 against the hand-built mockup)
- ⏳ Stripe Connect Express + Identity onboarding flows — built Day 1 morning
- ⏳ ConvAI agent creation (paste `docs/VERA-SYSTEM-PROMPT.md`) — Day 0 evening

## Build cadence

- **Day 0 (today, 15 May):** scaffold, design tokens, repo, docs ✓ done
- **Day 1 (Fri 16):** Stripe Connect Express + Identity + PaymentIntent
- **Day 2 (Sat 17):** Sequential ConvAI flow (buyer + seller + joint sign-off)
- **Day 3 (Sun 18):** Voice → escrow → release wired E2E
- **Day 4 (Mon 19):** Multilingual + dispute UI + reputation mocks
- **Day 5 (Tue 20):** Polish + Chrome extension stretch + start demo video
- **Day 6 (Wed 21 AM):** Finish demo video (Claude Design + ElevenLabs + CapCut)
- **Day 7 (Thu 22 by 17:00 UK):** Submit

## Hard rules

- **Don't fake voice integration** — Vera must be a real ConvAI agent calling real ElevenLabs APIs, not a hardcoded script
- **Don't fake Stripe integration** — must use real Stripe API in test mode, not stub money flow
- **Don't introduce new dependencies** without checking with the dev (Scott) — bundle bloat is a hackathon antipattern
- **Don't change the design tokens** in `globals.css` without updating `docs/DESIGN.md` to match
- **Don't change Vera's persona** in any place without updating `docs/VERA-SYSTEM-PROMPT.md`
- **Pre-commit:** run `pnpm lint` + `pnpm build` locally. If either fails, fix before committing.

## Useful references

- [HN++](https://github.com/padmanabhan-r/Hacker-News-Redesign) — won v0 week; their Tailwind 4 + craft layer patterns are the bar
- [lostintheweights](https://github.com/Func-Main/lostintheweights) — v0 1st place; their OKLCH crossfade + story-state context is the inspiration ceiling
- [Hearsay](https://github.com/cheung-scott/hearsay) — Scott's prior ElevenHacks 3rd-place project (Kiro Week). Same Next 16 + React 19 stack, same ElevenLabs SDK.
- [awesome-claude-design](https://github.com/rohitg00/awesome-claude-design) — the DESIGN.md template library + Mercury × Linear remix recipe Vouch is built on
