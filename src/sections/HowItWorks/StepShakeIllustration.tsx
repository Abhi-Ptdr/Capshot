import { memo } from 'react';

/**
 * Phase 2 Plan 02 — SHAKE beat illustration (D2-01 / RESEARCH §6).
 *
 * Same bottle silhouette as TWIST, now tilted ~3° right as a static
 * shake hint. Cap seated on the neck. 4 slanted shake lines flank the
 * bottle in `--color-brand-mid`. Translucent `--color-brand-rose` powder
 * specks suggest flavor mixing inside. Phase 3 will spring the bottle
 * left-right; Phase 2 ships the still frame.
 */
export const StepShakeIllustration = memo(function StepShakeIllustration({
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
      {/* Bottle outline — tilted ~3° to the right, centered on (200, 260) */}
      <g transform="rotate(3 200 260)">
        <path
          d="M 160 180 L 160 340 Q 160 360 180 360 L 220 360 Q 240 360 240 340 L 240 180 L 240 160 L 160 160 Z"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        {/* Cap seated flush on the neck */}
        <rect
          x="162"
          y="146"
          width="76"
          height="16"
          rx="3"
          fill="var(--color-brand-rose)"
        />
        <path
          d="M 162 152 Q 162 116 200 116 Q 238 116 238 152 Z"
          fill="var(--color-brand-rose)"
        />
        {/* Powder specks inside the bottle (translucent) */}
        <circle
          cx="190"
          cy="240"
          r="4"
          fill="var(--color-brand-rose)"
          opacity="0.4"
        />
        <circle
          cx="215"
          cy="270"
          r="3"
          fill="var(--color-brand-rose)"
          opacity="0.4"
        />
        <circle
          cx="200"
          cy="300"
          r="5"
          fill="var(--color-brand-rose)"
          opacity="0.4"
        />
        <circle
          cx="180"
          cy="320"
          r="3"
          fill="var(--color-brand-rose)"
          opacity="0.4"
        />
      </g>
      {/* Shake lines — static hint of motion. Drawn OUTSIDE the rotated
          group so they stay axis-aligned with the viewBox. */}
      {/* Left side — two lines angled right-upward */}
      <line
        x1="110"
        y1="220"
        x2="140"
        y2="210"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="260"
        x2="135"
        y2="258"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right side — two lines angled left-upward */}
      <line
        x1="260"
        y1="220"
        x2="290"
        y2="212"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="265"
        y1="258"
        x2="300"
        y2="260"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
});
