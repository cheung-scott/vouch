# Vercel deploy — Vouch

Deploy checklist for **first-time deploy** (Day 5 PM or Day 6 AM).

## Prereqs

- GitHub repo `cheungscott/vouch` exists and is pushed
- All Tier-1 env vars set correctly (see audit pattern in `feedback_env_var_audit_pattern`)
- ConvAI agent published from non-main branch to main BEFORE deploy day

## One-time setup

### 1. Import project

```bash
cd D:/Projects/vouch
pnpm dlx vercel login
pnpm dlx vercel link
```

Pick existing project if one was created, else accept the default to create a new one named `vouch`.

### 2. Bind env vars in the Vercel dashboard

Navigate to **Settings → Environment Variables**. Paste each of the following with **Production** + **Preview** environments checked:

| Variable | Value source | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `.env.local` | 107 chars `sk_test_…` for test mode |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `.env.local` | 107 chars `pk_test_…` — bundled to client |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → endpoint detail | ~35 chars `whsec_…`. Different value per Vercel environment if you create separate Stripe webhook endpoints for production vs preview |
| `STRIPE_CONNECT_CLIENT_ID` | *(not needed)* | OAuth-only; Express direct-API doesn't use it. Skip. |
| `ELEVENLABS_API_KEY` | `.env.local` | 64 chars. **Must have `convai_write` permission** for `pnpm tools:import` to work |
| `ELEVENLABS_VERA_AGENT_ID` | ConvAI dashboard | `agent_…` 32+ chars |
| `ELEVENLABS_VERA_VOICE_ID` | ElevenLabs Voice Library | `19STyY…` 20 chars (Samara X) |
| `APP_URL` | Vercel deployment URL | `https://vouch-<hash>.vercel.app` initially, then your custom domain. Set this AFTER first deploy so you know the URL |
| `OWNER_TOKEN` | Generate a random 64-char hex string | Required (route is fail-CLOSED). `openssl rand -hex 32` or browser console `crypto.randomUUID() + crypto.randomUUID()` |
| `KV_REST_API_URL` | Vercel → Storage → bind a KV/Upstash instance | Auto-populated when you bind a storage product |
| `KV_REST_API_TOKEN` | Same | Auto-populated |

After binding, **trigger a redeploy** (Vercel → Deployments → … → Redeploy) so the new env vars get picked up. Existing builds won't have them.

### 3. Bind a KV / Upstash store

Vercel Project → **Storage** → **Create** → **Upstash Redis** (Vercel KV is deprecated but Upstash is the supported successor). Pick the closest region to your users (eu-west-1 for UK demo). Click **Bind to project**. Env vars (`KV_REST_API_URL` + token, OR `UPSTASH_REDIS_REST_URL` + token — either works with `@vercel/kv`) auto-populate.

The `lib/deals.ts:pickStore()` factory auto-detects either env var shape and flips from `InMemoryDealStore` to `KvDealStore` on next deploy.

### 4. Create the webhook endpoint in Stripe

Stripe Dashboard (Test mode) → **Developers → Webhooks** → **+ Add endpoint**:

- **Endpoint URL**: `https://<your-vercel-domain>/api/stripe/webhook`
- **Listen to events on**: ✅ **Your account** AND ✅ **Connected accounts** (critical — without the Connected accounts checkbox, seller `account.updated` events never reach us)
- **Events to subscribe to**:
  - `account.updated`
  - `payment_intent.amount_capturable_updated`
  - `payment_intent.succeeded`
  - `payment_intent.canceled`
  - `payment_intent.payment_failed`
  - `payment_intent.requires_action`
  - `payment_intent.processing`
  - `charge.dispute.created`
  - `transfer.created`
  - `transfer.updated`
  - `identity.verification_session.*` (optional, can skip — we removed the Identity helper)

After creating, click into the endpoint detail and **copy the Signing secret** (`whsec_…`). Paste into Vercel env var `STRIPE_WEBHOOK_SECRET` and redeploy.

### 5. Update ConvAI tool URLs to point at the Vercel domain

Once the Vercel URL is locked in:

```bash
cd D:/Projects/vouch
APP_URL=https://<your-vercel-domain> pnpm tools:import
```

The script is idempotent — it updates the existing 12 tool URLs in place. After this, Vera's tool calls hit your production deployment instead of localhost / ngrok.

### 6. Smoke-test from /demo route

Open `https://<your-vercel-domain>/demo`. Run through the 3-min scripted walkthrough. Watch the Vercel Function logs (Project → Functions → tail) for any 500s.

## Per-commit deploys

After the one-time setup, every push to `main` auto-deploys via `vercel.json`'s `git.deploymentEnabled.main: true`. Preview deploys also auto-spawn for pull requests.

## Domain (post-hackathon)

To set a custom domain (e.g. `vouch.app` if available), Project → **Settings → Domains** → **Add**. Vercel walks you through DNS records. Cheap registrar pick: Namecheap or Porkbun. Domain check in HANDOFF noted `vouch.app` is likely taken (vouch.com is startup insurance) — confirm before buying.

## Cost expectations (hackathon scale)

- Vercel Hobby: free for the duration. Production traffic from judges is well under the Hobby tier limits.
- Upstash Redis: free tier handles ~10k commands/day; demo + judge testing fits easily.
- Stripe: test mode only — zero cost.
- ElevenLabs: depends on tier (Creator plan = ~275 ConvAI min/month included; demo + judge testing ~100-200 min). Overages ~$0.08/min agent + ~$0.0075/min LLM passthrough = ~$1-15 total worst case.

## Things that will break if you skip a step

| Skip | What breaks |
|---|---|
| KV bind | Deals don't persist across cold starts; demo-day deal goes 404 on next request |
| OWNER_TOKEN env var | `/api/deals` GET returns 403 list_not_configured for everyone (including you) — this is intentional fail-closed per S-107 |
| Webhook endpoint w/o "Connected accounts" | Seller onboarding completion events never fire; UI never knows when seller is ready |
| Re-running tools:import with prod APP_URL | Vera's tools still point at localhost / ngrok and fail when EL cloud tries to reach them |
| ConvAI agent branch → main merge | Production traffic hits a stale agent config (the branch's edits never made it live) |
