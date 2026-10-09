import { memo } from 'react';

/**
 * Phase 2 Plan 02 — TWIST beat illustration (D2-01 / RESEARCH §6).
 *
 * Static inline SVG. Brand palette only — bottle outline uses
 * `currentColor` so the parent `<m.div>` can flip it between
 * `brand-deep` (light) and `brand-cream` (dark); cap + arc + dots
 * use the brand `--color-brand-rose` / `--color-brand-mid` CSS
 * variables.
 *
 * Phase 3 is where Motion animates the cap descending + rotating
 * onto the bottle neck. Phase 2 ships the final-state static image —
 * do NOT bake animation into the SVG itself.
 */
export const StepTwistIllustration = memo(function StepTwistIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      data-testid="step-illustration"
      className={className}
    >
      {/* Bottle outline — currentColor, inverts with theme */}
      <path
        d="M 160 180 L 160 340 Q 160 360 180 360 L 220 360 Q 240 360 240 340 L 240 180 L 240 160 L 160 160 Z"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      {/* Cap — brand-rose, floating above the neck */}
      <g>
        <rect
          x="162"
          y="80"
          width="76"
          height="16"
          rx="3"
          fill="var(--color-brand-rose)"
        />
        <path
          d="M 162 86 Q 162 50 200 50 Q 238 50 238 86 Z"
          fill="var(--color-brand-rose)"
        />
      </g>
      {/* Twisting arc — brand-mid, dashed */}
      <path
        d="M 250 90 Q 290 110 280 150"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {/* Three rotation-indicator dots — brand-mid */}
      <circle cx="286" cy="155" r="3" fill="var(--color-brand-mid)" />
      <circle cx="294" cy="140" r="3" fill="var(--color-brand-mid)" />
      <circle cx="298" cy="122" r="3" fill="var(--color-brand-mid)" />
    </svg>
  );
});
