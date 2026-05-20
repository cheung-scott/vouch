/**
 * Vouch Chrome extension — eBay content script.
 *
 * Injects a "Pay with Vouch" button onto eBay product listing pages.
 * Click → scrapes item title / price / currency / seller from the DOM
 * and opens vouch.fund/new with those values pre-populated as query params.
 *
 * eBay's DOM changes frequently. Selectors here target the canonical
 * `*.ebay.co.uk/itm/*` and `*.ebay.com/itm/*` product pages as of 2026-05.
 * If eBay redesigns, update SELECTORS below.
 */
(function () {
  "use strict";

  // ───────────────────────────────────────────────────────────
  // Config
  // ───────────────────────────────────────────────────────────

  // Vouch destination — production points at the live app, dev points at localhost.
  // We pick by checking whether localhost:3000 is reachable; otherwise fall back to prod.
  const VOUCH_URL_PROD = "https://vouch.fund/new";
  const VOUCH_URL_DEV = "http://localhost:3000/new";

  const SELECTORS = {
    // Multiple fallbacks — eBay layouts vary across regions and over time
    title: [
      "h1.x-item-title__mainTitle .ux-textspans--BOLD",
      "h1.x-item-title__mainTitle",
      "h1[itemprop='name']",
      "#itemTitle",
      "h1",
    ],
    price: [
      ".x-price-primary .ux-textspans",
      ".x-price-primary",
      "div[itemprop='price'] span",
      "#prcIsum",
      "span.notranslate",
    ],
    seller: [
      ".x-sellercard-atf__info__about-seller a",
      ".ux-seller-section__item--seller a",
      "div[data-testid='seller-section'] a span",
      "span.mbg-nw",
    ],
    // Insertion targets — try in order; first match wins
    buyBoxAnchor: [
      "div.x-buybox__cta",
      "div.vim.x-bin-action",
      "div[data-testid='ux-action-list']",
      "form#binBtn_btn_1",
      "div.actions",
    ],
  };

  const BUTTON_ID = "vouch-pay-button";

  // ───────────────────────────────────────────────────────────
  // Helpers
  // ───────────────────────────────────────────────────────────

  /** Try each selector in order, return the first matched element's textContent (trimmed). */
  function firstText(selectorList) {
    for (const sel of selectorList) {
      const el = document.querySelector(sel);
      if (el && el.textContent && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }
    return "";
  }

  /** Try each selector in order, return the first matched element. */
  function firstElement(selectorList) {
    for (const sel of selectorList) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  /**
   * Parse an eBay price string into { amount, currency }.
   * Handles: "£400.00", "US $399.99", "EUR 1,250.50", "GBP 75", etc.
   */
  function parsePrice(raw) {
    if (!raw) return { amount: "", currency: "" };

    const text = raw.replace(/\s+/g, " ").trim();
    let currency = "";

    if (/£/.test(text) || /\bGBP\b/i.test(text)) currency = "GBP";
    else if (/\$/.test(text) || /\bUSD\b/i.test(text) || /\bUS\s*\$/.test(text)) currency = "USD";
    else if (/€/.test(text) || /\bEUR\b/i.test(text)) currency = "EUR";

    // Pull the first numeric value (with optional thousands separators + decimal)
    const numMatch = text.match(/[\d,]+(?:\.\d+)?/);
    const amount = numMatch ? numMatch[0].replace(/,/g, "") : "";

    return { amount, currency };
  }

  /** Build the destination Vouch URL with pre-populated query params. */
  function buildVouchUrl(base) {
    const title = firstText(SELECTORS.title);
    const priceRaw = firstText(SELECTORS.price);
    const seller = firstText(SELECTORS.seller);
    const { amount, currency } = parsePrice(priceRaw);

    const params = new URLSearchParams();
    params.set("source", "ebay");
    if (title) params.set("item", title);
    if (amount) params.set("price", amount);
    if (currency) params.set("currency", currency);
    if (seller) params.set("seller", seller);
    // The current eBay listing URL — useful as a back-link
    params.set("ref", window.location.href);

    return `${base}?${params.toString()}`;
  }

  /** Decide whether to use localhost (dev) or production. */
  async function pickVouchBase() {
    // Fire a HEAD at localhost:3000; if reachable in <300 ms, use dev. Otherwise prod.
    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(VOUCH_URL_PROD), 300);
      fetch(VOUCH_URL_DEV, { method: "HEAD", mode: "no-cors" })
        .then(() => {
          clearTimeout(timer);
          resolve(VOUCH_URL_DEV);
        })
        .catch(() => {
          clearTimeout(timer);
          resolve(VOUCH_URL_PROD);
        });
    });
  }

  // ───────────────────────────────────────────────────────────
  // Button creation
  // ───────────────────────────────────────────────────────────

  function createButton() {
    const btn = document.createElement("button");
    btn.id = BUTTON_ID;
    btn.type = "button";
    btn.setAttribute("aria-label", "Pay with Vouch — voice-recorded escrow");
    btn.className = "vouch-pay-button";

    // SVG mark — small handshake glyph + wordmark
    btn.innerHTML = `
      <span class="vouch-pay-button__mark" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12L9 17L20 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="vouch-pay-button__label">Pay with <strong>Vouch</strong></span>
    `;

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.add("is-loading");
      const base = await pickVouchBase();
      const url = buildVouchUrl(base);
      window.open(url, "_blank", "noopener,noreferrer");
      // Brief delay before removing loading state in case the user comes back
      setTimeout(() => btn.classList.remove("is-loading"), 1200);
    });

    return btn;
  }

  // ───────────────────────────────────────────────────────────
  // Injection
  // ───────────────────────────────────────────────────────────

  function injectButton() {
    // Idempotent: skip if already injected
    if (document.getElementById(BUTTON_ID)) return true;

    const anchor = firstElement(SELECTORS.buyBoxAnchor);
    if (!anchor) return false;

    const btn = createButton();
    // Insert at the top of the buy-box so it's visually above "Buy It Now"
    anchor.parentNode.insertBefore(btn, anchor);
    return true;
  }

  /**
   * eBay loads the buy-box dynamically. Try a few times across DOM mutations
   * before giving up.
   */
  function waitForBuyBox(maxAttempts = 20, intervalMs = 250) {
    let attempts = 0;
    const tick = () => {
      if (injectButton()) return; // success
      attempts += 1;
      if (attempts >= maxAttempts) return; // give up silently
      setTimeout(tick, intervalMs);
    };
    tick();
  }

  // ───────────────────────────────────────────────────────────
  // Init
  // ───────────────────────────────────────────────────────────

  // Run on document idle (manifest says run_at: document_idle, but the buy-box
  // can hydrate even later via eBay's JS). Use both initial attempt + MutationObserver.
  waitForBuyBox();

  // Also watch for SPA-style navigation on eBay (rare but happens)
  const observer = new MutationObserver(() => {
    if (!document.getElementById(BUTTON_ID)) {
      injectButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
