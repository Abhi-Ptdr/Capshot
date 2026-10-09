import { useEffect, useState } from 'react';

/**
 * Phase 1 Plan 03 — In-app browser detection (CONV-02).
 *
 * 95% of CAPSHOT traffic lands via Instagram/Facebook paid ads, which open
 * links in the social app's embedded WKWebView (iOS) or WebView (Android)
 * instead of Safari/Chrome. The sandboxed webview silently kills Meta Pixel
 * attribution (iOS cookies stripped), degrades UPI payment handoff, and
 * suppresses browser affordances. See research/PITFALLS.md Pitfall 4.
 *
 * Detection strategy per Pitfall 4:
 *   - Instagram WKWebView UA contains "Instagram"
 *   - Facebook WebView (both iOS + Android) UA contains FBAN, FBAV, or FB_IAB
 *
 * The detect runs POST-mount (useInAppBrowser hook returns null on first
 * render) to avoid any SSR/hydration mismatch risk — React 19 is strict here.
 *
 * The Android chrome-intent redirect fires once on mount via
 * useAndroidChromeIntent — if Chrome is not installed, Android falls back to
 * the default browser; if that fails, the sticky-top banner remains visible
 * as a user-facing instruction per CONTEXT D-13.
 */

export type InAppBrowser = 'instagram' | 'facebook' | null;

/**
 * Classify a User-Agent string into Instagram / Facebook / null (plain).
 * Pure function; UA defaults to `navigator.userAgent` for in-browser calls.
 */
export function isInAppBrowser(
  ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : '',
): InAppBrowser {
  if (/Instagram/i.test(ua)) return 'instagram';
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook';
  return null;
}

/**
 * True when UA matches Android. Used to gate the chrome-intent redirect.
 */
export function isAndroid(
  ua: string = typeof navigator !== 'undefined' ? navigator.userAgent : '',
): boolean {
  return /Android/i.test(ua);
}

/**
 * Attempt to hand off to Chrome via the Android intent:// scheme. Chrome
 * registers the intent://scheme=https;package=com.android.chrome handler on
 * Android; if Chrome is not installed the OS falls back to the default
 * browser; if that fails too, the banner remains as a user-facing fallback
 * (CONTEXT D-13).
 *
 * Targets the current page's host+path by default so the user lands on the
 * exact URL they tapped from Instagram/Facebook.
 */
export function redirectAndroidToChromeIntent(
  targetUrl: string = typeof window !== 'undefined'
    ? window.location.href
    : '',
): void {
  if (typeof window === 'undefined' || targetUrl === '') return;
  let url: URL;
  try {
    url = new URL(targetUrl);
  } catch {
    return;
  }
  const host = url.host;
  const path = url.pathname + url.search + url.hash;
  const intent = `intent://${host}${path}#Intent;scheme=https;package=com.android.chrome;end`;
  // Observability hook: tests can read `window.__capshot_intent_attempted__`
  // to confirm the attempt happened. This stays in production because the
  // write is a trivial string assignment on a window property and does not
  // mutate behavior. Chromium test environments block the actual
  // intent:// navigation, so this attribute is the primary observable in
  // automated tests; real-device Chrome handoff is covered by the Phase 1
  // close-out human checkpoint (verification 4).
  try {
    (
      window as unknown as { __capshot_intent_attempted__?: string }
    ).__capshot_intent_attempted__ = intent;
  } catch {
    /* ignore if window is sealed */
  }
  window.location.href = intent;
}

/**
 * React hook returning the detected in-app browser (or null). Starts at null
 * on first render so SSR/hydration never produces a server/client mismatch;
 * the real value lands after the mount effect runs client-side.
 */
export function useInAppBrowser(): InAppBrowser {
  const [value, setValue] = useState<InAppBrowser>(null);
  useEffect(() => {
    setValue(isInAppBrowser());
  }, []);
  return value;
}

/**
 * React hook that fires the Android chrome-intent redirect exactly once per
 * mount when `enabled` is true. Caller (the banner component) should pass
 * `inApp !== null` so the redirect only runs for Instagram/Facebook WebView
 * visitors; the Android gate is checked internally so iOS/desktop callers
 * stay no-op.
 */
export function useAndroidChromeIntent(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    if (isAndroid() && isInAppBrowser() !== null) {
      redirectAndroidToChromeIntent();
    }
  }, [enabled]);
}
