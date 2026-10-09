import { test, expect, devices } from '@playwright/test';

/**
 * Phase 2 Plan 02 — How It Works section E2E (HOW-01).
 *
 * Static 3-step visuals (TWIST / SHAKE / BOOM) with Motion whileInView
 * fade+slide entrance and a reduced-motion fallback that renders the
 * final state immediately. Illustrations use brand palette only.
 *
 * All assertions run at the 360×800 Pixel 7 baseline — the mobile
 * viewport ad traffic lands on. Pattern mirrors hero.spec.ts (no
 * mobile-chrome project; per-suite devices override).
 */

test.use({ ...devices['Pixel 7'] });

test.describe('HowItWorks (HOW-01) @ 360×800', () => {
  test('HW1: three Hinglish beats TWIST / SHAKE / BOOM visible on scroll', async ({
    page,
  }) => {
    await page.goto('/');
    // Scroll the first beat into view; whileInView fires once per element.
    await page.getByText('TWIST', { exact: true }).scrollIntoViewIfNeeded();

    const twist = page.getByRole('heading', { level: 3, name: /^TWIST$/ });
    const shake = page.getByRole('heading', { level: 3, name: /^SHAKE$/ });
    const boom = page.getByRole('heading', { level: 3, name: /^BOOM$/ });

    await expect(twist).toBeVisible();
    await expect(shake).toBeVisible();
    await expect(boom).toBeVisible();

    // Exactly 3 beat labels on the page — no more, no fewer.
    const beatHeadings = page.locator('h3', {
      hasText: /^(TWIST|SHAKE|BOOM)$/,
    });
    await expect(beatHeadings).toHaveCount(3);
  });

  test('HW2: exactly three [data-testid="step-illustration"] SVGs exist', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByText('TWIST', { exact: true }).scrollIntoViewIfNeeded();
    const illustrations = page.locator('[data-testid="step-illustration"]');
    await expect(illustrations).toHaveCount(3);
  });

  test('HW3: each illustration SVG has aria-hidden="true" (decorative)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByText('TWIST', { exact: true }).scrollIntoViewIfNeeded();
    const ariaValues = await page
      .locator('[data-testid="step-illustration"]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('aria-hidden')),
      );
    expect(ariaValues).toHaveLength(3);
    for (const v of ariaValues) {
      expect(v).toBe('true');
    }
  });

  test('HW5: illustration SVG palette uses only brand CSS variables + currentColor + rgba() + none', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByText('TWIST', { exact: true }).scrollIntoViewIfNeeded();
    // Enumerate every fill / stroke on children of the 3 illustrations.
    const paintValues = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('[data-testid="step-illustration"] *'),
      )
        .flatMap((el) => [
          el.getAttribute('fill'),
          el.getAttribute('stroke'),
        ])
        .filter((v): v is string => typeof v === 'string' && v.length > 0),
    );
    // At minimum, each step has multiple paths; the three SVGs together
    // should contribute 10+ paint attributes.
    expect(paintValues.length).toBeGreaterThanOrEqual(10);
    // Palette-only rule: brand CSS variables, currentColor, raw rgba(...),
    // or "none". Any out-of-palette hex literal fails this regex.
    const PALETTE_RE =
      /^(none|currentColor|var\(--color-brand-[a-z]+\)|rgba?\([^)]+\))$/;
    for (const v of paintValues) {
      expect(v).toMatch(PALETTE_RE);
    }
  });
});

test.describe('HowItWorks reduced motion', () => {
  // test.use at the top of the file already applies Pixel 7; here we only
  // overlay the reduced-motion context flag so the browser worker is reused.
  test.use({ reducedMotion: 'reduce' });

  test('HW4: entrance animation suppressed — opacity:1 + no translate at mount', async ({
    page,
  }) => {
    await page.goto('/');
    // Do NOT scroll — we want to assert the final state is already present
    // before whileInView would normally fire. Reduced-motion must skip the
    // entrance animation entirely (motion-reduce:!opacity-100 + Motion's
    // auto-detect + !transform-none belt-and-suspenders).
    const twist = page.getByText('TWIST', { exact: true });
    await expect(twist).toBeVisible();

    // Find the m.div wrapper (ancestor of a step illustration) and read its
    // computed opacity + transform. The reduced-motion contract says: no
    // translate (identity transform OR 'none') and opacity 1.
    const computed = await page.evaluate(() => {
      const illus = document.querySelector('[data-testid="step-illustration"]');
      if (!illus) return null;
      // The m.div wrapper is the direct parent of the SVG per the plan
      // composition (see HowItWorks.tsx — <m.div ...><Illustration/></m.div>).
      const wrap = illus.parentElement;
      if (!wrap) return null;
      const style = getComputedStyle(wrap);
      return {
        opacity: style.opacity,
        transform: style.transform,
      };
    });
    expect(computed).not.toBeNull();
    expect(computed!.opacity).toBe('1');
    // Identity transform may serialize as 'none' OR 'matrix(1, 0, 0, 1, 0, 0)'
    // depending on the engine; both are the no-translate state.
    expect(computed!.transform === 'none' ||
      computed!.transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
  });
});
