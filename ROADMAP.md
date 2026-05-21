# Roadmap

What Vouch is post-hackathon, in order of priority. Hackathon scope is intentionally constrained — this is what gets the product from "working prototype" to "live-money production deployment."

## Critical path

### 1. Product validation (~1 month)
20 user interviews. Freelancers + high-value P2P sellers. Validate we built the right thing before sinking legal / compliance cost into a hypothesis. Specifically: confirm voice-recorded payment protection is the buying decision, not just a nice-to-have framing.

### 2. Legal / regulatory
Two paths:
- **Self-licence** — UK FCA authorisation for an Electronic Money Institution (EMI) or Payment Institution (PI). 12-18 months, six figures.
- **Partner** — Connect Custom to a regulated provider (Mercury, Modern Treasury, Stripe Treasury). Faster (~2-3 months), revenue share, but functional from day one.

The partner path is the realistic choice for a solo founder.

### 3. AuthN layer
Cookie-pinned deal ownership at minimum. Magic-link login for return visits (no passwords). Owner-of-deal verification for action endpoints. Currently URL-bearer (anyone with the deal link can act on it) — adequate for hackathon, not for live money.

## Engineering improvements

### 4. Real LLM extraction
Swap `lib/vera-extract.ts` regex utterance parser for Claude. Same `ExtractTermsInput → ExtractTermsOutput` interface. Handles ambiguous deals, multi-currency, conditional terms, fuzzy delivery dates.

### 5. Vercel KV persistence
The `DealStore` interface in `lib/deals.ts` is already designed for swap-in. `KvDealStore` is implemented and auto-detected when KV env vars are present. Just needs production KV instance provisioned.

### 6. Signed-URL voice storage
Voice recordings are GDPR Article 9 biometric data. Currently only ConvAI session IDs stored server-side; recordings stay with ElevenLabs. Production: short-lived signed URLs per-request, never blanket-accessible. Tied to retention policy (probably 7 years for legal evidence, deletable on user request).

### 7. Rate limiting
Vercel Edge middleware. Highest priority: `/api/identity/create-session` and ConvAI session-mint endpoints (per-call Stripe / ElevenLabs billing cost). Then everything else.

## External investments

### 8. Paid penetration test
First external security investment. ~$8-15k from a reputable firm. Mandatory before live money.

### 9. SOC 2
Post-revenue. Required by enterprise customers (freelance platforms, marketplace operators looking at white-label).

## Out of scope (not roadmap, decisions)

These came up during scoping and were intentionally cut. Not future work — choices.

- **Mobile app** — web works on mobile browsers. Native app waits for product-market fit.
- **Multi-currency at locking time** — deals are single-currency. Cross-currency settlement adds FX risk we don't want at this stage.
- **Crypto on-ramp** — not interesting until card-fraud signal demands it.
- **Vouch-branded payout cards** — Stripe Issuing already handles this; rebranding is bike-shedding.

## Naming

"Vouch" conflicts with [Vouch Insurance](https://www.vouch.us) (US-focused startup insurance, well-funded). Hackathon-name only. Rebrand TBD if commercialised — likely after validation phase, before any paid marketing.
