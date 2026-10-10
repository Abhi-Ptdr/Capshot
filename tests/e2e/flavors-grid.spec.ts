import { test, expect, devices } from '@playwright/test';

/**
 * Phase 2 Plan 03 — `/flavors` grid rendering (FG1–FG5).
 *
 * Proves FLAV-01 behavior: 16 color-washed cards in a 2-column mobile
 * grid, each with its locked accentHex background, each with exactly
 * one `<FlavorCapGraphic>` SVG, and the sanity invariant that no card
 * renders its title text in the same color as its background.
 *
 * All tests scope to Pixel 7 (360×800) — mobile-first per CAPSHOT
 * mandate (95% traffic). Column-count is NOT asserted directly; we
 * assert the 16-count (which is grid-density-independent) and spot-
 * check that specific handles render with the expected accent.
 */

test.use(devices['Pixel 7']);

const HANDLES = [
  // Fruity Blast (9) — order from src/data/flavors.ts
  'orange',
  'mixed-berry',
  'mango',
  'pineapple',
  'watermelon',
  'guava',
  'pomegranate',
  'strawberry',
  'apple',
  // Desi & Cool (3)
  'citrus-mint',
  'jaljeera',
  'ors-electrolyte',
  // Premium Sports (4)
  'japanese-matcha',
  'black-pump',
  'java-pump',
  'coffee',
];

test('FG1 — /flavors renders H1 "All 16 flavors" + 16 cards', async ({
  page,
}) => {
  await page.goto('/flavors');
  await expect(page.locator('h1')).toContainText(/All 16 flavors/i);
  await expect(page.locator('[data-flavor]')).toHaveCount(16);
});

test('FG2 — all 16 canonical handles are present as data-flavor', async ({
  page,
}) => {
  await page.goto('/flavors');
  const rendered = await page
    .locator('[data-flavor]')
    .evaluateAll((els) =>
      els.map((el) => (el as HTMLElement).dataset.flavor ?? ''),
    );
  expect(new Set(rendered)).toEqual(new Set(HANDLES));
  // Spot-check specific handles are in the set
  expect(rendered).toContain('orange');
  expect(rendered).toContain('coffee');
  expect(rendered).toContain('japanese-matcha');
});

test('FG3 — spot-check cards carry locked accentHex background', async ({
  page,
}) => {
  await page.goto('/flavors');

  const expected: Record<string, string> = {
    orange: 'rgb(245, 124, 31)',
    coffee: 'rgb(107, 68, 35)',
    'japanese-matcha': 'rgb(91, 138, 58)',
  };

  for (const [handle, rgb] of Object.entries(expected)) {
    const bg = await page
      .locator(`[data-flavor="${handle}"]`)
      .evaluate((el) => getComputedStyle(el as HTMLElement).backgroundColor);
    expect(bg).toBe(rgb);
  }
});

test('FG4 — each card has exactly one aria-hidden cap SVG', async ({
  page,
}) => {
  await page.goto('/flavors');
  const counts = await page
    .locator('[data-flavor]')
    .evaluateAll((cards) =>
      cards.map(
        (card) =>
          (card as HTMLElement).querySelectorAll('svg[aria-hidden="true"]')
            .length,
      ),
    );
  expect(counts).toHaveLength(16);
  for (const c of counts) {
    expect(c).toBe(1);
  }
});

test('FG5 — card title color !== card background color (visibility sanity)', async ({
  page,
}) => {
  await page.goto('/flavors');
  const results = await page
    .locator('[data-flavor]')
    .evaluateAll((cards) =>
      cards.map((card) => {
        const el = card as HTMLElement;
        const h3 = el.querySelector('h3');
        if (!h3) return { same: true, handle: el.dataset.flavor ?? '?' };
        return {
          same:
            getComputedStyle(h3).color === getComputedStyle(el).backgroundColor,
          handle: el.dataset.flavor ?? '?',
        };
      }),
    );
  for (const { same, handle } of results) {
    expect(same, `title/background color collision on ${handle}`).toBe(false);
  }
});

// Phase 3 Plan 03 Task 2 — Row-by-row m.li stagger (D3-12).
// Each <li> is now a <m.li> that emits an inline style attribute at
// rest (Motion sets style for `will-change`/transform tracking even
// before animation runs). We count direct-child <li>[style] under the
// grid <ul> — matches the pragmatic selector pattern established in
// Plan 03-02's HowItWorks tests.
test('FG-P3-1: each FlavorGrid <li> is wrapped in a motion element (16 of them)', async ({
  page,
}) => {
  await page.goto('/flavors');
  const liWithStyle = await page
    .locator('ul[aria-label="Flavor grid"] > li[style]')
    .count();
  expect(liWithStyle).toBe(16);
});

test.describe('FlavorGrid reduced-motion (Phase 3)', () => {
  test.use({ reducedMotion: 'reduce' });

  test('FG-P3-2: grid renders at final-state opacity 1 when reducedMotion = reduce', async ({
    page,
  }) => {
    await page.goto('/flavors');
    const grid = page.locator('ul[aria-label="Flavor grid"]');
    await expect(grid).toBeVisible();
    // First card <li> should be at final-state opacity 1 under reduced
    // motion — the Tailwind motion-reduce:!opacity-100 utility wins
    // over the Motion-emitted inline opacity.
    const firstCardOpacity = await page
      .locator('ul[aria-label="Flavor grid"] > li')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(firstCardOpacity).toBe('1');
  });
});
