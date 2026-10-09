import { memo } from 'react';

/**
 * Phase 2 Plan 02 — BOOM beat illustration (D2-01 / RESEARCH §6).
 *
 * Final frame: bottle filled with semi-transparent `--color-brand-rose`
 * liquid, cap sitting on the neck with a soft brand-rose glow behind
 * it, 6 radiating burst lines in `--color-brand-mid`, and 4 small
 * `--color-brand-rose` bubble accents scattered around the burst area.
 * Phase 3 is where Motion animates the burst + bubbles out of the cap.
 */
export const StepBoomIllustration = memo(function StepBoomIllustration({
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
      {/* Soft glow behind the cap — rendered FIRST so it sits behind */}
      <circle
        cx="200"
        cy="130"
        r="48"
        fill="var(--color-brand-rose)"
        opacity="0.2"
      />
      {/* Bottle outline */}
      <path
        d="M 160 180 L 160 340 Q 160 360 180 360 L 220 360 Q 240 360 240 340 L 240 180 L 240 160 L 160 160 Z"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      {/* Liquid fill — semi-transparent brand-rose wedge filling the lower
          two-thirds of the bottle with a soft wavy top. */}
      <path
        d="M 162 250 Q 180 240 200 250 T 240 250 L 240 340 Q 240 358 222 358 L 178 358 Q 160 358 160 340 Z"
        fill="var(--color-brand-rose)"
        opacity="0.5"
      />
      {/* Cap seated on the neck */}
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
      {/* 6 radiating burst lines emanating from (200, 100), angles
          30 / 60 / 90 / 120 / 150 / 180 degrees, lengths 24–38 px. */}
      <line
        x1="200"
        y1="100"
        x2="233"
        y2="80"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="100"
        x2="222"
        y2="68"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="100"
        x2="200"
        y2="62"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="100"
        x2="178"
        y2="68"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="100"
        x2="167"
        y2="80"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="200"
        y1="100"
        x2="158"
        y2="100"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* 4 bubble accents around the burst area */}
      <circle cx="135" cy="85" r="4" fill="var(--color-brand-rose)" />
      <circle cx="270" cy="90" r="5" fill="var(--color-brand-rose)" />
      <circle cx="240" cy="65" r="3" fill="var(--color-brand-rose)" />
      <circle cx="160" cy="55" r="3" fill="var(--color-brand-rose)" />
    </svg>
  );
});
