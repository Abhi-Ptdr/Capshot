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
 *
 * UA spoofing strategy: Playwright's `test.use({userAgent})` cannot be scoped
 * to a describe (forces a new worker), so we set the UA per-test via
 * `page.setExtraHTTPHeaders({ 'User-Agent': ... })` AND an `addInitScript`
 * that redefines `navigator.userAgent` getter (so client-side UA matches too).
 * The top-level `test.use(devices['Pixel 7'])` provides the mobile viewport.
 */

test.use({ ...devices['Pixel 7'] });

const UA_INSTAGRAM_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0.11.108';

const UA_FACEBOOK_ANDROID =
  'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/440.0.0.33.111;]';

const UA_SAFARI_IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1';

/** Install a client-side navigator.userAgent getter override + HTTP UA header */
async function spoofUserAgent(page: import('@playwright/test').Page, ua: string) {
  await page.setExtraHTTPHeaders({ 'User-Agent': ua });
  await page.addInitScript((spoofedUa) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      configurable: true,
      get: () => spoofedUa,
    });
  }, ua);
}

test('B1: Instagram iOS UA → banner sticky-top, z-index 60, Safari copy', async ({
  page,
}) => {
  await spoofUserAgent(page, UA_INSTAGRAM_IOS);
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

test('B2: dismiss persists via sessionStorage; reload keeps dismissed; clear returns banner', async ({
  page,
}) => {
  await spoofUserAgent(page, UA_INSTAGRAM_IOS);
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
  // Clear and reload → banner returns.
  await page.evaluate(() =>
    window.sessionStorage.removeItem('capshot-inapp-dismissed'),
  );
  await page.reload();
  await expect(page.locator('[role="status"]').first()).toBeVisible();
});

test('B3: Android Facebook UA → intent:// navigation attempt observable within 2 s', async ({
  page,
}) => {
  await spoofUserAgent(page, UA_FACEBOOK_ANDROID);

  // Chromium blocks intent:// navigation outright (user-gesture gate), so
  // we observe the ATTEMPT via two independent signals, with the first
  // being authoritative:
  //
  //   (1) `window.__capshot_intent_attempted__` — set by
  //       `redirectAndroidToChromeIntent` BEFORE the href assignment that
  //       Chromium then rejects. This is the primary assertion; it proves
  //       the detect-and-dispatch code path executed with a correctly
  //       formatted intent URL regardless of the renderer's downstream
  //       rejection of the actual navigation.
  //   (2) `page.on('console')` — captures Chromium's user-gesture-required
  //       console error whose text echoes the attempted intent URL. Used
  //       as a secondary diagnostic signal when Playwright run-matrix
  //       permits it (surfaced in test output on failure).
  //
  // Real-device Chrome handoff on Android is deferred to the Phase 1
  // close-out human checkpoint (verification 4) — Chromium's refusal to
  // navigate intent:// in test environments means the user-visible
  // outcome (Chrome actually opening) cannot be asserted here.
  const intentConsoleMessages: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (
      text.includes('intent://') &&
      /intent:\/\/.+#Intent;scheme=https;package=com\.android\.chrome;end/.test(
        text,
      )
    ) {
      intentConsoleMessages.push(text);
    }
  });

  await page.goto('/');

  await expect
    .poll(
      () =>
        page.evaluate(
          () =>
            (
              window as unknown as {
                __capshot_intent_attempted__?: string;
              }
            ).__capshot_intent_attempted__ ?? null,
        ),
      { timeout: 2000, intervals: [100, 200, 300, 500] },
    )
    .toMatch(
      /^intent:\/\/.+#Intent;scheme=https;package=com\.android\.chrome;end$/,
    );
});

test('B4: plain Safari UA → no banner', async ({ page }) => {
  await spoofUserAgent(page, UA_SAFARI_IOS);
  await page.goto('/');
  // Wait for the app to hydrate: Nav visible → useInAppBrowser has run.
  await page.locator('header[role="banner"]').waitFor({ state: 'visible' });
  // Allow one more microtask for the detect-and-set to settle.
  await page.waitForTimeout(100);
  await expect(page.locator('[role="status"]')).toHaveCount(0);
});

test('B5: banner pushes Nav down (Nav.y ≥ banner.height)', async ({ page }) => {
  await spoofUserAgent(page, UA_INSTAGRAM_IOS);
  await page.goto('/');
  const banner = page.locator('[role="status"]').first();
  await expect(banner).toBeVisible();
  const bannerBox = await banner.boundingBox();
  expect(bannerBox).not.toBeNull();
  const nav = page.locator('header[role="banner"]').first();
  const navBox = await nav.boundingBox();
  expect(navBox).not.toBeNull();
  // Nav sits at/below the banner's bottom edge (banner is a flow element).
  expect(navBox!.y).toBeGreaterThanOrEqual(bannerBox!.height - 1);
});

test('B6: keyboard Enter on focused dismiss button closes the banner', async ({
  page,
}) => {
  await spoofUserAgent(page, UA_INSTAGRAM_IOS);
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
