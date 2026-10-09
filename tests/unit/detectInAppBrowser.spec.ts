import { describe, expect, it } from 'vitest';
import { isInAppBrowser, isAndroid } from '@/lib/detectInAppBrowser';

/**
 * Phase 1 Plan 03 — detectInAppBrowser unit spec (CONV-02).
 *
 * Four UA assertions mapped to the plan's <behavior> block:
 *   - iOS Instagram WKWebView → 'instagram'
 *   - Android Facebook WebView (FB_IAB/FBAV markers) → 'facebook'
 *   - Plain iOS Safari → null
 *   - Plain Android Chrome → null
 *
 * Also covers the isAndroid helper used by the Android chrome-intent redirect.
 */

const UA_INSTAGRAM_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0.11.108';

const UA_FACEBOOK_ANDROID =
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/440.0.0.33.111;]';

const UA_SAFARI_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1';

const UA_CHROME_ANDROID =
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 Chrome/118.0.0.0 Mobile Safari/537.36';

describe('isInAppBrowser', () => {
  it('returns "instagram" for iOS Instagram WKWebView UA', () => {
    expect(isInAppBrowser(UA_INSTAGRAM_IOS)).toBe('instagram');
  });

  it('returns "facebook" for Android Facebook WebView UA (FB_IAB / FBAV markers)', () => {
    expect(isInAppBrowser(UA_FACEBOOK_ANDROID)).toBe('facebook');
  });

  it('returns null for plain iOS Safari UA', () => {
    expect(isInAppBrowser(UA_SAFARI_IOS)).toBe(null);
  });

  it('returns null for plain Android Chrome UA', () => {
    expect(isInAppBrowser(UA_CHROME_ANDROID)).toBe(null);
  });
});

describe('isAndroid', () => {
  it('returns true for an Android UA', () => {
    expect(isAndroid(UA_CHROME_ANDROID)).toBe(true);
    expect(isAndroid(UA_FACEBOOK_ANDROID)).toBe(true);
  });

  it('returns false for an iOS UA', () => {
    expect(isAndroid(UA_INSTAGRAM_IOS)).toBe(false);
    expect(isAndroid(UA_SAFARI_IOS)).toBe(false);
  });
});
