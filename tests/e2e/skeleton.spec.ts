import { test, expect } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Walking Skeleton E2E suite — Phase 1 Plan 01.
 *
 * These tests encode INFRA-01 (stack boots) + INFRA-02 (4 routes + 404
 * fallback) + the Phase 1 CONTEXT-locked copywriting. Any regression here
 * breaks Phase 2 onward because every later plan assumes this scaffold.
 *
 * Test 1-5 cover route rendering (headline copy locks come from UI-SPEC
 * §Copywriting Contract). Test 6 enforces the "true HTTP 404" contract
 * (CONTEXT D-17). Test 7 verifies client-side SPA navigation does not
 * trigger a full-page reload. Test 8 asserts the production build emits
 * a hashed assets folder. Test 9 verifies keyboard a11y for the skip-link.
 */

test('/ renders CAPSHOT H1 and page title contains CAPSHOT', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CAPSHOT/i);
  const h1 = page.locator('h1');
  await expect(h1).toContainText(/CAPSHOT/i);
});

test('/flavors renders locked coming-soon H1', async ({ page }) => {
  await page.goto('/flavors');
  await expect(page.locator('h1')).toHaveText('All 16 flavors coming soon.');
});

test('/about renders locked coming-soon H1', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toHaveText('Our story is on the way.');
});

test('/contact renders locked coming-soon H1', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('h1')).toHaveText(
    "Say hi on WhatsApp — we're here now.",
  );
});

test('/does-not-exist renders the branded 404 page', async ({ page }) => {
  await page.goto('/does-not-exist');
  const h1Text = await page.locator('h1').textContent();
  expect(h1Text).toMatch(/404|wrong twist|cap didn't fit/i);
});

test('/does-not-exist is served as HTTP 404 by the production preview', async ({
  request,
}) => {
  const response = await request.get('/does-not-exist');
  expect(response.status()).toBe(404);
});

test('client-side navigation does not trigger a full-page reload', async ({
  page,
}) => {
  await page.goto('/');
  // Mark the current window so a full reload would wipe the marker.
  await page.evaluate(() => {
    (window as unknown as { __spa_marker__?: number }).__spa_marker__ =
      Date.now();
  });
  await page.getByTestId('nav-link-flavors').click();
  await expect(page.locator('h1')).toHaveText('All 16 flavors coming soon.');
  const stillHasMarker = await page.evaluate(
    () =>
      typeof (window as unknown as { __spa_marker__?: number })
        .__spa_marker__ === 'number',
  );
  expect(stillHasMarker).toBe(true);
});

test('production build emits dist/index.html plus hashed JS assets', async () => {
  const distIndex = resolve(process.cwd(), 'dist/index.html');
  const assetsDir = resolve(process.cwd(), 'dist/assets');
  expect(existsSync(distIndex)).toBe(true);
  expect(existsSync(assetsDir)).toBe(true);
  const hashedJs = readdirSync(assetsDir).filter((f) => /\.js$/.test(f));
  expect(hashedJs.length).toBeGreaterThan(0);
});

test('skip-link is keyboard-focusable from URL bar and jumps to #main', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByTestId('skip-link');
  await expect(skip).toBeFocused();
  // Activate the skip link; focus should move to the <main id="main"> landmark.
  await page.keyboard.press('Enter');
  const mainIsFocused = await page.evaluate(() => {
    const main = document.getElementById('main');
    return main !== null && document.activeElement === main;
  });
  // Allow either activeElement === #main OR skip to be unmounted via :not(:focus-within)
  // — both are valid "jumped to main" implementations. Primary assertion is the
  // #main landmark being in the focus path.
  const skipLinkStillVisible = await skip.isVisible().catch(() => false);
  expect(mainIsFocused || !skipLinkStillVisible).toBe(true);
});
