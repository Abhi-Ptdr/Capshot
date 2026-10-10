import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/lib/useReducedMotion';

/**
 * Phase 3 Plan 01 — `useReducedMotion` passthrough unit spec.
 *
 * The hook is a one-line re-export of Motion's own `useReducedMotion` from
 * `motion/react`. This spec locks the three observable behaviors the Phase 3
 * Hero cap-twist (Plan 03-02) relies on under a mocked `matchMedia`:
 *
 *   U1: returns `true`  when prefers-reduced-motion matches
 *   U2: returns `false` when the same query does NOT match
 *   U3: does not throw when `window.matchMedia` is absent (SSR-like null case,
 *       per Phase 3 CONTEXT D3-19)
 *
 * ──────────────────────────────────────────────────────────────────────────
 * Why we reset `motion-dom` internal state per test (not `vi.resetModules`)
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Motion's `useReducedMotion` lazy-initialises MODULE-LEVEL cache objects
 * exported from `motion-dom`:
 *
 *   const prefersReducedMotion = { current: null };
 *   const hasReducedMotionListener = { current: false };
 *
 * The first call to `useReducedMotion()` runs `initPrefersReducedMotion()`
 * which reads `window.matchMedia('(prefers-reduced-motion)').matches` and
 * seeds `prefersReducedMotion.current`. Subsequent calls short-circuit via
 * `hasReducedMotionListener.current === true` and reuse the cached value.
 *
 * `vi.resetModules()` DOES NOT reliably clear this cache (motion-dom is
 * imported via multiple paths through motion/react — some branches keep
 * a live reference to the original state object). The deterministic fix
 * is to import `motion-dom` directly and reset its exported state refs to
 * their factory values before each test.
 *
 * Motion internally queries `(prefers-reduced-motion)` (NOT
 * `(prefers-reduced-motion: reduce)`); our mock returns the per-test boolean
 * for both forms so the test is robust against a future Motion string change.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * NOTE on test file location
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Project vitest.config.ts restricts the `include` glob to tests/unit +
 * tests/ci using the `.spec.{ts,tsx}` filename pattern. The Phase 3-01 PLAN
 * draft suggested `src/lib/__tests__/useReducedMotion.test.ts` but that path
 * would be invisible to vitest. We follow the established project convention
 * here so vitest auto-discovers the file.
 */

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => unknown) | null;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  addListener: ReturnType<typeof vi.fn>;
  removeListener: ReturnType<typeof vi.fn>;
  dispatchEvent: ReturnType<typeof vi.fn>;
}

function makeMatchMedia(reduceMatches: boolean): (q: string) => MediaQueryList {
  return (query: string): MediaQueryList => {
    const isPrefersReduced =
      query === '(prefers-reduced-motion)' ||
      query === '(prefers-reduced-motion: reduce)';
    const mql: MockMediaQueryList = {
      matches: isPrefersReduced ? reduceMatches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn().mockReturnValue(true),
    };
    return mql as unknown as MediaQueryList;
  };
}

interface MotionDomState {
  prefersReducedMotion: { current: boolean | null };
  hasReducedMotionListener: { current: boolean };
}

async function resetMotionReducedMotionState(): Promise<void> {
  // Direct mutation of motion-dom's exported state singletons. See JSDoc
  // header for why this is the deterministic reset path.
  const motionDom = (await import('motion-dom')) as unknown as MotionDomState;
  motionDom.hasReducedMotionListener.current = false;
  motionDom.prefersReducedMotion.current = null;
}

describe('useReducedMotion — Phase 3 Plan 01 passthrough', () => {
  const originalMatchMedia = (window as unknown as { matchMedia?: unknown })
    .matchMedia;

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('U1: returns true when prefers-reduced-motion matches', async () => {
    await resetMotionReducedMotionState();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: makeMatchMedia(true),
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
  });

  it('U2: returns false when prefers-reduced-motion does not match', async () => {
    await resetMotionReducedMotionState();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: makeMatchMedia(false),
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
  });

  it('U3: does not throw when window.matchMedia is undefined (SSR-like null case; D3-19)', async () => {
    await resetMotionReducedMotionState();
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });

    expect(() => {
      const { result } = renderHook(() => useReducedMotion());
      // Phase 3 D3-19 locks consumer policy to "treat null as reduced", so
      // the exact value here is not asserted — only non-throw + a boolean|null
      // sentinel.
      const v = result.current;
      expect(v === null || v === true || v === false).toBe(true);
    }).not.toThrow();
  });
});
