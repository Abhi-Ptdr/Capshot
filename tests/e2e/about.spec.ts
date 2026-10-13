import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3.2 Plan 03 — About page e2e harness.
 * ≥6 specs covering ROADMAP SC1-SC5. Pixel 7 default device;
 * reduced-motion nested describe asserts D3.2-09 static fallback.
 */

test.use({ ...devices['Pixel 7'] });

test.describe('About page (ABOUT-01) @ 360×800', () => {
  test('AB-S1: Section 1 idea heading renders on /about', async ({ page }) => {
    await page.goto('/about');
    const heading = page.getByRole('heading', {
      name: 'Same water. Bigger moments.',
    });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
  });

  test('AB-S2: founder caption + portrait + attribution render in Section 2', async ({
    page,
  }) => {
    await page.goto('/about');
    await expect(
      page.getByText('Meet Akhilesh, Founder of CAPSHOT'),
    ).toBeVisible();
    const portrait = page.getByAltText(
      'Akhilesh Pateliya, founder of CAPSHOT',
    );
    await portrait.scrollIntoViewIfNeeded();
    await expect(portrait).toBeVisible();
    const src = await portrait.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src!).toContain('/about/akhilesh-portrait');
    await expect(page.getByText('— Akhilesh, Founder')).toBeVisible();
  });

  test('AB-S3: Section 3 why heading + three step captions render', async ({
    page,
  }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('heading', { name: 'Water is essential. Plain is boring.' }),
    ).toBeVisible();
    await expect(page.getByText('1. TWIST')).toBeVisible();
    await expect(page.getByText('2. SHAKE')).toBeVisible();
    await expect(page.getByText('3. BOOM')).toBeVisible();
  });

  test('AB-S4: Section 4 heading + 5 feature cards render', async ({
    page,
  }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('heading', {
        name: "We don't fit the mold. We reshape it.",
      }),
    ).toBeVisible();
    const section = page.locator('section#how-we-think');
    await expect(section.locator('ul[role="list"] > li')).toHaveCount(5);
  });

  test('AB-S5: Section 5 heading + closing tagline render', async ({ page }) => {
    await page.goto('/about');
    await expect(
      page.getByRole('heading', { name: "Let's shake things up, together." }),
    ).toBeVisible();
    await expect(page.getByText('The journey is just beginning.')).toBeVisible();
  });

  test('AB-S5-CTAS: three closing CTAs route correctly (ROADMAP SC3)', async ({
    page,
  }) => {
    await page.goto('/about');

    const explore = page
      .locator('a[href="/flavors"]')
      .filter({ hasText: /EXPLORE FLAVOURS/i });
    await expect(explore.first()).toBeVisible();

    const waitlist = page
      .locator('a[target="_blank"]')
      .filter({ hasText: /JOIN WAITLIST|BE THE FIRST TO KNOW/i });
    const href = await waitlist.first().getAttribute('href');
    expect(href).not.toBeNull();
    expect(href!).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);
    expect(href!).toContain('Hi%21');
    expect(href!).toContain('Interested%20in%3A%20about-waitlist');

    const contact = page
      .locator('a[href="/contact"]')
      .filter({ hasText: /CONTACT US/i });
    await expect(contact.first()).toBeVisible();
  });

  test('AB-OF: /about has no horizontal overflow at 360×640', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/about');
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(360);
  });

  test('AB-NAV: Nav /about link routes to real page (not Phase 1 shell)', async ({
    page,
  }) => {
    await page.goto('/');
    // sr-only route-stub link (Phase 1 Nav.tsx:162) — dispatch click via DOM
    // element directly to bypass pointer-events while still routing through
    // React Router's onClick handler. Mirrors skeleton.spec.ts:76-78 pattern.
    await page
      .getByTestId('nav-link-about')
      .first()
      .evaluate((el: HTMLElement) => el.click());
    await expect(page).toHaveURL('/about');
    await expect(page.getByText('Our story is on the way.')).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'Same water. Bigger moments.' }),
    ).toBeVisible();
  });
});

test.describe('About reduced-motion (Phase 3.2)', () => {
  test.use({ reducedMotion: 'reduce' });

  test('AB-RM: all About motion wrappers render at final-state opacity 1', async ({
    page,
  }) => {
    await page.goto('/about');
    const wrappers = page.locator('main#main .motion-reduce\\:\\!transform-none');
    const count = await wrappers.count();
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count; i++) {
      await wrappers.nth(i).scrollIntoViewIfNeeded();
      const opacity = await wrappers
        .nth(i)
        .evaluate((el) => getComputedStyle(el).opacity);
      expect(opacity).toBe('1');
    }
  });
});
