import { memo } from 'react';

/**
 * Phase 3.1 Plan 01 — Shared cap-count SVG for the 3 bundle cards
 * (D3.1-04 / Pattern 4).
 *
 * Clones the Phase 2 FlavorCapGraphic SVG recoloring pattern verbatim:
 * the parent card writes `--cap-base` and `--cap-highlight` on its root
 * via inline `style`, then this SVG's paths read those variables via
 * `fill="var(--cap-base)"` / `fill="var(--cap-highlight)"`.
 *
 * Difference from FlavorCapGraphic: a centered `<text>` overlay renders
 * `05 | 15 | 30` (count padded to 2 digits) in brand-cream so each card
 * identifies its cap count at a glance. The three bundles all share the
 * same brand-rose cap color per D3.1-04 (iconography not photography);
 * the parent card typically sets `--cap-base: #9E7676` (brand-rose) and
 * `--cap-highlight: lightenHex(#9E7676, 15)`.
 *
 * Hex fallbacks in `var()` calls are MANDATORY per PATTERNS §Gotchas —
 * some browsers resolve SVG `fill="var(--token)"` with no fallback as
 * `fill="none"` if the custom property hasn't computed by paint time.
 *
 * Memoized because downstream Plan 03's Bundles section renders this
 * inside 3 cards that may re-render on hover/scroll state changes.
 */
export const BundleCountBadge = memo(function BundleCountBadge({
  count,
  className,
}: {
  count: 5 | 15 | 30;
  className?: string;
}) {
  const label = String(count).padStart(2, '0'); // '05' / '15' / '30'
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${count} caps`}
      className={className}
    >
      {/* Base shadow — static, theme-agnostic */}
      <ellipse cx="60" cy="98" rx="38" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Rim band — brand-rose lightened (fallback #B29595) */}
      <rect
        x="22"
        y="68"
        width="76"
        height="18"
        rx="4"
        fill="var(--cap-highlight, #B29595)"
      />
      {/* Dome — brand-rose base (fallback #9E7676) */}
      <path
        d="M 22 72 Q 22 20 60 20 Q 98 20 98 72 Z"
        fill="var(--cap-base, #9E7676)"
      />
      {/* Numeric overlay — cream text on brand-rose cap */}
      <text
        x="60"
        y="52"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="36"
        fontWeight="800"
        fill="var(--color-brand-cream, #FFF8EA)"
        style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)' }}
      >
        {label}
      </text>
    </svg>
  );
});
