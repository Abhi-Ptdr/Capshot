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

  test('TB5: strip wraps to 2x2 on narrow mobile (360x640) — D3.1-10', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    const items = page.locator('ul[aria-label="Trust indicators"] > li');
    await items.first().scrollIntoViewIfNeeded();
    await expect(items).toHaveCount(4);
    const first = await items.nth(0).boundingBox();
    const third = await items.nth(2).boundingBox();
    expect(first).toBeTruthy();
    expect(third).toBeTruthy();
    // If the strip is on one row, the 3rd item has the same `y` as the
    // 1st. If it wrapped, the 3rd item sits on a new row — its y will be
    // greater than the 1st item's y + half of its height.
    expect(third!.y).toBeGreaterThan(first!.y + first!.height * 0.5);
  });

  test('TB6: TrustBadges motion wrapper carries motion-reduce fallback utility (D3.1-11)', async ({
    page,
  }) => {
    await page.goto('/');
    // Phase 3.1 has UspComparison, CatalogBundles heading band, Bundles
    // tri-card lane, FlavorTeaser, and TrustBadges all carrying the same
    // Tailwind motion-reduce utility. Assert >= 1 to stay future-proof;
    // the stronger per-section selector check is implicit via TB4 and the
    // reduced-motion test (which scopes by hasText to the TrustBadges
    // wrapper).
    const wrappers = page.locator('section.motion-reduce\\:\\!transform-none');
    await expect(wrappers.first()).toBeVisible();
    const count = await wrappers.count();
    expect(count).toBeGreaterThanOrEqual(1);
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
    // Scope the selector to the TrustBadges wrapper specifically by
    // filtering on text content. The TrustBadges section is the only
    // motion-wrapped <section> that renders the literal "FSSAI Licensed".
    const wrapper = page
      .locator('section.motion-reduce\\:\\!transform-none')
      .filter({ hasText: 'FSSAI Licensed' });
    await wrapper.first().scrollIntoViewIfNeeded();
    const opacity = await wrapper
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});
