# Social media post drafts — Vouch submission day (Thu 21 May 2026)

> Drop these into the matching platform 0–60 min after submitting on hacks.elevenlabs.io. Tag `@ElevenLabsDevs` + `@stripe` + `@isnit0` (Joe Reeve, ElevenLabs DevRel) on every platform that supports it.
>
> **Demo video** (65s): attach to all four posts. Vertical 1080×1920 cut for IG/TikTok, square 1080×1080 for LinkedIn, 16:9 1920×1080 for X.

---

## X / Twitter — main post (240 chars + thread)

```
Just shipped Vouch for @ElevenLabsDevs Hack #9: @stripe.

Voice-recorded escrow for freelancers + high-value P2P sales.

The moat: when something arrives broken, Vera replays the seller's
own voice committing. They can't un-say it.

The evidence is the promise. 🎙

🧵👇
```

### Thread reply 1/4 (the demo angle)
```
Other escrow services arbitrate from text trails — he-said-she-said
over Messenger.

Vouch arbitrates from voice. Stripe holds the money. Vera (ElevenLabs
ConvAI) captures the agreement on both sides.

[demo video 1920×1080]
```

### Thread reply 2/4 (the stack)
```
Built on real primitives, not toy APIs:

Stripe: Connect Express, manual-capture Payment Intents, destination
charges, application fees, Issuing (frozen virtual cards), webhooks.

ElevenLabs: ConvAI (Vera live in 80 languages), Voice Library, v3
Conversational, Scribe v2 Realtime ASR, TTS.

5 primitives each. Every one structurally required.
```

### Thread reply 3/4 (the dispute moment)
```
The killer beat is the dispute replay.

When Sarah's iPhone arrives cracked, Vera doesn't reach for a chat
log. She plays back Marcus's literal voice from the agreement:

"no scratches, original box."

Marcus can't un-say it. Vera's ruling: refund. ⚖️
```

### Thread reply 4/4 (call to action)
```
This is the second @ElevenLabsDevs hackathon I've shipped:

Hack #5 (Kiro): Hearsay → 3rd of 74 ($2,330 prize)
Hack #9 (Stripe): Vouch → live now

Try the demo: vouch.app/demo (no signup)
Code: github.com/cheungscott/vouch (MIT)

Cheers @isnit0 + the EL team for the platform.
```

---

## LinkedIn — long-form post (~1100 chars)

```
Just shipped Vouch — my second hackathon submission for the
ElevenLabs platform in 2026.

⚡ The problem: peer-to-peer commerce on Marketplace, eBay, freelance
gigs all rely on text trails for dispute resolution. "He said
she said" over Messenger is the only contract that exists.

🎙 The Vouch approach: voice-recorded escrow. Stripe holds the money.
Vera, our AI mediator, captures the agreement on both sides — in
voice. When something goes wrong, Vera replays the seller's literal
commitment in their own voice. The evidence is the promise.

🛠 What it took to build in 7 days:

→ Stripe Connect Express (UK seller onboarding via destination
  charges with manual capture for the escrow hold)
→ Stripe Issuing (mint a frozen virtual card sized to escrow,
  unfreezes on voice-confirmed receipt — Vouch inverts the typical
  agentic-commerce pattern)
→ Stripe Payment Intents + webhooks for the state machine
→ ElevenLabs ConvAI (Vera, 12 server tools, 80 languages enabled)
→ ElevenLabs v3 Conversational with audio tags for emotional
  delivery (warmly / confidently / empathetically)
→ Scribe v2 Realtime ASR (the transcript IS the legally-binding terms)
→ Vercel KV for deal persistence; Next.js 16 + React 19

Standing on Hearsay's shoulders here. That one won 3rd of 74 at
Hack #5: Kiro ($2,330 prize). Same systematic approach — bet
on a moat that competitors can't replicate, ship the whole
production loop, judge on demo + code together.

Demo: vouch.app/demo (no signup)
Code: github.com/cheungscott/vouch (MIT)

Thanks to the @ElevenLabs and @Stripe teams for an actual platform
to build on — not a stack of toy APIs.

#hackathon #fintech #voiceAI #ElevenLabs #Stripe
```

---

## Instagram — caption (~600 chars + carousel)

```
Voice-recorded escrow. 🎙

When something arrives broken, the contract isn't a screenshot —
it's the seller's own voice committing. They can't un-say it.

Built on Stripe + ElevenLabs in 7 days for the ElevenHacks 2026
Stripe hackathon.

5 Stripe primitives (Connect Express, manual-capture PIs,
destination charges, Issuing virtual cards, webhooks) + 5 EL APIs
(ConvAI, v3 Conversational, Scribe v2, Voice Library, TTS). Every
one structurally required — pull one out and the product breaks.

The killer demo: a buyer disputes a cracked phone. Vera plays back
the seller saying "no scratches" — at the exact moment they
committed. Refund issued.

Demo + code in bio.

@elevenlabs @stripe #hackathon #voiceai #fintech
```

### IG Carousel slides (suggest 5)

1. **Hero** — black canvas, large italic Fraunces: "The handshake, on the record."
2. **The moat** — split frame, left "Text trails" with sad chat-icon, right "Voice recordings" with Vera waveform
3. **How it works** — 4 numbered cards (Speak / Sign-off / Lock / Release)
4. **Stripe + ElevenLabs stack** — two columns of primitives, 5 each
5. **CTA** — "vouch.app/demo · github.com/cheungscott/vouch"

---

## TikTok / Reels — caption (~150 chars + 9:16 video)

```
when the seller can't un-say what they promised 🎙

voice-recorded escrow on @ElevenLabs + @Stripe

vouch.app/demo

#hackathon #voiceai #stripe #elevenlabs #fintech
```

**Video hook (first 1.5s)**: cracked iPhone photo + "Marcus said: no scratches" overlay → Vera's waveform highlights "scratches" → Ruling card lands.

**Video body**: cut down the 65s demo to ~25s emphasising the dispute moment + final tagline.

---

## Hashtag bank (use sparingly per platform)

`#ElevenHacks` `#hackathon` `#fintech` `#voiceAI` `#ElevenLabs` `#Stripe` `#agenticAI` `#voicefirst` `#payments` `#escrow` `#productlaunch` `#shipping` `#indiedev` `#KCL` `#nextjs`

LinkedIn: 3-4 hashtags max. X/IG/TikTok: 5-7 max. Don't over-tag.

---

## Posting cadence

| Time (UK) | Platform | Action |
|---|---|---|
| 14:00 Thu | hacks.elevenlabs.io | Submit |
| 14:30 Thu | X | Post + thread (4 replies, ~5 min apart) |
| 15:00 Thu | LinkedIn | Long-form post |
| 15:30 Thu | Instagram | Carousel (5 slides) |
| 16:00 Thu | TikTok / Reels | 25s video |
| 16:30 Thu | X | Quote-tweet of own post tagging @isnit0 specifically, asking for engagement |
| 17:00 Thu | DEADLINE ✋ | (already submitted at 14:00 — buffer time) |

**Engagement tips**:
- Reply to anyone who quote-tweets, fast (first hour matters most)
- Pin the X post to profile for 48h
- DM Joe Reeve (@isnit0) the submission link as a separate ping — don't just rely on the tag landing in his notifications
- Cross-link platforms (each post mentions "thread on X" / "carousel on IG" etc.) to drive multi-platform engagement
