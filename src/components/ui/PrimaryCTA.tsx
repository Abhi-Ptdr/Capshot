import { cva } from 'class-variance-authority';
import { ArrowUpRight } from 'lucide-react';
import { getCta } from '@/config/cta';
import Button from '@/components/primitives/Button';
import { cn } from '@/lib/cn';

/**
 * Phase 1 Plan 02 — PrimaryCTA (UI-SPEC §Component 3).
 *
 * Reads destination + label + aria + tracking from `@/config/cta`. CI grep
 * will enforce (Plan 03) that the WhatsApp deep-link lives ONLY inside
 * `src/config/cta.ts` — every "Try CAPSHOT" button in the site composes
 * this component, which composes `getCta()`, which is the sole legal
 * reader of the destination.
 *
 * cva size variants:
 *  - `lg` (default — Hero): 56 px tall, full-width on mobile, min-width 240 ≥sm.
 *    HERO-02 locks the 56-px floor.
 *  - `md` (coming-soon shells + 404): 48 px tall, min-width 200.
 *
 * External destinations (`whatsapp` / `shopify`) auto-render `target="_blank"`,
 * `rel="noopener noreferrer"`, and the lucide `ArrowUpRight` affordance per
 * UI-SPEC §Component 3 "Icon slot after label".
 *
 * Plan 03 injects the Pixel + CAPI onClick wrapper into this file (CONV-01);
 * `cta.ts` stays untouched at that point.
 */

const primaryCtaVariants = cva(
  [
    // Base — identical for both sizes
    'inline-flex items-center justify-center gap-2',
    'rounded-full font-bold uppercase tracking-wide',
    'bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)]',
    'shadow-[var(--shadow-cta)]',
    'transition-[filter,transform,box-shadow]',
    'hover:brightness-[0.92]',
    'active:scale-[0.98]',
    'focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--color-ring)]',
    'motion-reduce:transition-none motion-reduce:active:scale-100',
  ].join(' '),
  {
    variants: {
      size: {
        lg: 'h-14 w-full px-6 py-4 text-base sm:w-auto sm:min-w-[240px]',
        md: 'h-12 min-w-[200px] px-5 py-3 text-base',
      },
    },
    defaultVariants: { size: 'lg' },
  },
);

type PrimaryCTAProps = {
  slot?: 'primary' | 'nav';
  size?: 'lg' | 'md';
  className?: string;
};

export function PrimaryCTA({
  slot = 'primary',
  size = 'lg',
  className,
}: PrimaryCTAProps) {
  const cta = getCta(slot);
  const isExternal = cta.kind === 'whatsapp' || cta.kind === 'shopify';
  return (
    <Button
      as="a"
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={cta.ariaLabel ?? cta.label}
      data-cta={cta.trackingId}
      className={cn(primaryCtaVariants({ size }), className)}
    >
      {cta.label}
      {isExternal ? (
        <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
      ) : null}
    </Button>
  );
}
