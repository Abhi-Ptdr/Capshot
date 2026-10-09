import { test, expect, devices } from '@playwright/test';

/**
 * Phase 1 Plan 02 — Hero slice E2E (HERO-01, HERO-02, CONV-03).
 *
 * All assertions run at the 360×640 Pixel 7 baseline so the 100dvh +
 * CTA-visible-above-fold constraint is proven on the real mobile viewport
 * ad traffic lands on.
 */

test.use({ ...devices['Pixel 7'] });

test.describe('Hero (HERO-01, HERO-02, CONV-03) @ 360×640', () => {
  test('H1: locked Hinglish headline "Twist karo. Shake karo. BOOM."', async ({
    page,
  }) => {
    await page.goto('/');
    const h1Text = (await page.locator('main h1').first().textContent()) ?? '';
    expect(h1Text.replace(/\s+/g, ' ').trim()).toBe(
      'Twist karo. Shake karo. BOOM.',
    );
  });

  test('H2: locked sub-copy "Pre-filled flavor caps for any bottle." visible', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(
      page.getByText('Pre-filled flavor caps for any bottle.'),
    ).toBeVisible();
  });

  test('H3: PrimaryCTA visible and ≥56px tall (HERO-02 hit-target locked)', async ({
    page,
  }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /Try CAPSHOT/i }).first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(56);
  });

  test('H4: CTA href matches wa.me/919203975762 (locked CONTEXT D-09)', async ({
    page,
  }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /Try CAPSHOT/i }).first();
    const href = await cta.getAttribute('href');
    expect(href).toMatch(/^https:\/\/wa\.me\/919203975762/);
  });

  test('H5: CTA bottom edge ≤ viewport height (visible above fold at 100dvh)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    const cta = page
      .locator('a[data-cta="cta_primary_whatsapp"]')
      .first();
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();
    expect(box).not.toBeNull();
    // CTA's bottom edge must fit within the 640-high viewport without scroll
    expect(box!.y + box!.height).toBeLessThanOrEqual(640);
  });

  test('H6: main element min-height ≥ 600 px at 640 viewport (100dvh fallback cascade)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    const minHeightPx = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return 0;
      return parseFloat(getComputedStyle(main).minHeight);
    });
    expect(minHeightPx).toBeGreaterThanOrEqual(600);
  });

  test('H7: hero <img> has src = /hero/cap-on-bottle.jpg + width + height (CLS prevention)', async ({
    page,
  }) => {
    await page.goto('/');
    const heroImg = page
      .locator('main img[src="/hero/cap-on-bottle.jpg"]')
      .first();
    await expect(heroImg).toBeVisible();
    const width = await heroImg.getAttribute('width');
    const height = await heroImg.getAttribute('height');
    expect(width).not.toBeNull();
    expect(height).not.toBeNull();
    expect(parseInt(width!, 10)).toBeGreaterThan(0);
    expect(parseInt(height!, 10)).toBeGreaterThan(0);
  });

  test('H8: index.html served contains hero image preload link', async ({
    request,
  }) => {
    const response = await request.get('/');
    const body = await response.text();
    expect(body).toMatch(
      /<link\s+rel="preload"\s+as="image"\s+href="\/hero\/cap-on-bottle\.jpg"[^>]*fetchpriority="high"[^>]*>/,
    );
  });
});
