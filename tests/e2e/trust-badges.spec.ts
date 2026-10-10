import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3.1 Plan 04 Task 2 — Trust Badges section E2E (TRUST-01 + TRUST-02).
 * Phase 3.1 Plan 05 (GAP-01) extension: added TB7 (section heading above
 * the strip) + TB8 (surface tone on the outer <section>) in-place; the
 * original 7 tests (TB1-TB6 + reduced-motion) remain unchanged.
 *
 * Asserts the D3.1-07a locked contract for the final section of the
 * Phase 3.1 homepage composition:
 *   - TB1: all four locked labels are visible on `/`
 *   - TB2: each label renders as a span (NOT anchor) — the visual-only
 *     arm of the Plan 01 discriminated union omits the href wrapper
 *     (D3.1-07/08)
 *   - TB3: no FSSAI dev-warning banner is present on `/` (visual-only
 *     arm skips the Phase 1 pending-evidence dev warning)
 *   - TB4: the ul landmark is present exactly once and visible on `/`
 *   - TB5: the strip wraps to multiple rows on <375 px (D3.1-10 + WR-05) —
 *     at least 2 distinct row-y values; last row sits meaningfully below
 *     the first
 *   - TB6: the TrustBadges motion wrapper carries the Tailwind
 *     motion-reduce fallback utility (D3.1-11)
 *   - TB7 (GAP-01): section heading "Why trust us." renders above the
 *     trust-indicator list on `/`
 *   - TB8 (GAP-01): the outer section carries the surface-token
 *     background class emitted by `<Section background="surface">`
 *   - Reduced-motion describe: the TrustBadges motion wrapper renders
 *     at computed opacity 1 under reducedMotion:'reduce'
 *
 * Pattern mirrors tests/e2e/flavor-teaser.spec.ts + catalog-bundles.spec.ts:
 * per-file Pixel 7 device override, reduced-motion fixture scoped to a
 * nested describe. Phase 1 FSSAI PROD-throw + dev-warning contract is
 * covered by tests/unit/trustbadge.spec.tsx (linked arm); this spec
 * covers only the visual-only arm's DOM contract on the homepage.
 *
 * Note on grep-safe prose: literal runtime values are paraphrased in this
 * docstring (e.g., "anchor"/"span"/"dev-warning banner data attribute")
 * so the TB3 single-occurrence source literal gate stays strict.
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

  test('TB5: strip renders as strict 2x2 grid on narrow mobile (360x640)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    const items = page.locator('ul[aria-label="Trust indicators"] > li');
    await items.first().scrollIntoViewIfNeeded();
    await expect(items).toHaveCount(4);
    // Per user direction 2026-10-11: supersedes WR-05 multi-row-wrap
    // contract. The strip is now a CSS grid with `grid-cols-2` on
    // mobile, so items 0+1 share row 1 and items 2+3 share row 2.
    const positions = await Promise.all(
      [0, 1, 2, 3].map((i) => items.nth(i).boundingBox()),
    );
    for (const pos of positions) expect(pos).toBeTruthy();
    const ys = positions.map((p) => p!.y);
    // Row 1: items 0+1 share the same y (within ~1px flex rounding)
    expect(Math.abs(ys[0] - ys[1])).toBeLessThanOrEqual(1);
    // Row 2: items 2+3 share the same y
    expect(Math.abs(ys[2] - ys[3])).toBeLessThanOrEqual(1);
    // Row 2 sits meaningfully below row 1
    expect(ys[2]).toBeGreaterThan(ys[0] + positions[0]!.height * 0.5);
    // Columns: items 0 and 2 share x; items 1 and 3 share x
    const xs = positions.map((p) => p!.x);
    expect(Math.abs(xs[0] - xs[2])).toBeLessThanOrEqual(1);
    expect(Math.abs(xs[1] - xs[3])).toBeLessThanOrEqual(1);
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

  test('TB7: section heading "Why trust us." is visible above the trust-indicator list (GAP-01)', async ({
    page,
  }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: 'Why trust us.' });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    // Positional ordering: heading sits ABOVE the ul landmark so the strip
    // reads as a named section, not orphaned chrome.
    const list = page.locator('ul[aria-label="Trust indicators"]');
    const [headingBox, listBox] = await Promise.all([
      heading.boundingBox(),
      list.boundingBox(),
    ]);
    expect(headingBox).toBeTruthy();
    expect(listBox).toBeTruthy();
    expect(headingBox!.y).toBeLessThan(listBox!.y);
  });

  test('TB8: TrustBadges Section carries background="surface" token class (GAP-01)', async ({
    page,
  }) => {
    await page.goto('/');
    // Scope to the TrustBadges <section> via its unique trust-indicator
    // descendant (same pattern TB6 uses). Section primitive emits the
    // literal class `bg-[color:var(--color-surface)]` when the
    // background prop is "surface" (see src/components/primitives/Section.tsx).
    const trustSection = page
      .locator('section')
      .filter({ has: page.locator('ul[aria-label="Trust indicators"]') });
    await expect(trustSection).toHaveClass(
      /bg-\[color:var\(--color-surface\)\]/,
    );
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
