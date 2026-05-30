# Chrome Web Store listing — Vouch

Copy-paste source for the Chrome Web Store developer console submission.

## Item details

### Name
```
Vouch — Pay safely with voice-recorded escrow
```
(Max 75 chars · current: 49)

### Summary / short description
```
Buy on eBay with voice-recorded escrow. Pay with Vouch holds your money safely until the item arrives.
```
(Max 132 chars · current: 104. Matches `manifest.json` description.)

### Detailed description

```
Vouch turns any eBay listing into a voice-recorded escrow deal. Instead of trusting the seller blindly, you record an agreement, lock your money safely, and only release it when the item arrives.

How it works:

1. Browse any eBay listing as normal
2. Click the "Pay with Vouch" button this extension injects next to "Buy It Now"
3. The listing's item, price, currency, and seller are passed to Vouch with one click — no typing
4. Have a 30-second voice conversation with Vera, our AI mediator, to lock in the terms
5. Your money goes into escrow with Stripe — held safely, not sent to the seller yet
6. When the item arrives, confirm it matches by voice. Funds release to the seller
7. If something's wrong, Vouch replays the seller's own voice committing to the terms during dispute resolution

The pitch: existing peer-to-peer platforms arbitrate disputes from text trails — "he said / she said" over Messenger. Vouch arbitrates from voice recordings. When something arrives broken, Vouch replays the original commitment in the seller's own voice. The seller cannot un-say it. The evidence is the promise.

What this extension does:

- Injects a "Pay with Vouch" button on eBay product listing pages (ebay.co.uk and ebay.com)
- Reads the listing's visible details directly from the page
- Opens vouch.fund/new with those details pre-filled when you click

What this extension does NOT do:

- No tracking, no analytics, no telemetry
- No background processes
- No access to other websites
- No data sent anywhere except when you actively click the button
- No card numbers or financial data — that's handled entirely by Stripe on vouch.fund

Built for ElevenHacks 2026 by an indie developer. Open source: github.com/cheungscott/vouch

For privacy details: https://vouch.fund/privacy
For support: contact via vouch.fund or open an issue on GitHub
```

(No length limit. Current: ~280 words.)

### Category
```
Shopping
```

(Alternatives: "Productivity" or "Social & Communication" — Shopping is best fit since the extension only activates on eBay listings.)

### Language
```
English (United Kingdom)
```

## Privacy section

### Privacy practices
- ❌ Personally identifiable information (extension itself collects none)
- ❌ Financial and payment information (handled by Stripe on vouch.fund, not the extension)
- ❌ Authentication information
- ❌ Personal communications
- ❌ Location
- ❌ Web history
- ❌ User activity (the click is local — extension reports nothing)
- ❌ Website content (yes, technically — the extension reads visible DOM on eBay listing pages, but only the publicly displayed item title/price/currency/seller. Disclose this honestly.)

**Justification for "Website content"**: "The extension reads the publicly visible item title, price, currency, and seller username from eBay listing pages so it can pass those values as URL parameters to vouch.fund when the user clicks the 'Pay with Vouch' button. No content is transmitted anywhere unless the user actively clicks the button."

### Single purpose
```
Injects a 'Pay with Vouch' button on eBay listing pages that, when clicked by the user, passes the listing details to vouch.fund to start a voice-recorded escrow deal.
```

### Permission justifications

This extension uses zero permissions and zero host permissions beyond the content-script `matches` for eBay listing URLs. Nothing to justify.

### Data usage compliance
- ✅ "I certify that my data usage complies with the Chrome Web Store Developer Program Policies"

### Privacy policy URL
```
https://vouch.fund/privacy
```

## Visibility

- **Visibility**: Unlisted
  - Anyone with the direct link can install
  - Doesn't appear in Web Store search
  - Faster review (typically 4-24h for a clean Manifest V3 extension)
  - Perfect for hackathon distribution

## Store listing assets

### Icons (already in repo)
- ✅ 128×128 at `extension/icons/icon-128.png`

### Screenshots (5 max, pick 1-3)
- 1280×800 or 640×400 PNG/JPG
- Required: at least 1

**What to capture:**

1. **eBay listing with the "Pay with Vouch" button** — load any real eBay UK listing (the iPhone 15 from `ebay.co.uk/itm/286977628037` works) → screenshot showing the page with the Vouch button injected near "Buy It Now". Crop to 1280×800.
2. **Vouch /new page** — after clicking through, screenshot the deal intake page with the listing context pre-filled
3. **Vera voice session** — optional, screenshot of the voice conversation UI mid-onboarding

### Small promo tile (required)
- 440×280 PNG
- Brand: cream `#f6f5f2` background, indigo `#5266eb` accent
- Suggested composition: Vouch wordmark center-left, "Pay safely on eBay" tagline center-right, subtle Vera waveform icon at bottom edge

### Large promo tile (optional, skip for unlisted)
- 920×680 PNG

### Marquee promo (optional, skip)
- 1400×560 PNG

## Submission checklist

Before clicking submit:

- [ ] Privacy policy live at `https://vouch.fund/privacy` (deploys via push to main)
- [ ] Extension zipped: `Compress-Archive -Path D:\Projects\vouch\extension\* -DestinationPath D:\Projects\vouch\dist\vouch-extension-v0.1.0.zip`
- [ ] At least 1 screenshot ready (1280×800)
- [ ] Promo tile (440×280) ready
- [ ] $5 Chrome Web Store developer fee paid (once per Google account, lifetime)
- [ ] Listing copy pasted from this doc
- [ ] Privacy practices section filled honestly (acknowledge "Website content" with justification)
- [ ] Visibility set to "Unlisted"

After submission:

- Chrome Web Store review status visible in developer console
- Expected: 4-24h for unlisted Manifest V3 with no permissions
- Once approved, copy the shareable install URL into README + Devpost submission

## Post-approval tasks

- [ ] Add Chrome Web Store install link to repo `README.md`
- [ ] Add install link to landing page `app/page.tsx`
- [ ] Mention in Devpost submission text
- [ ] Update demo video script if Beat 1 references the install path
