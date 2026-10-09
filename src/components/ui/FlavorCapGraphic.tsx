import { memo } from 'react';

/**
 * Phase 2 Plan 01 — Shared cap SVG for all 16 flavor cards (D2-05 / RESEARCH §5).
 *
 * Fills come from CSS custom properties set on the ancestor element —
 * `<FlavorCard>` writes `--cap-base` and `--cap-highlight` on its root
 * via inline `style`, then this SVG's paths read those variables via
 * `fill="var(--cap-base)"` / `fill="var(--cap-highlight)"`.
 *
 * One SVG tree is reused for all 16 flavors; no per-flavor asset work,
 * no runtime recoloring JS, no re-render on theme toggle. Each card is
 * self-contained — the colors ride on the element the SVG is rendered
 * inside.
 *
 * The cap uses accentHex-family colors (NOT the brand palette) because
 * it lives inside a flavor-wash context. The cream top-light sliver
 * and the base shadow are static (theme-agnostic) so they read on every
 * accent, light or dark.
 */
export const FlavorCapGraphic = memo(function FlavorCapGraphic({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Base shadow — static, theme-agnostic */}
      <ellipse cx="60" cy="98" rx="38" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Rim band — accent highlight (lightened derivative of accentHex) */}
      <rect
        x="22"
        y="68"
        width="76"
        height="18"
        rx="4"
        fill="var(--cap-highlight)"
      />
      {/* Dome — accent base */}
      <path d="M 22 72 Q 22 20 60 20 Q 98 20 98 72 Z" fill="var(--cap-base)" />
      {/* Cream top-light sliver for depth, static */}
      <path
        d="M 30 55 Q 30 28 60 28"
        stroke="rgba(255,248,234,0.35)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});
