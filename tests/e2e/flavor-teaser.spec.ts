import { test, expect, devices } from '@playwright/test';

/**
 * Phase 2 Plan 02 Task 2 — Flavor Teaser section E2E (FLAV-03).
 *
 * Horizontal scroll-snap teaser on `/` with 8 curated flavor cards
 * (ordered: 4 Fruity Blast + 2 Desi & Cool + 2 Premium Sports —
 * see D2-09 lock) and a 9th "See all 16 flavors →" tile routing to
 * `/flavors`. Scroll-snap-x-mandatory with CSS; no JS carousel lib.
 *
 * Pattern mirrors how-it-works.spec.ts (per-suite Pixel 7 override).
 */

test.use({ ...devices['Pixel 7'] });

// EXPECTED curated handles — must match the exact TEASER_HANDLES tuple in
// src/sections/FlavorTeaser.tsx. Inlined here (not imported) so a drift
// between the test's expectation and the component's constant surfaces
// loudly as a test failure (per D2-09 "not random" determinism lock).
const EXPECTED_HANDLES = [
  'orange',
  'mango',
  'watermelon',
  'strawberry',
  'jaljeera',
  'ors-electrolyte',
  'japanese-matcha',
  'coffee',
] as const;

test.describe('FlavorTeaser (FLAV-03) @ 360×800', () => {
  test('FT1: teaser region is visible after scrolling into view', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    await expect(region).toBeVisible();
  });

  test('FT2: 8 curated FlavorCards render in exact order inside the region', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    const handles = await region
      .locator('[data-flavor]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('data-flavor')),
      );
    expect(handles).toEqual([...EXPECTED_HANDLES]);
  });

  test('FT3: 9th tile is a "See all 16 flavors" <Link> pointing at /flavors', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    const seeAll = region.getByRole('link', { name: /See all 16 flavors/i });
    await expect(seeAll).toHaveCount(1);
    const href = await seeAll.getAttribute('href');
    expect(href).not.toBeNull();
    expect(href!).toMatch(/\/flavors$/);
  });

  test('FT4: clicking "See all" client-side-navigates to /flavors', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    await region
      .getByRole('link', { name: /See all 16 flavors/i })
      .click();
    await expect(page).toHaveURL(/\/flavors$/);
    // Forward-compatible with Plan 02-03 (which replaces the Phase 1
    // "coming soon" shell with "All 16 flavors."): accept either H1.
    await expect(page.locator('h1')).toHaveText(
      /All 16 flavors(\.| coming soon\.)/,
    );
  });

  test('FT5: scroll-snap-type is "x mandatory" (CSS scroll-snap configured)', async ({
    page,
  }) => {
    await page.goto('/');
    const snapType = await page.evaluate(() => {
      const r = document.querySelector('[aria-label="Flavor teaser"]');
      if (!r) return null;
      return getComputedStyle(r).scrollSnapType;
    });
    expect(snapType).not.toBeNull();
    expect(snapType!).toContain('x');
    expect(snapType!).toContain('mandatory');
  });

  test('FT6: cold reload returns the same 8 handles in the same order (D2-09 determinism)', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    const first = await region
      .locator('[data-flavor]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('data-flavor')),
      );
    await page.reload();
    const regionAfter = page.getByRole('region', { name: 'Flavor teaser' });
    await regionAfter.scrollIntoViewIfNeeded();
    const second = await regionAfter
      .locator('[data-flavor]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('data-flavor')),
      );
    expect(second).toEqual(first);
    expect(second).toEqual([...EXPECTED_HANDLES]);
  });

  // Phase 3 Plan 03 Task 1 — Section-level motion wrapper (D3-11).
  // The <m.section> that wraps the heading + scroller Containers emits
  // the Tailwind motion-reduce utility classes directly on itself so
  // reduced-motion users collapse to final state immediately.
  test('FT-P3-1: FlavorTeaser is wrapped in a motion <section> with motion-reduce fallback (Phase 3)', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('region', { name: 'Flavor teaser' })
      .scrollIntoViewIfNeeded();
    // The <m.section> carries the `motion-reduce:!transform-none` utility
    // class, which Tailwind escapes to `motion-reduce:\!transform-none` in
    // the selector. Use a class-containing selector to find the wrapper.
    const motionWrapperExists = await page
      .locator('section.motion-reduce\\:\\!transform-none')
      .count();
    expect(motionWrapperExists).toBeGreaterThanOrEqual(1);
  });
});

test.describe('FlavorTeaser reduced-motion (Phase 3)', () => {
  // Device override is at the file-level `test.use(...devices['Pixel 7'])`
  // at the top of this file; reducedMotion is a per-test fixture that is
  // safe to combine inside a describe group (unlike `defaultBrowserType`).
  test.use({ reducedMotion: 'reduce' });

  test('FT-P3-2: section renders at final-state opacity 1 when reducedMotion = reduce', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    await expect(region).toBeVisible();
    // The m.section wrapper's computed opacity should be 1 (final state)
    // when reduced-motion is on — Tailwind motion-reduce:!opacity-100
    // overrides the Motion-emitted inline opacity.
    const wrapperOpacity = await page
      .locator('section.motion-reduce\\:\\!transform-none')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(wrapperOpacity).toBe('1');
  });
});
