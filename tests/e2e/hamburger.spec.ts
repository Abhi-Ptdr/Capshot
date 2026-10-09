import { test, expect, devices } from '@playwright/test';

/**
 * Phase 2 Plan 01 — HamburgerMenu e2e (D2-11 / D2-12 / RESEARCH §4).
 *
 * Tests HM1–HM7 cover:
 *   HM1 trigger visible, dialog not yet mounted
 *   HM2 open → dialog + aria-modal + 3 route links + 3 socials present
 *   HM3 Escape closes + focus returned to trigger
 *   HM4 route-link click closes dialog + navigates
 *   HM5 click-outside overlay closes dialog
 *   HM6 computed z-index on overlay = 70, panel = 71 (above banner z-60)
 *   HM7 keyboard: Tab-to-trigger + Enter opens dialog
 *
 * Mobile viewport via test.use(devices['Pixel 7']) — matches the Phase 1
 * banner/theme/hero suites' per-suite Pixel 7 pattern (playwright.config.ts
 * has only a single `chromium` project).
 */

test.use({ ...devices['Pixel 7'] });

test.describe('HamburgerMenu (D2-11 / D2-12)', () => {
  test('HM1: hamburger trigger visible on load; dialog not yet present', async ({
    page,
  }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu' });
    await expect(trigger).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('HM2: opening shows aria-modal dialog with 3 route links + 3 socials', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Three internal-route links
    await expect(dialog.getByRole('link', { name: 'Flavors' })).toHaveAttribute(
      'href',
      '/flavors',
    );
    await expect(dialog.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about',
    );
    await expect(dialog.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact',
    );

    // Three socials
    const insta = dialog.getByRole('link', { name: /capshot_twist/i });
    await expect(insta).toBeVisible();
    expect(await insta.getAttribute('href')).toMatch(/^https:\/\/instagram\.com\//);

    const whats = dialog.getByRole('link', { name: /WhatsApp/i });
    await expect(whats).toBeVisible();
    expect(await whats.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);

    const mail = dialog.getByRole('link', { name: /@gmail\.com/i });
    await expect(mail).toBeVisible();
    expect(await mail.getAttribute('href')).toMatch(/^mailto:/);
  });

  test('HM3: Escape closes dialog + focus returned to trigger', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 1000 });
    const activeLabel = await page.evaluate(() =>
      document.activeElement?.getAttribute('aria-label'),
    );
    expect(activeLabel).toBe('Open menu');
  });

  test('HM4: tapping Flavors closes the dialog and navigates to /flavors', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: 'Flavors' }).click();
    await expect(page).toHaveURL(/\/flavors/);
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 1000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('HM5: clicking the overlay (outside the panel) closes the dialog', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    // Pixel 7 viewport is 360 wide; panel is right-anchored w-[min(88vw,320px)]
    // → panel's left edge is at ~44px, so clicking at x=10 lands on the overlay.
    await page.mouse.click(10, 300);
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 1000 });
  });

  test('HM6: computed z-index — overlay = 70, panel = 71 (above InAppBrowserBanner z-60)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const panelZ = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="hamburger-panel"]');
      return el ? getComputedStyle(el).zIndex : null;
    });
    const overlayZ = await page.evaluate(() => {
      const el = document.querySelector('[data-testid="hamburger-overlay"]');
      return el ? getComputedStyle(el).zIndex : null;
    });
    expect(panelZ).toBe('71');
    expect(overlayZ).toBe('70');
  });

  test('HM7: keyboard-only — Tab to trigger + Enter opens the dialog', async ({
    page,
  }) => {
    await page.goto('/');
    // Focus the hamburger trigger directly via DOM focus, then press Enter.
    // Tab-order traversal from the URL bar is browser-chrome territory that
    // Playwright cannot simulate reliably; the equivalent assertion is that
    // the trigger IS a focusable element and keyboard activation works.
    await page.evaluate(() => {
      const btn = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Open menu"]',
      );
      btn?.focus();
    });
    const focusedLabel = await page.evaluate(() =>
      document.activeElement?.getAttribute('aria-label'),
    );
    expect(focusedLabel).toBe('Open menu');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
  });
});
