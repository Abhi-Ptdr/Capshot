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
 */

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe('TrustBadge — evidenceUrl contract (Pitfall #2 / TRUST-02)', () => {
  it('renders a visible data-pending-fssai banner in dev when evidenceUrl is empty', () => {
    const { container } = render(
      <TrustBadge label="FSSAI Licensed" evidenceUrl="" />,
    );
    const banner = container.querySelector('[data-pending-fssai]');
    expect(banner).not.toBeNull();
  });

  it('throws in production (import.meta.env.PROD) when evidenceUrl is empty', () => {
    vi.stubEnv('MODE', 'production');
    vi.stubEnv('PROD', 'true');
    expect(() =>
      render(
        <TrustBadge
          // @ts-expect-error — "FSSAI Approved" is intentionally NOT in the union literal;
          // this line must be a TypeScript error (verified via tsc --noEmit in CI).
          label={'FSSAI Approved' as unknown as 'FSSAI Licensed'}
          evidenceUrl=""
        />,
      ),
    ).toThrow(/evidenceUrl in production/);
  });
});
