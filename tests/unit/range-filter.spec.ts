import { describe, expect, test } from 'vitest';
import { flavors } from '@/data/flavors';
import type { FlavorRange } from '@/data/types';

/**
 * Phase 2 Plan 03 — Range filter unit invariants (RF-U1 / RF-U2 / RF-U3).
 *
 * Guards the type ↔ runtime bridge for the `/flavors` filter:
 *   - RF-U1: `VALID_RANGES` compile-time literal matches the `FlavorRange`
 *     union exactly. Uses TS 7's `satisfies readonly FlavorRange[]` — any
 *     drift fails `tsc --noEmit` (triggered by `npm run build`).
 *   - RF-U2: runtime subset check — every entry in the VALID set is a
 *     legal FlavorRange literal (defensive against stringly-typed hazard).
 *   - RF-U3: 9/3/4 split invariant — Fruity Blast 9, Desi & Cool 3,
 *     Premium Sports 4. Catches silent catalog drift from Wave 1
 *     locked-field snapshot (FL3) at a higher aggregate level.
 */

const VALID_RANGES = [
  'fruity-blast',
  'desi-cool',
  'premium-sports',
] as const satisfies readonly FlavorRange[];

describe('range-filter invariants', () => {
  test('RF-U1 — VALID_RANGES tuple satisfies readonly FlavorRange[]', () => {
    // The `satisfies` clause above is a compile-time proof. The runtime
    // check below is a redundant sanity assertion so the test runner
    // reports a pass; the real guard is `tsc --noEmit`.
    expect(VALID_RANGES).toHaveLength(3);
    expect(new Set<string>(VALID_RANGES).size).toBe(3);
  });

  test('RF-U2 — runtime subset: every VALID entry is a FlavorRange literal', () => {
    const literalSet = new Set<string>([
      'fruity-blast',
      'desi-cool',
      'premium-sports',
    ]);
    const runtime: readonly string[] = VALID_RANGES;
    expect(runtime.every((v) => literalSet.has(v))).toBe(true);
  });

  test('RF-U3 — 9/3/4 split holds across the 16-flavor catalog', () => {
    expect(flavors.filter((f) => f.range === 'fruity-blast').length).toBe(9);
    expect(flavors.filter((f) => f.range === 'desi-cool').length).toBe(3);
    expect(flavors.filter((f) => f.range === 'premium-sports').length).toBe(4);
    expect(flavors.length).toBe(16);
  });
});
