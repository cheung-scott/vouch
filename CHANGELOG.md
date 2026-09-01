# Changelog

All notable changes to Vouch are tracked here. Format follows [Keep a Changelog](https://keepachangelog.com).

## [Unreleased]

### Added
- Postgres storage layer behind the unchanged `DealStore` interface (Drizzle +
  node-postgres). Transactions on every write, `SELECT … FOR UPDATE` row locks
  on the read-modify-write paths, single-query party loading. `DEAL_STORE=kv|postgres`
  keeps both backends live during the migration.
- Authentication on every money and state route. Per-party opaque capability
  tokens carried in the deal link, plus a `X-Vera-Tool-Secret` service secret for
  the ConvAI channel. Both fail closed.
- Role gates on the routes only one party may drive.
- Vitest suite: 69 tests. PGlite runs a real Postgres in-process, so the store
  and auth contracts are exercised against genuine SQL, constraints and transactions.
- **GitHub Actions CI (`.github/workflows/ci.yml`) - lint, typecheck, test, build.**
  This is the first time the repo has actually had CI; see Fixed below.

### Fixed
- Escrow intents no longer take the amount, currency or destination account from
  the request body. A deal whose seller had not onboarded would previously route
  funds to any `acct_` the caller named.
- Refund and cancel paths now cancel the Issuing card before reversing the payment,
  and refuse to proceed if the card will not cancel. Previously a refund could land
  alongside a live card, paying out twice.
- Connect account binding requires the seller's token rather than a status gate that
  never bound the caller to a party.
- Unauthorized deal reads return the same 404 as a nonexistent deal, so the endpoint
  cannot be used to confirm a deal exists.
- Constant-time comparison for the owner token.
- ESLint no longer scans the gitignored `tmp/` scratch directory. Flat config does not
  read `.gitignore`, so `pnpm lint` had been reporting ~3,300 problems and could never
  pass.

### Corrected
- The 0.0.1 entry below claimed a GitHub Actions CI workflow was added on Day 0.
  **No workflow ever existed in the repo.** That line has been removed rather than
  left to imply the project had automated checks it did not have.

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

### Repo
- Created at https://github.com/cheungscott/vouch
- MIT licensed

### Tech stack locked
- Next.js 16.2.6 + React 19.2.4 + Tailwind 4 + TypeScript 5
- Same stack as Hearsay (Scott's prior ElevenHacks placer) for known-good build
