/**
 * Phase 2 Plan 01 — Pure HSL hex-lightening helper (RESEARCH §5).
 *
 * Converts a 6-char hex to HSL, adds `pctL` percentage points to the L
 * channel (clamped 0..1), returns a 7-char hex `#rrggbb`. Pure function,
 * no runtime dependencies.
 *
 * Used by `<FlavorCard>` to derive the `--cap-highlight` CSS variable
 * from the flavor's `accentHex`, so the shared `<FlavorCapGraphic>` SVG
 * can recolor its rim band without a per-flavor asset.
 *
 * Sign convention: `pctL > 0` lightens; negative darkens. Values are
 * clamped to the HSL L range [0, 1] after the delta is applied.
 */
export function lightenHex(hex: string, pctL: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const hue =
    d === 0
      ? 0
      : max === r
        ? ((g - b) / d) % 6
        : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
  const H = hue * 60;
  const Lnew = Math.min(1, Math.max(0, l + pctL / 100));
  // HSL → RGB
  const c = (1 - Math.abs(2 * Lnew - 1)) * s;
  const x = c * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = Lnew - c / 2;
  let rp = 0,
    gp = 0,
    bp = 0;
  if (H < 60) [rp, gp, bp] = [c, x, 0];
  else if (H < 120) [rp, gp, bp] = [x, c, 0];
  else if (H < 180) [rp, gp, bp] = [0, c, x];
  else if (H < 240) [rp, gp, bp] = [0, x, c];
  else if (H < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return '#' + toHex(rp) + toHex(gp) + toHex(bp);
}
