import { test, expect, devices } from '@playwright/test';

/**
 * Phase 2 Plan 02 — How It Works section E2E (HOW-01).
 *
 * Looping muted MP4 demo + heading + 3-step numbered list (01/02/03
 * TWIST/SHAKE/BOOM) side-by-side on desktop, stacked on mobile. Entrance
 * is Motion whileInView fade+slide; reduced-motion suppresses it.
 *
 * All assertions at the 360×800 Pixel 7 baseline.
 */

test.use({ ...devices['Pixel 7'] });

test.describe('HowItWorks (HOW-01) @ 360×800', () => {
  test('HW1: heading "How CAPSHOT works" + three step labels visible', async ({
    page,
  }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', {
      level: 2,
      name: /^How CAPSHOT works$/,
    });
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();

    const twist = page.getByRole('heading', { level: 3, name: /^Twist$/i });
    const shake = page.getByRole('heading', { level: 3, name: /^Shake$/i });
    const boom = page.getByRole('heading', { level: 3, name: /^Boom$/i });
    await expect(twist).toBeVisible();
    await expect(shake).toBeVisible();
    await expect(boom).toBeVisible();

    const stepHeadings = page.locator('h3', {
      hasText: /^(Twist|Shake|Boom)$/i,
    });
    await expect(stepHeadings).toHaveCount(3);
  });

  test('HW2: demo video element present with required autoplay attributes', async ({
    page,
  }) => {
    await page.goto('/');
    const video = page.locator('video').first();
    await video.scrollIntoViewIfNeeded();
    await expect(video).toBeAttached();

    // Autoplay-as-GIF contract: muted + loop + playsinline + autoplay
    expect(await video.getAttribute('src')).toBe(
      '/how-it-works/capshot-demo.mp4',
    );
    expect(await video.getAttribute('poster')).toBe(
      '/how-it-works/capshot-demo-poster.jpg',
    );
    // Boolean attributes in HTML — presence counts, value may be '' or 'true'
    const attrs = await video.evaluate((v) => ({
      muted: (v as HTMLVideoElement).muted,
      loop: (v as HTMLVideoElement).loop,
      autoplay: (v as HTMLVideoElement).autoplay,
      playsInline: (v as HTMLVideoElement).playsInline,
    }));
    expect(attrs.muted).toBe(true);
    expect(attrs.loop).toBe(true);
    expect(attrs.autoplay).toBe(true);
    expect(attrs.playsInline).toBe(true);
  });

  test('HW3: video has aria-label describing the content (not just empty alt)', async ({
    page,
  }) => {
    await page.goto('/');
    const video = page.locator('video').first();
    const label = await video.getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label!.length).toBeGreaterThan(10);
  });

  test('HW4: 3 step numbers (01/02/03) and bodies render in order', async ({
    page,
  }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { level: 2, name: /How CAPSHOT works/i });
    await heading.scrollIntoViewIfNeeded();

    // Numbered markers in order
    const nums = await page.locator('ol li span[aria-hidden="true"]').allTextContents();
    const stepNums = nums.filter((n) => /^0\d$/.test(n.trim()));
    expect(stepNums).toEqual(['01', '02', '03']);

    // Bodies include the key phrases. Scope to the HowItWorks <ol> so the
    // "28 mm bottle" assertion doesn't collide with the site-wide Footer
    // tagline added 2026-10-11 ("Twist. Shake. BOOM. Pre-filled flavor
    // caps that twist onto any standard 28 mm bottle.") which also matches
    // the pattern.
    const steps = page.locator('ol');
    await expect(steps.getByText(/28\s*mm bottle/i)).toBeVisible();
    await expect(steps.getByText(/5 seconds/i)).toBeVisible();
    await expect(steps.getByText(/Flavor-forward drink/i)).toBeVisible();
  });
});

test.describe('HowItWorks reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('HW5: entrance animation suppressed — opacity:1 + no translate at mount', async ({
    page,
  }) => {
    await page.goto('/');
    // Do NOT scroll — reduced-motion must render the final state immediately.
    const heading = page.getByRole('heading', { level: 2, name: /How CAPSHOT works/i });
    await expect(heading).toBeVisible();

    const computed = await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll('h2')).find((el) =>
        /How CAPSHOT works/i.test(el.textContent ?? ''),
      );
      if (!h) return null;
      // h2 is a child of the m.div copy wrapper
      const wrap = h.closest('[style], div');
      if (!wrap) return null;
      const style = getComputedStyle(wrap);
      return { opacity: style.opacity, transform: style.transform };
    });
    expect(computed).not.toBeNull();
    expect(computed!.opacity).toBe('1');
    expect(
      computed!.transform === 'none' ||
        computed!.transform === 'matrix(1, 0, 0, 1, 0, 0)',
    ).toBe(true);
  });
});

/**
 * Phase 3 Plan 02 — Per-step `<m.li>` stagger (D3-06..D3-10).
 *
 * The Phase 2 single right-column `m.div whileInView` is replaced with
 * per-`<li>` `m.li whileInView` entrances. The right-column wrapper is
 * demoted to a plain `<div>`; the LEFT-column video card `m.div`
 * wrapper is UNCHANGED (D3-09).
 *
 * The following four tests extend the Phase 2 how-it-works spec:
 *   - HW-P3-1: each of the 3 steps renders as an animated element with
 *     a Motion-emitted inline `style` attribute (one motion wrapper
 *     per step, not a block wrapper around the whole <ol>).
 *   - HW-P3-2: the DOM order of the three step headings is 01-02-03
 *     (Twist above Shake above Boom) after the staggered entrances
 *     complete.
 *   - HW-P3-3 (reduced-motion sub-describe): per-step `m.li` falls
 *     back to final state immediately — opacity 1, transform identity,
 *     via Tailwind `motion-reduce:!transform-none motion-reduce:!opacity-100`.
 *   - HW-P3-4: the LEFT-column video card wrapper remains a Motion
 *     element (`<div style>` wrapping the <video>) AND the right-column
 *     parent of the <ol> is NO LONGER a Motion element (demotion check).
 */
test.describe('HowItWorks per-step stagger (Phase 3) @ 360×800', () => {
  test('HW-P3-1: each of the 3 steps is its own motion-managed <li> (not a single block wrapper)', async ({
    page,
  }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', {
      level: 2,
      name: /^How CAPSHOT works$/,
    });
    await heading.scrollIntoViewIfNeeded();

    // Each m.li emits an inline `style` attribute at rest (Motion sets
    // transform/opacity properties, even when it collapses to identity).
    // There is exactly ONE <ol> on the home page (the HowItWorks steps),
    // and it contains exactly 3 <li> children — each should carry an
    // inline style.
    const liWithStyle = await page.locator('ol > li[style]').count();
    expect(liWithStyle).toBe(3);
  });

  test('HW-P3-2: steps enter viewport in order (01 Twist → 02 Shake → 03 Boom)', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('heading', { level: 2, name: /^How CAPSHOT works$/ })
      .scrollIntoViewIfNeeded();

    // Wait for the staggered entrances (last delay = 240ms + 500ms
    // duration = 740ms total). Add buffer for IntersectionObserver.
    await page.waitForTimeout(1200);

    const twist = page.getByRole('heading', { level: 3, name: /^Twist$/i });
    const shake = page.getByRole('heading', { level: 3, name: /^Shake$/i });
    const boom = page.getByRole('heading', { level: 3, name: /^Boom$/i });
    await expect(twist).toBeVisible();
    await expect(shake).toBeVisible();
    await expect(boom).toBeVisible();

    const twistBox = await twist.boundingBox();
    const shakeBox = await shake.boundingBox();
    const boomBox = await boom.boundingBox();
    expect(twistBox).not.toBeNull();
    expect(shakeBox).not.toBeNull();
    expect(boomBox).not.toBeNull();
    expect(twistBox!.y).toBeLessThan(shakeBox!.y);
    expect(shakeBox!.y).toBeLessThan(boomBox!.y);
  });

  test('HW-P3-4: video card wrapper preserved as Motion element; right-column parent-of-<ol> demoted to plain div', async ({
    page,
  }) => {
    await page.goto('/');

    // The LEFT-column video card wrapper is a m.div: it emits an
    // inline style attribute even at rest, and it directly contains
    // (eventually) the <video> element. We find it by scoping to
    // elements that both carry [style] AND have a <video> descendant.
    const videoWrapperCount = await page
      .locator('div[style]')
      .filter({ has: page.locator('video') })
      .count();
    expect(videoWrapperCount).toBeGreaterThanOrEqual(1);

    // After Phase 3, the right-column parent of the <ol> is a PLAIN
    // <div> (no m.div, no inline style). We assert no <div> that is
    // itself a direct parent of an <ol> has an inline style. Scoped
    // via :has() to the exact DOM shape.
    const olParentWithStyle = await page
      .locator('div[style]:has(> ol)')
      .count();
    expect(olParentWithStyle).toBe(0);
  });
});

test.describe('HowItWorks per-step stagger — reduced motion @ 360×800', () => {
  test.use({ reducedMotion: 'reduce' });

  test('HW-P3-3: each step <li> is at final state immediately under prefers-reduced-motion', async ({
    page,
  }) => {
    await page.goto('/');
    await page
      .getByRole('heading', { level: 2, name: /^How CAPSHOT works$/ })
      .scrollIntoViewIfNeeded();
    // No wait — reduced motion must collapse entrances to final state.

    const twist = page.getByRole('heading', { level: 3, name: /^Twist$/i });
    await expect(twist).toBeVisible();

    const computed = await page.evaluate(() => {
      const results: Array<{
        label: string;
        opacity: string;
        transform: string;
      }> = [];
      const labels = ['Twist', 'Shake', 'Boom'];
      for (const label of labels) {
        const h3 = Array.from(document.querySelectorAll('h3')).find(
          (el) => new RegExp(`^${label}$`, 'i').test(el.textContent ?? ''),
        );
        if (!h3) continue;
        const li = h3.closest('li');
        if (!li) continue;
        const style = getComputedStyle(li);
        results.push({
          label,
          opacity: style.opacity,
          transform: style.transform,
        });
      }
      return results;
    });

    expect(computed.length).toBe(3);
    for (const row of computed) {
      // Tailwind motion-reduce:!opacity-100 locks opacity to 1
      expect(row.opacity).toBe('1');
      // Tailwind motion-reduce:!transform-none locks transform to none
      // (some browsers normalize to the identity matrix)
      expect(
        row.transform === 'none' ||
          row.transform === 'matrix(1, 0, 0, 1, 0, 0)',
      ).toBe(true);
    }
  });
});
