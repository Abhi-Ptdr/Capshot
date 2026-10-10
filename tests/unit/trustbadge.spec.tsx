import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { TrustBadge } from '@/components/ui/TrustBadge';

/**
 * Phase 1 Plan 02 — TrustBadge evidenceUrl contract (Pitfall #2).
 *
 * Phase 1 ships the declaration only (component is NOT rendered by any
 * Phase 1 route). The contract: evidenceUrl is REQUIRED; in production the
 * component throws if it's missing; in dev it renders a visible warning
 * banner marked with data-pending-fssai.
 *
 * The TS union-literal label is enforced via the type system — attempting
 * `label="FSSAI Approved"` must be a compile error (verified by the
 * `@ts-expect-error` line in the production test below).
 *
 * Phase 3.1 Plan 01 extension (D3.1-08): A second describe block below
 * exercises the new `variant: 'visual-only'` arm. The Phase 1 contract
 * stays byte-identical on the default (linked) arm.
 */

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('TrustBadge — evidenceUrl contract (Pitfall #2 / TRUST-02)', () => {
  it('renders a visible data-pending-fssai banner in dev when evidenceUrl is empty', () => {
    const { container } = render(
      <TrustBadge variant="linked" label="FSSAI Licensed" evidenceUrl="" />,
    );
    const banner = container.querySelector('[data-pending-fssai]');
    expect(banner).not.toBeNull();
  });

  it('throws in production (import.meta.env.PROD) when evidenceUrl is empty', () => {
    vi.stubEnv('MODE', 'production');
    vi.stubEnv('PROD', true);
    expect(() =>
      render(
        <TrustBadge variant="linked" label="FSSAI Licensed" evidenceUrl="" />,
      ),
    ).toThrow(/evidenceUrl in production/);
  });

  it('rejects a non-union label at compile time (TypeScript enforcement)', () => {
    // The `@ts-expect-error` directive on the next line is intentional —
    // "FSSAI Approved" is NOT in the TrustBadgeProps `label` union, so passing
    // it should be a type error. We don't actually render; the compile-time
    // check (via `tsc --noEmit` in CI) is the real assertion. Runtime: trivially
    // ignored by `expect(true).toBe(true)` since the component path is never hit.
    const forbidden = () => (
      // @ts-expect-error "FSSAI Approved" is deprecated FSSAI nomenclature and must be a type error
      <TrustBadge variant="linked" label="FSSAI Approved" evidenceUrl="https://example.com" />
    );
    expect(typeof forbidden).toBe('function');
  });

  it('rejects a call with no variant at compile time (WR-02 discriminator-required)', () => {
    const forbidden = () => (
      // @ts-expect-error variant is REQUIRED on both arms of TrustBadgeProps — WR-02
      <TrustBadge label="FSSAI Licensed" evidenceUrl="https://example.com" />
    );
    expect(typeof forbidden).toBe('function');
  });
});

describe('TrustBadge — variant: "visual-only" (Phase 3.1 D3.1-08)', () => {
  it('renders a <span> and NO <a> element when variant="visual-only"', () => {
    const { container } = render(
      <TrustBadge variant="visual-only" label="FSSAI Licensed" />,
    );
    const anchor = container.querySelector('a');
    const span = container.querySelector('span[aria-label="FSSAI Licensed"]');
    expect(anchor).toBeNull();
    expect(span).not.toBeNull();
  });

  it('does NOT render a [data-pending-fssai] banner on the visual-only arm', () => {
    const { container } = render(
      <TrustBadge variant="visual-only" label="FSSAI Licensed" />,
    );
    const banner = container.querySelector('[data-pending-fssai]');
    expect(banner).toBeNull();
  });

  it('does NOT throw in production when variant="visual-only" (no evidenceUrl required)', () => {
    vi.stubEnv('MODE', 'production');
    vi.stubEnv('PROD', true);
    expect(() =>
      render(<TrustBadge variant="visual-only" label="FSSAI Licensed" />),
    ).not.toThrow();
  });

  it('rejects variant="visual-only" + evidenceUrl at compile time (discriminated union)', () => {
    const forbidden = () => (
      // prettier-ignore
      // @ts-expect-error visual-only arm must NOT accept evidenceUrl — discriminated union compile gate
      <TrustBadge variant="visual-only" label="FSSAI Licensed" evidenceUrl="https://example.com" />
    );
    expect(typeof forbidden).toBe('function');
  });

  it('renders all 4 locked labels under variant="visual-only" without widening the union', () => {
    const labels = [
      'FSSAI Licensed',
      'Plant-based ingredients',
      'Made in India',
      'Secure Checkout',
    ] as const;
    for (const label of labels) {
      const { container } = render(
        <TrustBadge variant="visual-only" label={label} />,
      );
      const span = container.querySelector(`span[aria-label="${label}"]`);
      expect(span).not.toBeNull();
      cleanup();
    }
  });
});
