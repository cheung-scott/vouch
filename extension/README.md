# Vouch — Chrome extension

Injects a **"Pay with Vouch"** button into eBay product listing pages. Click the button and the eBay listing's item title, price, currency, and seller username are scraped from the page DOM and passed via query params to `vouch.fund/new`, which pre-populates the deal intake.

Result: the buyer (Sarah) only needs to confirm her name + email and answer two short questions (delivery method + extras) instead of five. The extension is the **entry point** for the Vouch demo flow.

## Architecture

```
eBay listing page
   │
   │  content script injects button
   ▼
[ Pay with Vouch ]  ←─── content-ebay.js / content-ebay.css
   │
   │  click → scrape DOM → build URL
   ▼
vouch.fund/new?source=ebay&item=...&price=...&currency=...&seller=...&ref=...
   │
   │  /new page reads query params on mount, calls /api/vera/extract-terms
   │  for each pre-fill, then jumps to delivery question
   ▼
Buyer flow continues with terms already captured
```

Manifest V3, zero runtime permissions (only host permissions for eBay listing URLs), no background service worker, no analytics.

## Files

| | What |
|---|---|
| `manifest.json` | MV3 manifest. Matches `*.ebay.co.uk/itm/*` and `*.ebay.com/itm/*`. |
| `src/content-ebay.js` | Content script: button injection + DOM scraping + click handler |
| `src/content-ebay.css` | Button styling — matches Vouch brand tokens (indigo gradient, Fraunces italic on "Vouch" wordmark, JetBrains Mono sub-label) |
| `icons/icon-{16,32,48,128}.png` | Brand-consistent icon set (white check on indigo gradient) |
| `scripts/generate-icons.py` | Regenerates the icon set via Pillow (run if you change the design) |

## Install in Chrome (developer mode)

1. Open Chrome → `chrome://extensions`
2. Toggle **"Developer mode"** on (top-right)
3. Click **"Load unpacked"**
4. Select the `D:\Projects\vouch\extension` folder
5. The Vouch extension appears in your toolbar with the indigo-check icon

## Verify it works

1. Make sure the main Vouch app is running locally: `cd D:\Projects\vouch && pnpm dev` (boots on http://localhost:3000)
2. Visit any eBay listing — for example: https://www.ebay.co.uk/itm/325912345678 (any iPhone, watch, etc.)
3. You should see a **"Pay with Vouch"** button injected above the eBay "Buy It Now" button
4. Click it → a new tab opens at `http://localhost:3000/new?source=ebay&item=...&price=...&currency=USD&seller=...`
5. The /new page should show the **"Continuing from eBay"** banner with the captured item, amount, and seller pre-filled

The extension automatically picks between `localhost:3000` (if reachable, dev mode) and `https://vouch.fund` (production fallback) — no config needed.

## Selectors and resilience

eBay's DOM changes frequently. `content-ebay.js` uses **fallback selector chains** for each field (title, price, seller, buy-box anchor). If eBay redesigns and the button stops appearing, the fix is to update the `SELECTORS` object in `content-ebay.js`. The `waitForBuyBox()` function tries 20 times across 5 seconds before giving up silently — eBay's buy-box hydrates lazily.

## What's intentionally NOT here

- **No background service worker** — the button injection is purely page-local
- **No telemetry / analytics** — privacy-by-default, no network calls except to vouch.fund on click
- **No popup UI** — the action button in the toolbar has no popup; the integration lives in-page
- **No options page** — no user-facing config; URL is hardcoded
- **Not packaged as a .crx** for the hackathon — judges install via "Load unpacked" if they want to verify live. The README + repo demonstrates the production-shape design.

## Roadmap (post-hackathon)

- Add Vinted, Facebook Marketplace, Craigslist support (one content script per marketplace)
- Sign + publish to the Chrome Web Store (~$5 dev fee + review process)
- Add an options page for user preferences (auto-open vs. confirm-then-open)
- Background service worker that listens for `chrome.tabs.onUpdated` and pre-fetches Vouch session state for faster /new render
