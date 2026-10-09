import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  isAndroid,
  useAndroidChromeIntent,
  useInAppBrowser,
} from '@/lib/detectInAppBrowser';

/**
 * Phase 1 Plan 03 — InAppBrowserBanner (UI-SPEC §Component 5, CONV-02).
 *
 * Sticky-top solid bar with inverted colors (bg = --color-fg, text = --color-bg)
 * so it reads as system chrome. Height 48 px mobile / 56 px ≥sm.
 *
 * Visibility logic (CONTEXT D-10/D-11/D-12/D-13):
 *   - Mounts above <BrowserRouter> so it survives route changes.
 *   - If isInAppBrowser() === null → render nothing (plain browser).
 *   - If sessionStorage.capshot-inapp-dismissed === '1' → render nothing.
 *   - Else → render inverted-color sticky bar + dismiss X.
 *   - Dismiss persists via sessionStorage (session-only per D-11; next ad
 *     click clears sessionStorage and the banner returns).
 *   - On Android + in-app, useAndroidChromeIntent attempts an intent://
 *     chrome handoff on mount; the banner also renders as a visible fallback.
 *
 * ARIA:
 *   - role="status" aria-live="polite" so screen readers hear the
 *     recommendation without a focus trap.
 *   - Dismiss <button> has aria-label="Dismiss browser recommendation" per
 *     UI-SPEC §Copywriting §In-app browser banner.
 *
 * Z-index 60 — sits ABOVE the fixed Nav (z-50). The banner is a flow element
 * (position: sticky, top: 0) so Nav + Hero content push down by banner height
 * when visible — CONTEXT D-10 behavior.
 */

const DISMISS_KEY = 'capshot-inapp-dismissed';

export function InAppBrowserBanner() {
  const inApp = useInAppBrowser();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [androidDetected, setAndroidDetected] = useState<boolean>(false);

  // Post-mount: evaluate isAndroid() for the UI copy swap. The hook below
  // owns the intent redirect; this state only drives the Safari-vs-Chrome
  // copy variant per CONTEXT D-13.
  useEffect(() => {
    setAndroidDetected(isAndroid());
  }, []);

  // Fire Android intent redirect ONCE on mount when both Android + in-app.
  // The hook guards internally so iOS/plain callers stay no-op.
  useAndroidChromeIntent(inApp !== null);

  if (inApp === null || dismissed) return null;

  const copy = androidDetected
    ? 'For the best experience, open in Chrome →'
    : 'For the best experience, open in Safari →';

  const handleDismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* private mode or storage disabled — fall through, still dismiss locally */
    }
    setDismissed(true);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ zIndex: 60 }}
      className="sticky top-0 flex h-12 w-full items-center justify-between bg-[color:var(--color-fg)] px-4 text-[color:var(--color-bg)] sm:h-14"
    >
      <span className="text-sm leading-[1.4] font-normal sm:text-base">
        {copy}
      </span>
      <button
        type="button"
        aria-label="Dismiss browser recommendation"
        onClick={handleDismiss}
        className="inline-flex h-10 w-10 items-center justify-center rounded hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-bg)]"
      >
        <X size={20} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}

export default InAppBrowserBanner;
