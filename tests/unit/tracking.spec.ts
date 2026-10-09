import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { generateEventId, trackLead } from '@/lib/tracking';

/**
 * Phase 1 Plan 03 — tracking unit spec (CONV-01).
 *
 * Six behaviors covering the fire-and-forget Pixel + CAPI dedup contract:
 *   1. generateEventId returns a UUID v4 shape
 *   2. generateEventId returns a different ID per call
 *   3. trackLead calls fbq('track','Lead',{event_id}) AND
 *      fetch('/api/track-lead', ...) with the SAME event_id in the body
 *   4. trackLead returns synchronously (does NOT await fetch — fire-and-forget)
 *   5. If window.fbq is undefined, trackLead STILL fires the fetch
 *   6. If fetch throws (sync), trackLead swallows the error (CTA must not fail
 *      if CAPI is down)
 */

type FbqArgs = unknown[];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('generateEventId', () => {
  it('returns a UUID v4-shaped string', () => {
    const id = generateEventId();
    expect(id).toMatch(UUID_V4_RE);
  });

  it('returns a different ID per call', () => {
    const a = generateEventId();
    const b = generateEventId();
    expect(a).not.toBe(b);
  });
});

describe('trackLead', () => {
  let fbqCalls: FbqArgs[];
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fbqCalls = [];
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq = (
      ...args: unknown[]
    ) => {
      fbqCalls.push(args);
    };
    fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    delete (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    vi.unstubAllGlobals();
  });

  it('calls fbq("track","Lead",{event_id}) and fetch("/api/track-lead",...) with the SAME event_id', async () => {
    trackLead({ event_source_url: 'https://capshot.co/' });
    // Immediately after the call, the fbq spy must have recorded a Lead
    // event; fetch mock must have been called once.
    expect(fbqCalls.length).toBe(1);
    expect(fbqCalls[0][0]).toBe('track');
    expect(fbqCalls[0][1]).toBe('Lead');
    const fbqPayload = fbqCalls[0][2] as { event_id?: string };
    expect(fbqPayload.event_id).toMatch(UUID_V4_RE);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [fetchUrl, fetchInit] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(fetchUrl).toBe('/api/track-lead');
    expect(fetchInit.method).toBe('POST');
    const body = JSON.parse(String(fetchInit.body ?? '{}')) as {
      event_id: string;
      event_source_url: string;
      event_name?: string;
    };
    expect(body.event_id).toBe(fbqPayload.event_id);
    expect(body.event_source_url).toBe('https://capshot.co/');
    expect(body.event_name).toBe('Lead');
  });

  it('returns synchronously (does NOT await fetch) — fire-and-forget', () => {
    // Slow fetch resolution should NOT delay trackLead's return.
    fetchMock.mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(new Response('{}')), 500),
        ),
    );
    const before = Date.now();
    const ret = trackLead({ event_source_url: 'https://capshot.co/' });
    const elapsed = Date.now() - before;
    expect(elapsed).toBeLessThan(50);
    // Returning void is also acceptable — the point is "no await".
    expect(ret === undefined || typeof (ret as Promise<void>).then === 'function').toBe(true);
  });

  it('still fires the fetch when window.fbq is undefined (ad-blocker degradation)', () => {
    delete (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
    trackLead({ event_source_url: 'https://capshot.co/' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fbqCalls.length).toBe(0);
  });

  it('does NOT throw when fetch throws synchronously', () => {
    fetchMock.mockImplementationOnce(() => {
      throw new Error('fetch sync throw');
    });
    expect(() =>
      trackLead({ event_source_url: 'https://capshot.co/' }),
    ).not.toThrow();
  });

  it('does NOT throw when fbq throws (ad-blocker shadow)', () => {
    (window as Window & { fbq?: (...args: unknown[]) => void }).fbq = () => {
      throw new Error('fbq shadow throw');
    };
    expect(() =>
      trackLead({ event_source_url: 'https://capshot.co/' }),
    ).not.toThrow();
    // CAPI fetch still fires despite fbq throwing.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
