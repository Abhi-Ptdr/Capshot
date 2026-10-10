import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3.1 Plan 02 — USP & Comparison Grid E2E (USP-01).
 * Phase 3.1 Plan 07 — GAP-03 + GAP-04 extensions in-place:
 *   - UC2 updated from 3-row to 5-row exact-order assertion.
 *   - UC3b asserts "Feature" literal in the first thead <th> (GAP-03).
 *   - UC7 asserts the Taste variety row literals (GAP-04).
 *   - UC8 asserts the per-drink price row literals + data-pricing-pending
 *     attribute (GAP-04).
 *   - UC9 asserts the asterisk footnote visibility (GAP-04).
 *   - UC1 / UC3 / UC4 / UC5 / UC6 / UC-RM-1 unchanged in body.
 *
 * Semantic 5-row × 2-col comparison table rendered on `/` between
 * HowItWorks and the Catalog + Bundles stack. Row-prefix
 * `<th scope="row">` carries the dimension name with a lucide-react
 * icon.
 *
 * The left-column header is LOCKED by D3.1-01 to a regulator-safe
 * competitor framing that avoids the Phase 1 CI grep gate
 * (`/energy\s+drink/i` at `scripts/ci-grep-forbidden-strings.mjs:61`).
 * The literal string lives in the UC3 assertion below exactly once.
 *
 * Row copy for the first three rows is LOCKED by D3.1-02a — these
 * tests assert the literal dimension names and the two column
 * headers verbatim. The two new rows added by Plan 07 carry locked
 * copy per the GAP-04-TASTE-COPY + GAP-04-PRICE-COPY decisions.
 *
 * Motion is section-level ONLY (D3.1-11): one `<m.div>` entrance
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

  test('UC2: 5 rows render in exact order (Freshness / Nutrient Value / Portability / Taste variety / Price per drink)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const rowLabels = await page
      .locator('tbody tr th[scope="row"]')
      .allTextContents();
    const trimmed = rowLabels.map((t) => t.trim().replace(/\s+/g, ' '));
    expect(trimmed).toEqual([
      'Freshness',
      'Nutrient Value',
      'Portability',
      'Taste variety',
      'Price per drink',
    ]);
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

  test('UC3b: first-column header reads the dimension-column label (GAP-03)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const firstHeader = await page
      .locator('thead th')
      .nth(0)
      .textContent();
    expect(firstHeader?.trim()).toBe('Feature');
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
    // WR-07: motion wrapper is now <m.div> (was <m.section>), so the
    // selector is tag-agnostic. Scope to the UspComparison section
    // (identified by the comparison table being inside it) to avoid
    // picking up other sections' wrappers.
    const uspSection = page
      .locator('section')
      .filter({ has: page.getByRole('table') });
    const motionWrapper = uspSection.locator(
      '.motion-reduce\\:\\!transform-none',
    );
    await expect(motionWrapper).toHaveCount(1);
  });

  test('UC7: Taste variety row carries locked bottled and CAPSHOT copy (GAP-04)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const row = page
      .locator('tbody tr')
      .filter({
        has: page
          .locator('th[scope="row"]')
          .filter({ hasText: 'Taste variety' }),
      });
    await expect(row).toHaveCount(1);
    await expect(row.locator('td').nth(0)).toContainText(
      '1 flavor per bottle, locked',
    );
    await expect(row.locator('td').nth(1)).toContainText(
      '16 flavors, three ranges',
    );
  });

  test('UC8: Price per drink row carries locked rupee ranges + data-pricing-pending attribute (GAP-04)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    const row = page.locator('tbody tr[data-pricing-pending="true"]');
    await expect(row).toHaveCount(1);
    await expect(row.locator('th[scope="row"]')).toContainText(
      'Price per drink',
    );
    await expect(row.locator('td').nth(0)).toContainText(
      '₹30-₹50 per bottle',
    );
    await expect(row.locator('td').nth(1)).toContainText('₹24-₹30 per cap');
  });

  test('UC9: asterisk footnote references the Phase 6 pricing approval posture (GAP-04)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('table').first().scrollIntoViewIfNeeded();
    // Footnote is a sibling <p> after the <table> inside the USP Container.
    const footnote = page.getByText(
      /CAPSHOT per-cap price range pending client final approval before Phase 6/,
    );
    await expect(footnote).toBeVisible();
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
    // WR-07: tag-agnostic selector; scope by hasText so we pick the
    // UspComparison <m.div> and not another section's wrapper.
    const wrapperOpacity = await page
      .locator('.motion-reduce\\:\\!transform-none')
      .filter({ hasText: 'Why CAPSHOT, not a bottled drink.' })
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(wrapperOpacity).toBe('1');
  });
});
