# Changelog

All notable changes to Vouch are tracked here. Format follows [Keep a Changelog](https://keepachangelog.com).

## [0.0.1] — 2026-05-15 (Day 0 scaffold)

### Added
- Initial Next.js 16 + React 19 + Tailwind 4 + TypeScript 5 project scaffold
- Stripe SDK 22 + ElevenLabs SDK 2 + Motion 12 + Lucide + shadcn deps installed
- Design system tokens ported from `docs/DESIGN.md` into `app/globals.css`
  (Stripe × A24 black mode + Mercury × Linear cream mode, semantic colours,
  3-font typography, glassmorphism utilities, waveform animation)
- Core component stubs:
  - `components/Waveform.tsx` — voice-waveform signature motif (3 sizes)
  - `components/VeraIndicator.tsx` — floating Vera button + inline status pill
  - `components/AmbientAudio.tsx` — HN++ pattern, muted-by-default audio loop
  - `components/CommandBar.tsx` — ⌘K trigger + modal stub
- `lib/utils.ts` — `cn()`, `formatMoney()`, `dealReference()`
- `app/layout.tsx` wired with Fraunces + Inter + JetBrains Mono via `next/font/google`
- `app/page.tsx` placeholder with hero waveform + tagline
- Project docs: `README.md`, `AGENTS.md`, `LICENSE` (MIT), `.env.example`
- Vault docs copied: `docs/DESIGN.md`, `docs/DEMO-SCRIPT.md`, `docs/VERA-SYSTEM-PROMPT.md`
- HTML mockups copied: `docs/reference-html-mockups/landing.html`, `app.html`
- GitHub Actions CI workflow (lint + build on PR)

### Repo
- Created at https://github.com/cheung-scott/vouch
- MIT licensed

### Tech stack locked
- Next.js 16.2.6 + React 19.2.4 + Tailwind 4 + TypeScript 5
- Same stack as Hearsay (Scott's prior ElevenHacks placer) for known-good build
