import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3.1 Plan 02 — USP & Comparison Grid E2E (USP-01).
 *
 * Semantic 3-row × 2-col comparison table rendered on `/` between
 * HowItWorks and FlavorTeaser. Row-prefix `<th scope="row">` carries
 * the dimension name (Freshness / Nutrient Value / Portability) with
 * a lucide-react icon.
 *
 * The left-column header is LOCKED by D3.1-01 to a regulator-safe
 * competitor framing that avoids the Phase 1 CI grep gate
 * (`/energy\s+drink/i` at `scripts/ci-grep-forbidden-strings.mjs:61`).
 * The literal string lives in the UC3 assertion below exactly once.
 *
 * Row copy is LOCKED by D3.1-02a — these tests assert the literal
 * dimension names and the two column headers verbatim.
 *
 * Motion is section-level ONLY (D3.1-11): one `<m.section>` entrance
 * with Tailwind `motion-reduce:!transform-none motion-reduce:!opacity-100`
 * fallback. The reduced-motion test verifies final-state opacity
 * through a nested describe block that enables the Playwright
 * reduced-motion fixture; the file-level `test.use(...devices)` still
 * applies to both describes.
 *
 * File-level `test.use({ ...devices['Pixel 7'] })` is the Phase 2
 * convention — mirror of `tests/e2e/flavor-teaser.spec.ts:14`.
 */

test.use({ ...devices['Pixel 7'] });

test.describe('UspComparison (USP-01) @ 360×800', () => {
  test('UC1: USP table is visible after scrolling into view', async ({
    page,
  }) => {
    await page.goto('/');
    const table = page.getByRole('table').first();
    await table.scrollIntoViewIfNeeded();
    await expect(table).toBeVisible();
  });

  test('UC2: 3 rows render in exact order (Freshness / Nutrient Value / Portability)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const rowLabels = await page
      .locator('tbody tr th[scope="row"]')
      .allTextContents();
    const trimmed = rowLabels.map((t) => t.trim().replace(/\s+/g, ' '));
    expect(trimmed).toEqual(['Freshness', 'Nutrient Value', 'Portability']);
  });

  test('UC3: left column header reads the D3.1-01 locked competitor label', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const leftHeader = await page
      .locator('thead th')
      .nth(1)
      .textContent();
    expect(leftHeader?.trim()).toBe('Store-bought bottled drinks');
  });

  test('UC4: right column header reads the CAPSHOT brand label', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const rightHeader = await page
      .locator('thead th')
      .nth(2)
      .textContent();
    expect(rightHeader?.trim()).toBe('CAPSHOT (SHI-28)');
  });

  test('UC5: section has no horizontal overflow on 360×640', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(360);
  });

  test('UC6: section wrapper carries motion-reduce fallback class', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    // Tailwind escapes `motion-reduce:!transform-none` to
    // `motion-reduce:\!transform-none` in the generated CSS selector; the
    // JS string needs doubled backslashes before each special char so the
    // final selector is `section.motion-reduce\:\!transform-none`.
    const motionWrapperCount = await page
      .locator('section.motion-reduce\\:\\!transform-none')
      .count();
    expect(motionWrapperCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe('UspComparison reduced-motion (Phase 3.1)', () => {
  // Device override lives at the file-level `test.use(...devices['Pixel 7'])`
  // at the top of this file; `reducedMotion` is a per-test fixture that is
  // safe to combine inside a describe group (unlike `defaultBrowserType`).
  test.use({ reducedMotion: 'reduce' });

  test('UC-RM-1: section renders at final-state opacity 1 when reducedMotion = reduce', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    // Tailwind `motion-reduce:!opacity-100` overrides the Motion-emitted
    // inline opacity, so the computed opacity should be '1' (final state).
    const wrapperOpacity = await page
      .locator('section.motion-reduce\\:\\!transform-none')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(wrapperOpacity).toBe('1');
  });
});
