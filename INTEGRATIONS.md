# Integrations

Detail on every ElevenLabs API and Stripe primitive used by Vouch, and where each lives in the codebase.

## ElevenLabs (6 APIs)

| API | Role |
|---|---|
| **ConvAI** | Vera lives here. Sequential sessions for buyer onboarding, seller onboarding, joint sign-off, voice receipt, and dispute. 12 server-side tools, 80 languages enabled. See [`docs/VERA-SYSTEM-PROMPT.md`](docs/VERA-SYSTEM-PROMPT.md). |
| **Voice Library** | Vera's locked voice identity (Samara X — Smooth Classy British). Single brand voice across product + demo video, used by both ConvAI streaming and pre-rendered TTS. |
| **v3 Conversational** | Default TTS model. Unlocks expressive audio tags (`[warmly]`, `[confidently]`, `[empathetically]`) at specific prompt moments — emotional adherence at money-movement + dispute beats. |
| **Scribe v2 Realtime** | ConvAI's default ASR. The user's voice becomes the binding terms record in real time. Captions surface live in `<VeraVoiceSession>`. |
| **Multilingual TTS** (`eleven_v3`) | Cross-border deals — UK buyer, Polish seller. Vera reads buyer's terms in the seller's native language. The in-flight letter-by-letter language morph is the demo video's hero animation. |
| **Sound Generation** | Demo-video SFX: lock-thunk on money lock (Beat 5), release-bell on funds release (Beat 8), dispute-chime on dispute open (Beat 11). All generated from prompts via `/v1/sound-generation`. No Pixabay / stock dependency. |

## Stripe (7 primitives)

| Primitive | Role |
|---|---|
| **Connect Express** | Custodial holding flow — Vouch is the platform, sellers are connected accounts. Buyer pays platform → platform holds → platform transfers to seller on release. Express's hosted onboarding handles KYC. |
| **PaymentIntents (manual capture)** | The hold mechanic itself — authorise the buyer's card, hold the amount, capture (release) or cancel (refund) on resolution. Destination charges route to the seller's Connect account at capture time. |
| **Application Fees** | The 2.9% platform fee, automatically retained at capture. Zero markup on Stripe's processing rate — Vera's mediation cost gets recovered via post-MVP volume tiers, not by gouging deals. |
| **Issuing** | When money locks, Vouch mints a frozen virtual card sized to the held amount. Voice-confirmed receipt activates it. Aligns with Stripe's 2026 agentic-commerce thesis — except Vouch *inverts* the usual pattern: instead of the agent paying with a card, Vera mints one FOR the seller. |
| **Issuing realtime authorization** | Vera approves card spend per deal-agreed merchant category, sub-2s decision. Stripe sends `issuing_authorization.request`; a dedicated hot-path endpoint compares against the deal's `allowedMerchantCategory` / `spendCap` and responds within the 2-second window. Vera doesn't just hold the money — she gatekeeps how it gets spent. |
| **Webhooks** | Signature-verified event handling for the entire lifecycle (`payment_intent.amount_capturable_updated` → MONEY_HELD, `payment_intent.succeeded` → RELEASED, `payment_intent.canceled` → CANCELLED, `account.updated`, `charge.dispute.created`). Webhook handler is the async source of truth for state mutations. |
| **Agent Toolkit** | Stripe's official 2026 agentic-commerce SDK (`@stripe/agent-toolkit`), wired through a restricted API key so Vera's blast radius is server-side enforced by Stripe itself — not just by our code. Exposed via `getVeraStripeToolkit()` for the post-ConvAI direct-API agent layer. |

## Where they live in the codebase

- `lib/stripe.ts` — Connect, Identity, escrow helpers, `sanitizeStripeError`
- `lib/elevenlabs.ts` — ConvAI, TTS, Scribe, Voice Design wrappers
- `app/api/stripe/webhook/` — signature-verified handler, mutates deal state
- `app/api/stripe/issuing-auth/` — sub-2s realtime authorization decisions
- `app/api/issuing/` — mint frozen card + activate / cancel
- `app/api/connect/` — Express account creation + onboarding links
- `app/api/escrow/` — PI create / capture / cancel
- `app/api/vera/` — 12 ConvAI tool endpoints, descriptors in [`docs/vera-tools.json`](docs/vera-tools.json)
