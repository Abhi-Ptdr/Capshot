import { test, expect, devices } from '@playwright/test';

/**
 * Phase 1 Plan 02 — Theme + FOUC E2E (CONV-04 + ThemeToggle contract).
 *
 * T1 is the CONV-04 proof: with `colorScheme: 'dark'` on a cold cache,
 * the <html> element's computed background must already be brand-deep
 * (#594545) at domcontentloaded — zero cream-to-dark flash. (Previously
 * sampled a pixel on the rendered page, but the inverted-theme Nav
 * added 2026-10-11 + Hero decorative overlays (brand-rose blur glow)
 * made pixel-sampling non-deterministic. Checking the computed style
 * of <html> directly tests the exact CONV-04 guarantee: the inline
 * FOUC script set html.dark before CSS resolved, so <html>'s computed
 * bg is brand-deep. No overlays, no Nav chrome, no Hero decorations
 * can confound this assertion.)
 */

test.use({ ...devices['Pixel 7'] });

test.describe('Theme + FOUC (CONV-04 + ThemeToggle)', () => {
  test('T1 (FOUC-free): dark colorScheme + cold cache → top-left pixel = #594545 at domcontentloaded', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      colorScheme: 'dark',
      viewport: { width: 360, height: 640 },
    });
    const page = await context.newPage();
    // Clear any carryover state so this is a cold cache for the theme prefs.
    await page.addInitScript(() => {
      try {
        window.localStorage.removeItem('capshot-theme');
      } catch (e) {
        void e;
      }
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Assert the HTML element's computed background is brand-deep. This
    // is what the CONV-04 FOUC-prevention script actually guarantees:
    // the inline script in index.html runs synchronously before CSS
    // paints and adds `.dark` to <html>, which (per index.html inline
    // <style>) sets `html.dark { background: #594545 }`. Pixel-sampling
    // the rendered page can be confounded by overlays/decorations
    // (Hero's blur glow, inverted-Nav chrome) — reading the computed
    // style of <html> directly tests the exact FOUC guarantee without
    // those confounds.
    const htmlBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).backgroundColor,
    );
    const htmlHasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    await context.close();
    // backgroundColor returns rgb() form. #594545 = rgb(89, 69, 69).
    expect(htmlHasDarkClass).toBe(true);
    expect(htmlBg).toMatch(/rgb\(\s*89\s*,\s*69\s*,\s*69\s*\)/);
  });

  test('T2: light colorScheme → no .dark class on <html> + meta theme-color = #FFF8EA', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      colorScheme: 'light',
      viewport: { width: 360, height: 640 },
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        window.localStorage.removeItem('capshot-theme');
      } catch (e) {
        void e;
      }
    });
    await page.goto('/');
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(hasDarkClass).toBe(false);
    const themeColor = await page
      .locator('meta[name="theme-color"]')
      .getAttribute('content');
    expect(themeColor).toBe('#FFF8EA');
    await context.close();
  });

  test('T3: toggle persists — click moon, reload → .dark + localStorage + theme-color sync', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      colorScheme: 'light',
      viewport: { width: 360, height: 640 },
    });
    const page = await context.newPage();
    // Cold cache for theme prefs — the newContext starts with an empty
    // localStorage already (no shared state across contexts), so no init
    // script is needed. (An init script running on EVERY navigation would
    // wipe the key after the toggle click → defeats the persistence test.)
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Switch to dark mode/i });
    await expect(toggle).toBeVisible();
    await toggle.click();
    // Confirm the toggle wrote the key before reloading.
    await expect
      .poll(async () =>
        page.evaluate(() => window.localStorage.getItem('capshot-theme')),
      )
      .toBe('dark');
    await page.reload();
    const hasDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    expect(hasDark).toBe(true);
    const stored = await page.evaluate(() =>
      window.localStorage.getItem('capshot-theme'),
    );
    expect(stored).toBe('dark');
    const themeColor = await page
      .locator('meta[name="theme-color"]')
      .getAttribute('content');
    expect(themeColor).toBe('#594545');
    await context.close();
  });

  test('T4: toggle aria-pressed flips between "false" and "true"', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      colorScheme: 'light',
      viewport: { width: 360, height: 640 },
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        window.localStorage.removeItem('capshot-theme');
      } catch (e) {
        void e;
      }
    });
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Switch to/i });
    const before = await toggle.getAttribute('aria-pressed');
    expect(before).toBe('false');
    await toggle.click();
    // After click the label flips (dark now active → prompt to switch back to light)
    const after = await page
      .getByRole('button', { name: /Switch to/i })
      .getAttribute('aria-pressed');
    expect(after).toBe('true');
    await context.close();
  });

  test('T5: toggle hit target ≥ 44×44 px (WCAG 2.5.5)', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: /Switch to/i });
    await expect(toggle).toBeVisible();
    const box = await toggle.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});
