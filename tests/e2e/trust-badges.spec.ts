import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3.1 Plan 04 Task 2 — Trust Badges section E2E (TRUST-01 + TRUST-02).
 *
 * Asserts the D3.1-07a locked contract for the final section of the
 * Phase 3.1 homepage composition:
 *   - TB1: all four locked labels are visible on `/`
 *   - TB2: each label renders as a <span> (NOT <a>) — the visual-only
 *     arm of the Plan 01 discriminated union omits the href wrapper
 *     (D3.1-07/08)
 *   - TB3: no FSSAI dev-warning banner is present on `/` (visual-only
 *     arm skips the Phase 1 pending-evidence dev warning)
 *   - TB4: the <ul aria-label="Trust indicators"> is present exactly
 *     once and visible on `/`
 *   - TB5: the strip wraps to 2x2 on <375 px (D3.1-10) — the 3rd <li>
 *     sits on a different row than the 1st <li>
 *   - TB6: the TrustBadges motion wrapper carries the Tailwind
 *     motion-reduce fallback utility (D3.1-11)
 *   - Reduced-motion describe: the TrustBadges motion wrapper renders
 *     at computed opacity 1 under reducedMotion:'reduce'
 *
 * Pattern mirrors tests/e2e/flavor-teaser.spec.ts + catalog-bundles.spec.ts:
 * per-file Pixel 7 device override, reduced-motion fixture scoped to a
 * nested describe. Phase 1 FSSAI PROD-throw + dev-warning contract is
 * covered by tests/unit/trustbadge.spec.tsx (linked arm); this spec
 * covers only the visual-only arm's DOM contract on the homepage.
 */

test.use({ ...devices['Pixel 7'] });

const LOCKED_LABELS = [
  'FSSAI Licensed',
  'Plant-based ingredients',
  'Made in India',
  'Secure Checkout',
] as const;

test.describe('TrustBadges (TRUST-01, TRUST-02) @ 360×800', () => {
  test('TB1: all four locked trust labels are visible on /', async ({
    page,
  }) => {
    await page.goto('/');
    const ul = page.locator('ul[aria-label="Trust indicators"]');
    await ul.scrollIntoViewIfNeeded();
    for (const label of LOCKED_LABELS) {
      // .first() tolerates the possibility that a label string appears
      // elsewhere on the page (e.g., in another section's copy); the
      // important invariant is at-least-one occurrence per label inside
      // the DOM.
      await expect(page.getByText(label).first()).toBeVisible();
    }
  });

  test('TB2: each label renders as a <span> (no <a> wrapper) — visual-only arm', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .locator('ul[aria-label="Trust indicators"]')
      .scrollIntoViewIfNeeded();
    // The visual-only arm renders a <span> (NOT <a>). If any future
    // change migrates a badge to the linked arm, that specific label
    // would then be inside an <a>, breaking this gate loudly.
    for (const label of LOCKED_LABELS) {
      const anchorCount = await page
        .locator(`a:has-text("${label}")`)
        .count();
      expect(anchorCount).toBe(0);
    }
  });

  test('TB3: no FSSAI dev-warning banner is present on /', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('[data-pending-fssai]')).toHaveCount(0);
  });

  test('TB4: <ul aria-label="Trust indicators"> is present exactly once and visible', async ({
    page,
  }) => {
    await page.goto('/');
    const ul = page.locator('ul[aria-label="Trust indicators"]');
    await ul.scrollIntoViewIfNeeded();
    await expect(ul).toHaveCount(1);
    await expect(ul).toBeVisible();
  });

  test('TB5: strip wraps to STRICT 2x2 on narrow mobile (360x640) — D3.1-10', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    const items = page.locator('ul[aria-label="Trust indicators"] > li');
    await items.first().scrollIntoViewIfNeeded();
    await expect(items).toHaveCount(4);
    // WR-05: assert the EXPLICIT 2x2 layout contract — items 0+1 on row 1,
    // items 2+3 on row 2, row 2 strictly below row 1. The previous assertion
    // only checked "3rd item below 1st" which trivially passes for degenerate
    // 1+3 or 1+1+1+1 layouts.
    const positions = await Promise.all(
      [0, 1, 2, 3].map((i) => items.nth(i).boundingBox()),
    );
    for (const pos of positions) expect(pos).toBeTruthy();
    expect(positions[0]!.y).toBe(positions[1]!.y); // row 1 shared y
    expect(positions[2]!.y).toBe(positions[3]!.y); // row 2 shared y
    expect(positions[2]!.y).toBeGreaterThan(positions[0]!.y); // row 2 below row 1
  });

  test('TB6: TrustBadges motion wrapper carries motion-reduce fallback utility (D3.1-11)', async ({
    page,
  }) => {
    await page.goto('/');
    // WR-06 + WR-07: scope the selector to the TrustBadges section's
    // descendants and assert exactly 1 motion wrapper (the <m.div> that
    // wraps the trust-strip <ul>). Scoping prevents the earlier assertion
    // from being trivially satisfied by UspComparison / FlavorTeaser /
    // CatalogBundles wrappers.
    const trustSection = page
      .locator('section')
      .filter({ has: page.locator('ul[aria-label="Trust indicators"]') });
    const motionWrapper = trustSection.locator(
      '.motion-reduce\\:\\!transform-none',
    );
    await expect(motionWrapper).toHaveCount(1);
    await expect(motionWrapper).toBeVisible();
  });
});

test.describe('TrustBadges reduced-motion (Phase 3.1)', () => {
  // reducedMotion is a per-test fixture — safe to combine with the
  // file-level test.use({ ...devices['Pixel 7'] }) inside a nested describe
  // (matches the Phase 3 flavor-teaser.spec.ts + catalog-bundles.spec.ts
  // conventions).
  test.use({ reducedMotion: 'reduce' });

  test('TB-RM-1: TrustBadges wrapper renders at final-state opacity 1', async ({
    page,
  }) => {
    await page.goto('/');
    // WR-07: the motion wrapper is now <m.div>, scoped to the TrustBadges
    // section (the only one containing "FSSAI Licensed"). Tag-agnostic
    // selector + hasText filter picks it out unambiguously.
    const wrapper = page
      .locator('.motion-reduce\\:\\!transform-none')
      .filter({ hasText: 'FSSAI Licensed' });
    await wrapper.first().scrollIntoViewIfNeeded();
    const opacity = await wrapper
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});
