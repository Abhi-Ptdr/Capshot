import { test, expect, devices } from '@playwright/test';

/**
 * Phase 2 Plan 03 — Range filter URL sync (RF-E1 – RF-E6).
 *
 * Proves FLAV-02 behavior:
 *   - Pill click updates URL + card count + aria-pressed state (RF-E1)
 *   - Share-link cold load restores filter state (RF-E2, RF-E3)
 *   - Invalid ?range= cleans URL to /flavors via replace:true (RF-E4)
 *   - Browser back-button restores prior filter state (RF-E5)
 *   - Pills wrap on narrow mobile — do NOT scroll horizontally (RF-E6)
 *
 * All tests scope to Pixel 7 (360×800) mobile. The pills live in a
 * <nav aria-label="Filter flavors by range"> wrapper.
 */

test.use(devices['Pixel 7']);

test.describe('Range filter URL sync', () => {
  test('RF-E1 — Fruity Blast pill click → ?range=fruity-blast + 9 cards + aria-pressed', async ({
    page,
  }) => {
    await page.goto('/flavors');
    await page.getByRole('button', { name: 'Fruity Blast' }).click();
    await expect(page).toHaveURL(/\?range=fruity-blast$/);
    await expect(page.locator('[data-flavor]')).toHaveCount(9);
    await expect(
      page.getByRole('button', { name: 'Fruity Blast' }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('RF-E2 — cold-load /flavors?range=desi-cool → 3 cards + pill active', async ({
    page,
  }) => {
    await page.goto('/flavors?range=desi-cool');
    await expect(page.locator('[data-flavor]')).toHaveCount(3);
    await expect(
      page.getByRole('button', { name: 'Desi & Cool' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('RF-E3 — cold-load /flavors?range=premium-sports → 4 cards + pill active', async ({
    page,
  }) => {
    await page.goto('/flavors?range=premium-sports');
    await expect(page.locator('[data-flavor]')).toHaveCount(4);
    await expect(
      page.getByRole('button', { name: 'Premium Sports' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('RF-E4 — invalid ?range=garbage cleans URL + shows all 16', async ({
    page,
  }) => {
    await page.goto('/flavors?range=garbage');
    await expect(page).toHaveURL(/\/flavors$/);
    await expect(page.locator('[data-flavor]')).toHaveCount(16);
    await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  test('RF-E5 — back-button restores prior filter state', async ({ page }) => {
    await page.goto('/flavors');
    await page.getByRole('button', { name: 'Fruity Blast' }).click();
    await expect(page).toHaveURL(/\?range=fruity-blast$/);
    await page.getByRole('button', { name: 'Desi & Cool' }).click();
    await expect(page).toHaveURL(/\?range=desi-cool$/);
    await page.goBack();
    await expect(page).toHaveURL(/\?range=fruity-blast$/);
    await expect(page.locator('[data-flavor]')).toHaveCount(9);
  });

  test('RF-E6 — pills wrap on narrow mobile, do NOT scroll horizontally', async ({
    page,
  }) => {
    await page.goto('/flavors');
    const scrollable = await page.evaluate(() => {
      const nav = document.querySelector(
        'nav[aria-label="Filter flavors by range"]',
      ) as HTMLElement | null;
      if (!nav) return null;
      return nav.scrollWidth > nav.clientWidth;
    });
    expect(scrollable).toBe(false);
  });
});
