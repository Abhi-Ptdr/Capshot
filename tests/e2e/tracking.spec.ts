import { test, expect, devices } from '@playwright/test';

/**
 * Phase 1 Plan 03 — tracking E2E (CONV-01).
 *
 * TR1: CAPI fetch body contains event_id (UUID v4) + event_source_url.
 * TR2: Pixel fbq spy captures the SAME event_id as the CAPI fetch body.
 * TR3: Fire-and-forget — anchor nav to wa.me starts BEFORE CAPI resolves
 *      under an artificial delay.
 * TR4: Graceful degradation — if window.fbq is undefined, CAPI still fires.
 */

test.use({ ...devices['Pixel 7'] });

const WA_HREF_RE = /^https:\/\/wa\.me\/919203975762/;
const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

test('TR1: TRY CAPSHOT click POSTs /api/track-lead with event_id (UUID v4) + event_source_url', async ({
  page,
}) => {
  let captured: { url: string; body: unknown } | null = null;
  await page.route('**/api/track-lead', async (route) => {
    const req = route.request();
    const body = req.postData() ? JSON.parse(req.postData()!) : null;
    captured = { url: req.url(), body };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true}',
    });
  });

  await page.goto('/');
  // CTA opens wa.me in a new tab (target=_blank); click dispatch via DOM
  // avoids the context-level popup handling and lets us observe the fetch
  // without actually navigating.
  await page
    .locator('a[data-cta="cta_primary_whatsapp"]')
    .first()
    .evaluate((el: HTMLElement) => el.click());
  await expect
    .poll(() => captured, { timeout: 1500, intervals: [50, 100, 200] })
    .not.toBeNull();
  const body = (captured as unknown as { url: string; body: unknown }).body as {
    event_id?: string;
    event_source_url?: string;
    event_name?: string;
  };
  expect(body.event_id).toMatch(UUID_V4_RE);
  expect(body.event_source_url).toContain('localhost');
  expect(body.event_name).toBe('Lead');
});

test('TR2: fbq spy captures the SAME event_id as the CAPI fetch body (dedup contract)', async ({
  page,
}) => {
  // Install the fbq spy BEFORE any script runs.
  await page.addInitScript(() => {
    const w = window as unknown as {
      __fbqCalls__?: unknown[][];
      fbq?: (...args: unknown[]) => void;
    };
    w.__fbqCalls__ = [];
    w.fbq = (...args: unknown[]) => {
      w.__fbqCalls__!.push(args);
    };
  });

  let capturedBody: { event_id?: string } | null = null;
  await page.route('**/api/track-lead', async (route) => {
    const req = route.request();
    capturedBody = req.postData() ? JSON.parse(req.postData()!) : null;
    await route.fulfill({ status: 200, body: '{"ok":true}' });
  });

  await page.goto('/');
  await page
    .locator('a[data-cta="cta_primary_whatsapp"]')
    .first()
    .evaluate((el: HTMLElement) => el.click());
  await expect
    .poll(() => capturedBody, { timeout: 1500, intervals: [50, 100, 200] })
    .not.toBeNull();

  const fbqEventId = await page.evaluate(() => {
    const calls = (window as unknown as { __fbqCalls__?: unknown[][] })
      .__fbqCalls__;
    if (!calls) return null;
    const leadCall = calls.find((c) => c[0] === 'track' && c[1] === 'Lead');
    if (!leadCall) return null;
    const payload = leadCall[2] as { event_id?: string } | undefined;
    return payload?.event_id ?? null;
  });

  expect(fbqEventId).toMatch(UUID_V4_RE);
  expect((capturedBody as unknown as { event_id: string }).event_id).toBe(
    fbqEventId,
  );
});

test('TR3: fire-and-forget — WhatsApp href present + anchor click NOT blocked by CAPI delay', async ({
  page,
}) => {
  // Delay CAPI by 2000 ms so a blocking implementation would be caught.
  let capiStartedAt: number | null = null;
  let capiResolvedAt: number | null = null;
  await page.route('**/api/track-lead', async (route) => {
    capiStartedAt = Date.now();
    await new Promise((r) => setTimeout(r, 2000));
    capiResolvedAt = Date.now();
    await route.fulfill({ status: 200, body: '{"ok":true}' });
  });

  await page.goto('/');
  const cta = page.locator('a[data-cta="cta_primary_whatsapp"]').first();
  const href = await cta.getAttribute('href');
  expect(href).toMatch(WA_HREF_RE);

  const clickedAt = Date.now();
  await cta.evaluate((el: HTMLElement) => el.click());

  // The CAPI route handler fires almost immediately on click; the delay is
  // inside the handler. We assert that trackLead did not await the fetch:
  // the click handler returned (and the anchor's default navigation
  // dispatch happened) in <200 ms, well before the 2000 ms CAPI resolve.
  await expect
    .poll(() => capiStartedAt, { timeout: 1000, intervals: [50, 100] })
    .not.toBeNull();
  const clickToCapiStart = (capiStartedAt as unknown as number) - clickedAt;
  expect(clickToCapiStart).toBeLessThan(500);
  // Sanity: capi had NOT resolved yet by the time the click returned.
  expect(capiResolvedAt).toBeNull();
});

test('TR4: graceful degradation — fbq undefined → CAPI still fires with valid event_id', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'fbq', {
      configurable: true,
      get: () => undefined,
      set: () => {
        /* ignore any attempt to set fbq */
      },
    });
  });

  let capturedBody: { event_id?: string } | null = null;
  await page.route('**/api/track-lead', async (route) => {
    const req = route.request();
    capturedBody = req.postData() ? JSON.parse(req.postData()!) : null;
    await route.fulfill({ status: 200, body: '{"ok":true}' });
  });

  await page.goto('/');
  await page
    .locator('a[data-cta="cta_primary_whatsapp"]')
    .first()
    .evaluate((el: HTMLElement) => el.click());
  await expect
    .poll(() => capturedBody, { timeout: 1500, intervals: [50, 100, 200] })
    .not.toBeNull();
  expect((capturedBody as unknown as { event_id: string }).event_id).toMatch(
    UUID_V4_RE,
  );
});
