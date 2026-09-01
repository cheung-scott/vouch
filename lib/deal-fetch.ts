/**
 * Client-side access to the per-party capability token, which arrives in the
 * deal link (`?t=…`) and must ride along on every guarded-route call.
 *
 * One helper on purpose: `eslint.config.mjs` bans bare `fetch()` in the deal
 * pages, so a missed call site fails lint instead of shipping a 401.
 */

export function currentDealToken(): string | null {
  if (typeof window === "undefined") return null;
  const t = new URLSearchParams(window.location.search).get("t");
  return t && t.length > 0 ? t : null;
}

/**
 * Drop-in replacement for `fetch` in the deal pages. Attaches the token to
 * same-origin API calls only — a token must never leak to a third-party host.
 */
export function dealFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const token = currentDealToken();
  const sameOrigin = input.startsWith("/");
  if (!token || !sameOrigin) return fetch(input, init);

  const headers = new Headers(init?.headers);
  headers.set("authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

/**
 * Preserves the token across internal navigation — without it the first
 * `<Link>` a party follows silently drops their credential.
 *
 * Only for links a party follows THEMSELVES. A link handed to the other party
 * needs that party's own token from the server (see `seller_invitation_url`).
 */
export function dealHref(path: string): string {
  const token = currentDealToken();
  if (!token) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}t=${encodeURIComponent(token)}`;
}
