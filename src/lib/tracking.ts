/**
 * Phase 1 Plan 03 — client-side Meta Pixel + Conversions API dedup wrapper
 * (CONV-01).
 *
 * The deduplication contract (Meta Events Manager):
 *   - fbq('track', 'Lead', { event_id }) fires client-side
 *   - fetch('/api/track-lead', { body: { event_id, ... } }) fires server-side
 *   - BOTH calls carry the SAME crypto.randomUUID() event_id
 *   - Events Manager dedups to a single Lead event per click
 *
 * Fire-and-forget is a hard requirement:
 *   - trackLead MUST NOT await the fetch — the anchor's default navigation
 *     to wa.me must proceed immediately. We use `keepalive: true` so the
 *     browser keeps the connection alive across the imminent navigation.
 *   - All error paths (ad-blocker shadowing fbq, CAPI endpoint down,
 *     network broken) are swallowed. The CTA's user-visible outcome
 *     (WhatsApp opens) MUST NOT depend on tracking succeeding.
 *
 * iOS WKWebView rationale (research/PITFALLS.md Pitfall 4):
 *   - Instagram's embedded WebView strips cross-site cookies on iOS, so
 *     the Pixel's cookie-based attribution breaks silently for 95% of
 *     CAPSHOT's ad traffic. CAPI is the backup channel: it ships the IP +
 *     UA from the server where cookies don't matter. The shared event_id
 *     is what Meta uses to match the two signals and keep a single Lead.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Generate a UUID v4 for the shared event_id. Uses the Web Crypto API when
 * available (every target browser per Vite 8's baseline-widely-available).
 * Falls back to a Date.now()+random string so the fire-and-forget path never
 * throws in ancient embedded browsers.
 */
export function generateEventId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback — not a true UUID v4, but preserves the "unique per click"
  // contract. Only reaches here on genuinely ancient browsers (<Chrome 92).
  const rand = Math.random().toString(16).slice(2, 10);
  const rand2 = Math.random().toString(16).slice(2, 6);
  return `${Date.now().toString(16).padStart(8, '0').slice(-8)}-${rand2}-4${rand.slice(0, 3)}-8${rand.slice(3, 6)}-${rand2}${rand.slice(0, 8)}`;
}

export interface TrackLeadInput {
  event_source_url: string;
}

/**
 * Fire a Lead event via BOTH the client-side Pixel and the server-side
 * CAPI edge function with a shared event_id. Returns void immediately —
 * does NOT await either call.
 */
export function trackLead(input: TrackLeadInput): void {
  const event_id = generateEventId();

  // (1) Client-side Pixel. Wrapped in try/catch so an ad-blocker shadowing
  //     fbq (e.g. uBlock Origin's `fbq = ()=>{throw...}` pattern) never
  //     propagates to the CTA's anchor-navigate path.
  try {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { event_id });
    }
  } catch {
    /* ad-blocker shadow — safe to ignore */
  }

  // (2) Server-side CAPI. keepalive:true keeps the fetch connection alive
  //     through the imminent navigation to wa.me. Any sync throw (CSP,
  //     network layer refusal) is caught here; any async rejection is
  //     caught on the returned promise. Both paths swallow silently.
  try {
    const req = fetch('/api/track-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_id,
        event_source_url: input.event_source_url,
        event_name: 'Lead',
      }),
      keepalive: true,
    });
    // `req` may be a thenable; swallow rejections. In the test harness
    // vi.stubGlobal('fetch', vi.fn().mockResolvedValue(...)) also returns
    // a thenable, so this branch exercises the same code path.
    if (req && typeof (req as Promise<unknown>).catch === 'function') {
      (req as Promise<unknown>).catch(() => {
        /* fire-and-forget — swallow async rejection */
      });
    }
  } catch {
    /* fetch threw synchronously (CSP block, offline) — safe to ignore */
  }
}

export default trackLead;
