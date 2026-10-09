import { describe, it, expect } from 'vitest';
import { lightenHex } from '@/lib/color';

/**
 * Phase 2 Plan 01 — `lightenHex` HSL math helper (RESEARCH §5).
 *
 * Pure function; no deps. Converts hex → HSL, adds L percentage (clamped
 * 0..1), returns back to 7-char hex (`#rrggbb`). Used by `<FlavorCard>` to
 * derive each card's `--cap-highlight` CSS variable from the flavor's
 * `accentHex`.
 */

function parseChannels(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

describe('lightenHex — HSL lightening (RESEARCH §5)', () => {
  it('C1: lightening pure black returns a 7-char hex brighter than input', () => {
    const out = lightenHex('#000000', 10);
    expect(out).toHaveLength(7);
    expect(out.startsWith('#')).toBe(true);
    expect(out.toLowerCase()).not.toBe('#000000');
  });

  it('C2: lightening a mid-saturation accent raises brightness on >= 2 of 3 channels', () => {
    const input = '#F57C1F';
    const out = lightenHex(input, 15);
    expect(out).toHaveLength(7);
    const [r1, g1, b1] = parseChannels(input);
    const [r2, g2, b2] = parseChannels(out);
    const raised =
      Number(r2 >= r1) + Number(g2 >= g1) + Number(b2 >= b1);
    expect(raised).toBeGreaterThanOrEqual(2);
  });

  it('C3: lightening pure white clamps at #ffffff (no overflow)', () => {
    expect(lightenHex('#FFFFFF', 20).toLowerCase()).toBe('#ffffff');
  });

  it('C4: lightenHex(accent, 0) round-trips within +/- 1 integer channel of input', () => {
    const input = '#F57C1F';
    const [r1, g1, b1] = parseChannels(input);
    const [r2, g2, b2] = parseChannels(lightenHex(input, 0));
    expect(Math.abs(r2 - r1)).toBeLessThanOrEqual(1);
    expect(Math.abs(g2 - g1)).toBeLessThanOrEqual(1);
    expect(Math.abs(b2 - b1)).toBeLessThanOrEqual(1);
  });
});
