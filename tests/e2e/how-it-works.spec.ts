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

    // Bodies include the key phrases
    await expect(page.getByText(/28\s*mm bottle/i)).toBeVisible();
    await expect(page.getByText(/5 seconds/i)).toBeVisible();
    await expect(page.getByText(/Flavor-forward drink/i)).toBeVisible();
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
