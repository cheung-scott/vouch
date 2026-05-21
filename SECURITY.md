# Security

Vouch handles money movement, PII, and identity documents. This doc covers the security posture of the hackathon-shipped codebase and what's deferred to production hardening.

## What's in place

### Money-movement endpoints
Every Stripe-touching route verifies three things in order:
1. Deal ID exists and belongs to the calling context
2. PaymentIntent ownership matches (PI ID stored on the deal record matches the inbound claim)
3. Deal status passes a state-machine guard (e.g. you cannot `release` a deal in `DRAFT`)

An anonymous caller with a PaymentIntent ID alone cannot capture or cancel. Guard logic lives at the top of every handler in `app/api/escrow/*` and `app/api/vera/lock-escrow`, `app/api/vera/release-escrow`, `app/api/vera/refund-deal`.

### Webhook handling
- Signature verification against the **raw request body** (not parsed JSON — body has to be re-read as text before parsing)
- Multi-secret verification (separate signing secrets for the platform-scope vs connected-accounts-scope endpoints in Stripe v2 webhooks)
- KV-backed idempotency on `event.id` with 4-day TTL — replay-safe
- 3DS `requires_action` + async `processing` events routed alongside the happy path

### Response shapes are curated
Not blanket-serialised. `GET /api/deals/[id]` returns only what the UI needs. Emails, phone numbers, and Stripe identifiers stay server-side. List endpoints (`GET /api/deals`) are gated behind `OWNER_TOKEN` in production — no anonymous enumeration.

### Stripe error sanitisation
All Stripe SDK errors pass through `sanitizeStripeError()` in `lib/stripe.ts` before reaching clients. No key-mode hints, no account hints, no rate-limit reconnaissance signal. Full errors go to server logs only.

### State-machine guards are symmetric
Paired transitions (e.g. `commit-buyer-side` / `commit-seller-side`) apply the same status checks. A deal in `MONEY_HELD` cannot be regressed to an earlier state by either party.

### Connect onboarding is status-gated
`create-account` only binds a seller's `acct_…` ID when the deal is still in `DRAFT` or `AWAITING_SELLER`. Once `AGREED`, the seller is locked in — closes a fund-rerouting vector where a malicious caller could race the real seller through onboarding to attach their own acct.

### No secrets in the client
`APP_URL` is server-only (not `NEXT_PUBLIC_*`). The Stripe publishable key is the only client-visible Stripe credential. Owner tokens, agent IDs, and webhook secrets stay server-side.

## What's deferred to production

Hackathon scope explicitly does NOT include these layers. Each is a roadmap item with the specific failure mode it closes.

| Layer | Failure it closes |
|---|---|
| **Session-based AuthN** | Currently URL-bearer model — anyone with a deal URL can act on it. Production needs cookie-pinned ownership + magic-link return-visit auth. |
| **Rate limiting** | Per-call Stripe billing cost on identity verification + agent endpoints means abuse = real $$$. Production needs Vercel Edge rate-limit middleware. |
| **Signed-URL voice storage** | Voice recordings are GDPR Article 9 biometric data. Currently only ConvAI session IDs are stored server-side; recordings stay with ElevenLabs. Production needs short-lived signed URLs per-request, never blanket-accessible. |
| **Paid penetration test** | First external security investment post-validation. ~$8-15k from a reputable firm. |
| **SOC 2** | Post-revenue, required by enterprise customers. |

## Audit history

The hackathon-shipped codebase has been adversarially reviewed during development. Critical findings (state-machine bypass vectors, raw-body verification, response leakage) were remediated before public deploy. Off-plan log + remediation history lives in the project's research notes (private — available on request).

## Reporting

Security concerns: open a GitHub issue with the `[security]` prefix, or DM Scott Cheung directly. Production-grade responsible-disclosure programme will be in place post-revenue.
