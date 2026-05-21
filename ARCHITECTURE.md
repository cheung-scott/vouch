# Architecture

Vouch is a Next.js 16 App Router app, server-rendered, with an in-memory deal store (Vercel KV swap-in ready). Money flow is enforced by a state machine that's guarded server-side at every transition.

## Folder structure

```
app/
  page.tsx                       Marketing landing (cream + dark hybrid)
  layout.tsx, globals.css        Design tokens — see docs/DESIGN.md
  onboard/                       Stripe Connect Express onboarding (deal-aware)
  new/                           Buyer voice intake (5 questions → typed terms)
  demo/                          Interactive walkthrough (no signup, no real Stripe)
  install/                       Chrome extension download + install instructions
  how-it-works/                  Long-form explainer
  deals/                         Dashboard — list view (OWNER_TOKEN gated in prod)
  deal/[ref]/                    Detail + timeline + status-aware action panel
    seller/                      Seller invitation flow
    signoff/                     Joint sign-off → lock → confirm receipt
    dispute/                     Dispute intake + replay + evidence
  dev/mock/                      Internal mock pages (robots-noindex'd) — design system review
  api/
    deals/                       Deal CRUD (GET gated by OWNER_TOKEN in prod)
    connect/                     Stripe Connect Express + onboarding links (deal-scoped binding)
    escrow/                      PaymentIntent create / capture / cancel
                                 (all guarded: deal_id + PI ownership + status check)
    issuing/                     Stripe Issuing — mint frozen card + activate / cancel
    stripe/webhook/              Signature-verified Stripe webhook (mutates deal state)
    stripe/issuing-auth/         Sub-2s realtime authorization handler
    vera/                        12 ConvAI tool endpoints — see docs/vera-tools.json
    seller-stats/                Reputation accumulator (per Stripe acct ID)
    notify/                      Seller-invitation notifier (extensible)

components/
  Waveform.tsx, VeraVoiceSession.tsx, SellerRepBadge.tsx, VeraAnalysisCard.tsx
  ui/                            Shared design primitives (Card, StatusPill, Eyebrow, MoneyAmount)
  v0/                            Landing-page composites

lib/
  stripe.ts                      Connect + Identity + escrow helpers, sanitizeStripeError
  elevenlabs.ts                  ConvAI + TTS + Scribe + Voice Design wrappers
  deals.ts                       Deal store (in-memory now, Vercel KV swap-in ready)
  vera-contract.ts               Pure-string composers for Vera recitations
  vera-extract.ts                Regex utterance parser (LLM swap-in pending — see ROADMAP)
  utils.ts                       cn(), formatMoney(), dealReference(), statusDisplay(), displayPartyName()

types/
  deal.ts                        Zod schemas: Currency, Deal, Party, Terms, Dispute
  vera.ts                        Zod schemas for all 12 Vera tool I/O shapes

docs/
  DESIGN.md                      Design system spec — source of truth
  VERA-SYSTEM-PROMPT.md          ConvAI agent configuration
  vera-tools.json                12 ConvAI tool descriptors (paste into elevenlabs.io)
  reference-html-mockups/        Original handcrafted mockups
  demo-stills/                   Demo-video frame stills (36 PNG/JPG)
  demo-video-script-v4.md        Locked video script
  dispute-card-spec.md           Beat 10 dispute card design spec

extension/                       Chrome extension (manifest v3, injects Pay with Vouch on eBay)
public/vouch-extension.zip       Packaged extension for unpacked install
```

## State machine

```
DRAFT → AWAITING_SELLER → AGREED → MONEY_HELD → RELEASED
                                              ↘
                                                REFUNDED / DISPUTED → resolution
```

Every transition is guarded by `dealStore.update()` calls that check:
1. Current deal status matches the expected prior state
2. Deal ID matches the action's claimed deal
3. Stripe PaymentIntent ownership (where money moves)

Asynchronous mutations come via the Stripe webhook handler at `app/api/stripe/webhook/route.ts`, which signature-verifies against the raw body and routes events to the deal store.

## Persistence

In-memory via `InMemoryDealStore` (default for local dev). Vercel KV via `KvDealStore` (auto-detected when `KV_REST_API_URL` or `UPSTASH_REDIS_REST_URL` env vars are set — same `DealStore` interface, hot-swap on boot in production).

## Voice biometric data

Voice recordings are GDPR Article 9 (biometric data). Current implementation stores ConvAI session IDs server-side only; recordings stay with ElevenLabs. Production roadmap (see [ROADMAP.md](ROADMAP.md)): signed-URL access only, per-request short-lived tokens.
