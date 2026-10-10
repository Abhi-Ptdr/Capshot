import { test, expect, devices } from '@playwright/test';

/**
 * Phase 3.1 Plan 03 Task 3 — CatalogBundles section E2E (CATALOG-01).
 * Phase 3.1 Plan 06 — extended in-place with CB7/CB8/CB9 for GAP-02 closure.
 *
 * Asserts the Section 4 combined contract: shared H2 heading band
 * (CB1), the relocated FlavorTeaser reachable from `/` after the D3.1-05a
 * byte-identical parent-swap (CB2), the 3 bundle cards each identified by
 * `data-bundle="trial|fitness|bulk"` (CB3), each card's CTA href carrying
 * the Pitfall-4 regression guard `&tier={tier}` plus the Phase 1 `Hi%21`
 * wa.me encoding (CB4), the Fitness-only prominence badge (CB5), and the
 * section-level motion wrapper + reduced-motion fallback
 * (CB6 plus the nested reduced-motion fixture test per D3.1-11).
 *
 * GAP-02 additions (Plan 06):
 *   - CB7 locks the step-1 marker ("01" + the step-1 label text) and its
 *     DOM order above the FlavorTeaser region.
 *   - CB8 locks the step-2 marker ("02" + the step-2 label text) and its
 *     DOM order above the first bundle card.
 *   - CB9 regression-guards against reintroducing an internal "Pick your
 *     pack" <h3> inside the catalog section (Bundles' intro band was
 *     removed in Plan 06 Task 2).
 *
 * Defense-in-depth: `tests/e2e/flavor-teaser.spec.ts` continues to pass
 * unchanged (FT1-FT6 + FT-P3-1/FT-P3-2) — proving the relocation is
 * byte-identical and the step markers do not disturb FlavorTeaser.
 *
 * Pricing-literal invariants (₹120/₹349/₹600) are NOT asserted here; they
 * live in Plan 01's `tests/unit/bundles.spec.ts`. This spec focuses on
 * DOM presence + CTA attribution + motion contract + step-marker scaffolding.
 *
 * Pattern mirrors flavor-teaser.spec.ts: per-file Pixel 7 device override,
 * reduced-motion fixture scoped to a nested describe.
 */

test.use({ ...devices['Pixel 7'] });

test.describe('CatalogBundles (CATALOG-01) @ 360×800', () => {
  test('CB1: shared H2 catalog heading is visible on /', async ({ page }) => {
    await page.goto('/');
    const h2 = page.locator('#catalog-heading');
    await h2.scrollIntoViewIfNeeded();
    await expect(h2).toBeVisible();
  });

  test('CB2: relocated FlavorTeaser region is still reachable from / (D3.1-05a)', async ({
    page,
  }) => {
    await page.goto('/');
    const region = page.getByRole('region', { name: 'Flavor teaser' });
    await region.scrollIntoViewIfNeeded();
    await expect(region).toBeVisible();
  });

  test('CB3: 3 bundle cards render with distinct data-bundle tier attributes', async ({
    page,
  }) => {
    await page.goto('/');
    const cards = page.locator('[data-bundle]');
    await cards.first().scrollIntoViewIfNeeded();
    await expect(cards).toHaveCount(3);
    await expect(page.locator('[data-bundle="trial"]')).toHaveCount(1);
    await expect(page.locator('[data-bundle="fitness"]')).toHaveCount(1);
    await expect(page.locator('[data-bundle="bulk"]')).toHaveCount(1);
  });

  test('CB4: each bundle CTA href encodes tier in the text body + Hi%21 (WR-01 regression)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.locator('[data-bundle="trial"]').scrollIntoViewIfNeeded();

    // WR-01: tier attribution is now encoded INSIDE the `text` body so the
    // WhatsApp Business inbox actually receives it (wa.me strips every
    // non-`text` query param client-side). Each per-tier literal
    // `Interested%20in%3A%20{tier}` appears in-source so grep gates still
    // see every tier string.
    const trialHref = await page
      .locator('[data-bundle="trial"] a')
      .getAttribute('href');
    expect(trialHref).not.toBeNull();
    expect(trialHref!).toContain('Interested%20in%3A%20trial');
    expect(trialHref!).toContain('Hi%21');
    expect(trialHref!).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);

    const fitnessHref = await page
      .locator('[data-bundle="fitness"] a')
      .getAttribute('href');
    expect(fitnessHref).not.toBeNull();
    expect(fitnessHref!).toContain('Interested%20in%3A%20fitness');
    expect(fitnessHref!).toContain('Hi%21');
    expect(fitnessHref!).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);

    const bulkHref = await page
      .locator('[data-bundle="bulk"] a')
      .getAttribute('href');
    expect(bulkHref).not.toBeNull();
    expect(bulkHref!).toContain('Interested%20in%3A%20bulk');
    expect(bulkHref!).toContain('Hi%21');
    expect(bulkHref!).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);
  });

  test('CB5: Fitness card displays the locked D3.1-03 prominence badge', async ({
    page,
  }) => {
    await page.goto('/');
    const fitness = page.locator('[data-bundle="fitness"]');
    await fitness.scrollIntoViewIfNeeded();
    // Literal is intentionally present ONCE in this file (acceptance grep = 1).
    await expect(fitness).toContainText('Best Value / Most Popular');
  });

  test('CB6: motion wrappers inside the catalog section exact count = 3 (WR-06)', async ({
    page,
  }) => {
    await page.goto('/');
    // WR-06: scope the selector to descendants of the outer
    // <section aria-labelledby="catalog-heading"> and assert EXACT count
    // rather than `>= 2`. Three motion wrappers live there:
    //   1. CatalogBundles' heading-band <m.div>
    //   2. FlavorTeaser's existing <m.section> (Phase 2, D3.1-05a locked)
    //   3. Bundles' tri-card <m.div>
    // WR-07 converted the Phase 3.1 inner <m.section>s to <m.div>s so the
    // selector is tag-agnostic (just the Tailwind motion-reduce class).
    // GAP-02 (Plan 06) scaffolds Step 1 + Step 2 markers as plain <div>s
    // (NOT wrapped in <m.div>) so this count stays at 3 — the step markers
    // intentionally don't add new motion wrappers (D3.1-11 section-level
    // entrance only).
    const motionWrappers = page.locator(
      'section[aria-labelledby="catalog-heading"] .motion-reduce\\:\\!transform-none',
    );
    await expect(motionWrappers).toHaveCount(3);
  });

  test('CB7: Step 1 marker ("01 / Step 1 — Pick your flavor") renders above FlavorTeaser region (GAP-02)', async ({
    page,
  }) => {
    await page.goto('/');
    const catalog = page.locator('section[aria-labelledby="catalog-heading"]');
    const step1 = catalog.locator('[data-step="1"]');
    await step1.scrollIntoViewIfNeeded();

    // Exactly one step-1 marker lives inside the catalog section.
    await expect(step1).toHaveCount(1);
    await expect(step1).toBeVisible();

    // The marker surfaces both the numeric badge (decorative, aria-hidden)
    // and the semantic step label text that screen readers read.
    const stepText = await step1.textContent();
    expect(stepText).toContain('01');
    expect(stepText).toContain('Step 1 — Pick your flavor');

    // Positional ordering: the step marker MUST sit above the FlavorTeaser
    // region so the two-step narrative reads top-to-bottom.
    const flavorRegion = page.getByRole('region', { name: 'Flavor teaser' });
    await flavorRegion.scrollIntoViewIfNeeded();
    const stepBox = await step1.boundingBox();
    const regionBox = await flavorRegion.boundingBox();
    expect(stepBox).not.toBeNull();
    expect(regionBox).not.toBeNull();
    expect(stepBox!.y).toBeLessThan(regionBox!.y);
  });

  test('CB8: Step 2 marker ("02 / Step 2 — Pick your pack") renders above Bundles tri-card lane (GAP-02)', async ({
    page,
  }) => {
    await page.goto('/');
    const catalog = page.locator('section[aria-labelledby="catalog-heading"]');
    const step2 = catalog.locator('[data-step="2"]');
    await step2.scrollIntoViewIfNeeded();

    await expect(step2).toHaveCount(1);
    await expect(step2).toBeVisible();

    const stepText = await step2.textContent();
    expect(stepText).toContain('02');
    expect(stepText).toContain('Step 2 — Pick your pack');

    // Positional ordering: the step-2 marker MUST sit above the first
    // bundle card (Trial). This locks the "parent owns the step-2
    // scaffolding" invariant from Plan 06 Task 2 — if a future refactor
    // moves the step marker below the bundles grid, this fails loud.
    const trial = page.locator('[data-bundle="trial"]');
    await trial.scrollIntoViewIfNeeded();
    const stepBox = await step2.boundingBox();
    const trialBox = await trial.boundingBox();
    expect(stepBox).not.toBeNull();
    expect(trialBox).not.toBeNull();
    expect(stepBox!.y).toBeLessThan(trialBox!.y);
  });

  test('CB9: Bundles tri-card lane no longer carries an internal "Pick your pack" sub-heading (GAP-02)', async ({
    page,
  }) => {
    await page.goto('/');
    // Scope to the catalog section's <h3>s only — FlavorTeaser's own
    // "Pick your flavor." uses <h2> and is intentionally preserved per
    // D3.1-05a byte-identical lock. The regression this guards against is
    // specifically Bundles.tsx reintroducing its internal <h3> (removed
    // in Plan 06 Task 2 so the parent step-2 marker is sole scaffolding).
    const h3s = await page
      .locator('section[aria-labelledby="catalog-heading"] h3')
      .allTextContents();
    expect(h3s.filter((t) => t.includes('Pick your pack'))).toEqual([]);
  });
});

test.describe('CatalogBundles reduced-motion (Phase 3.1)', () => {
  // Device override is at the file-level `test.use(...devices['Pixel 7'])`;
  // reducedMotion is a per-test fixture that is safe to combine inside a
  // nested describe (matches the Phase 3 flavor-teaser.spec.ts convention).
  test.use({ reducedMotion: 'reduce' });

  test('CB-RM-1: catalog-bundles section wrapper renders at final-state opacity 1', async ({
    page,
  }) => {
    await page.goto('/');
    const h2 = page.locator('#catalog-heading');
    await h2.scrollIntoViewIfNeeded();
    // The CatalogBundles heading band's <m.div> is the first motion wrapper
    // inside the catalog section (WR-07: motion wrappers are now <div>s).
    // Scope to the catalog section's descendants to avoid picking up
    // UspComparison's wrapper that appears earlier on the page.
    const opacity = await page
      .locator(
        'section[aria-labelledby="catalog-heading"] .motion-reduce\\:\\!transform-none',
      )
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});
