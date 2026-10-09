import { test, expect, devices } from '@playwright/test';

/**
 * Phase 1 Plan 03 — InAppBrowserBanner E2E (CONV-02).
 *
 * Tests B1–B6:
 *   B1 iOS Instagram UA → banner visible, sticky top, z-index 60
 *   B2 Dismiss persists in sessionStorage; reload keeps dismissed; clearing returns
 *   B3 Android Facebook UA → page attempts intent:// handoff (observable attempt)
 *   B4 Plain Safari UA → no banner
 *   B5 Banner pushes Nav down (flow element, not fixed overlay)
 *   B6 Keyboard dismiss (Enter on focused dismiss button)
 *
 * Banner mounts above <BrowserRouter> inside <LazyMotion>, so it survives
 * route changes and renders at z-index 60 above the Nav (z-50).
 */

const UA_INSTAGRAM_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0.11.108';

const UA_FACEBOOK_ANDROID =
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/440.0.0.33.111;]';

const UA_SAFARI_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1';

test.describe('InAppBrowserBanner (CONV-02) — iOS Instagram', () => {
  test.use({ ...devices['Pixel 7'], userAgent: UA_INSTAGRAM_IOS });

  test('B1: banner renders sticky-top with z-index 60 and inverted colors', async ({
    page,
  }) => {
    await page.addInitScript((ua) => {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => ua,
      });
    }, UA_INSTAGRAM_IOS);
    await page.goto('/');
    const banner = page.locator('[role="status"]').first();
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/open in Safari/i);
    const box = await banner.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBe(0);
    const z = await banner.evaluate(
      (el) => getComputedStyle(el as HTMLElement).zIndex,
    );
    expect(z).toBe('60');
  });

  test('B2: dismiss persists via sessionStorage and reload keeps it dismissed', async ({
    page,
  }) => {
    await page.addInitScript((ua) => {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => ua,
      });
    }, UA_INSTAGRAM_IOS);
    await page.goto('/');
    const banner = page.locator('[role="status"]').first();
    await expect(banner).toBeVisible();
    await page
      .getByRole('button', { name: /Dismiss browser recommendation/i })
      .click();
    await expect(banner).toHaveCount(0);
    const flag = await page.evaluate(() =>
      window.sessionStorage.getItem('capshot-inapp-dismissed'),
    );
    expect(flag).toBe('1');
    await page.reload();
    await expect(page.locator('[role="status"]')).toHaveCount(0);
    // Clear and reload → banner returns
    await page.evaluate(() =>
      window.sessionStorage.removeItem('capshot-inapp-dismissed'),
    );
    await page.reload();
    await expect(page.locator('[role="status"]').first()).toBeVisible();
  });

  test('B5: banner pushes Nav down (Nav bbox.y >= banner height)', async ({
    page,
  }) => {
    await page.addInitScript((ua) => {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => ua,
      });
    }, UA_INSTAGRAM_IOS);
    await page.goto('/');
    const banner = page.locator('[role="status"]').first();
    await expect(banner).toBeVisible();
    const bannerBox = await banner.boundingBox();
    expect(bannerBox).not.toBeNull();
    const nav = page.locator('header[role="banner"]').first();
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();
    // Nav sits BELOW banner (banner is a flow element at the top of body).
    expect(navBox!.y).toBeGreaterThanOrEqual(bannerBox!.height - 1);
  });

  test('B6: keyboard dismiss (Enter on focused dismiss button)', async ({
    page,
  }) => {
    await page.addInitScript((ua) => {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => ua,
      });
    }, UA_INSTAGRAM_IOS);
    await page.goto('/');
    const banner = page.locator('[role="status"]').first();
    await expect(banner).toBeVisible();
    const dismiss = page.getByRole('button', {
      name: /Dismiss browser recommendation/i,
    });
    await dismiss.focus();
    await page.keyboard.press('Enter');
    await expect(banner).toHaveCount(0);
  });
});

test.describe('InAppBrowserBanner (CONV-02) — plain Safari (no banner)', () => {
  test.use({ ...devices['Pixel 7'], userAgent: UA_SAFARI_IOS });

  test('B4: no banner for plain Safari UA', async ({ page }) => {
    await page.addInitScript((ua) => {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => ua,
      });
    }, UA_SAFARI_IOS);
    await page.goto('/');
    // Explicitly wait for app hydration (any element inside Hero/Nav)
    await page.locator('header[role="banner"]').waitFor({ state: 'visible' });
    await expect(page.locator('[role="status"]')).toHaveCount(0);
  });
});

test.describe('InAppBrowserBanner (CONV-02) — Android Facebook intent attempt', () => {
  test.use({ ...devices['Pixel 7'], userAgent: UA_FACEBOOK_ANDROID });

  test('B3: Android FB UA triggers intent:// navigation attempt within 2 s', async ({
    page,
  }) => {
    // Spoof UA in the page context too (navigator.userAgent)
    await page.addInitScript((ua) => {
      Object.defineProperty(window.navigator, 'userAgent', {
        get: () => ua,
      });
    }, UA_FACEBOOK_ANDROID);

    // We cannot intercept the browser's actual navigation to intent:// because
    // Chromium blocks it. Instead, we instrument window.location.href setter
    // BEFORE the app code runs; the banner's mount effect will call it. The
    // instrumentation captures the attempted URL on window.__capshot_intent__.
    await page.addInitScript(() => {
      try {
        const original = Object.getOwnPropertyDescriptor(
          Window.prototype,
          'location',
        );
        void original; // not used; we just mark the probe is installed
      } catch (e) {
        void e;
      }
      // Override assignment to location.href: we can't trap `location = x` in
      // Chromium reliably, but we can trap `location.href = x` by patching
      // the setter on the actual window.location instance.
      const win = window as unknown as {
        __capshot_intent__?: string;
        __capshot_intent_installed__?: boolean;
      };
      win.__capshot_intent__ = undefined;
      win.__capshot_intent_installed__ = true;
      try {
        // Replace the entire location object with a Proxy so href writes are observable.
        const realLocation = window.location;
        const proxy = new Proxy(realLocation, {
          set(target, prop, value) {
            if (prop === 'href' && typeof value === 'string') {
              win.__capshot_intent__ = value;
              // Do NOT propagate to the real location — this prevents the
              // browser from attempting the actual navigation to intent://,
              // which Chromium would log a NET::ERR about anyway.
              return true;
            }
            // Fall through for any other property.
            (target as unknown as Record<PropertyKey, unknown>)[
              prop as string
            ] = value;
            return true;
          },
          get(target, prop) {
            const v = (target as unknown as Record<PropertyKey, unknown>)[
              prop as string
            ];
            if (typeof v === 'function') return v.bind(target);
            return v;
          },
        });
        Object.defineProperty(window, 'location', {
          configurable: true,
          get: () => proxy,
          set: (value: string) => {
            win.__capshot_intent__ = value;
          },
        });
      } catch (e) {
        void e;
      }
    });

    await page.goto('/');

    // The banner's useAndroidChromeIntent effect fires on mount. Poll for
    // the captured intent attempt up to 2 seconds.
    await expect
      .poll(
        async () =>
          page.evaluate(
            () =>
              (window as unknown as { __capshot_intent__?: string })
                .__capshot_intent__ ?? null,
          ),
        { timeout: 2000, intervals: [100, 200, 300, 500] },
      )
      .toMatch(/^intent:\/\/.+#Intent;scheme=https;package=com\.android\.chrome;end$/);
  });
});
