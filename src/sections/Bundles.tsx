import { Check, ArrowUpRight } from 'lucide-react';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { bundles } from '@/data/bundles';
import { getCta, type CtaSlot } from '@/config/cta';
import { BundleCountBadge } from '@/components/ui/BundleCountBadge';
import { lightenHex } from '@/lib/color';

/**
 * Phase 3.1 Plan 03 Task 1 — Bundles section (CATALOG-01 / D3.1-03 / D3.1-04 /
 * D3.1-06 / D3.1-11).
 *
 * Tri-card lane rendering the three bundles (Trial / Fitness / Bulk) from the
 * `bundles` tuple in `src/data/bundles.ts`. Each card displays a cap-count
 * badge (brand-rose SVG via BundleCountBadge), the bundle title + audience
 * copy, the locked INR price, an inclusion checklist, and a single `<a>` CTA
 * routed through `getCta('bundles.{tier}')` so the Phase 6 commerce swap edits
 * only `src/config/cta.ts`.
 *
 * Composition mirrors Phase 2 FlavorTeaser (`src/sections/FlavorTeaser.tsx`
 * lines 115–123): outer `<Section>` from the Phase 1 primitive, inner
 * `<m.section>` carrying the Phase 3 whileInView entrance (opacity 0 → 1 +
 * y 32 → 0, 0.6s, ease [0.2, 0, 0.2, 1], once, margin -10% 0px), and the
 * mandatory Tailwind reduced-motion escape utilities so the entrance collapses
 * to final state immediately for users with `prefers-reduced-motion: reduce`
 * (D3.1-11 — section-level entrance only; NO per-card stagger).
 *
 * Visual identity per D3.1-04: all three cards share the brand-rose cap
 * (iconography, not photography). `--cap-base` + `--cap-highlight` are
 * computed once at module scope (bundles share a color) and set on each
 * card root via inline style; the BundleCountBadge SVG reads them.
 *
 * The whole card is NOT a single `<a>` — RESEARCH §Pitfall 6: the card is
 * an `<article>` (role=group implicit) and the only `<a>` is the CTA at
 * the bottom. Mobile tap-area ≥48px is enforced by the CTA's own height.
 *
 * The `handle: 'bulk-energy-pack'` + `title: 'Bulk Energy Pack'` are SAFE
 * for the CI grep gate (`/energy\s+drink/i`, whitespace-separated; "energy
 * pack" is permitted — see RESEARCH §Pitfall 1).
 */

// All three bundles share the brand-rose cap per D3.1-04. Compute the
// highlight once at module scope (not per-card) since lightenHex is pure
// and the input is a module-level constant.
const BRAND_ROSE = '#9E7676';
const cardStyle: React.CSSProperties = {
  ['--cap-base' as string]: BRAND_ROSE,
  ['--cap-highlight' as string]: lightenHex(BRAND_ROSE, 15),
} as React.CSSProperties;

// Explicit tier → CtaSlot map. TypeScript narrows the dotted-string literal
// cleanly without a `as const` dance on the template literal expression and
// also surfaces drift loudly if a bundle tier ever widens.
const TIER_SLOT: Record<'trial' | 'fitness' | 'bulk', CtaSlot> = {
  trial: 'bundles.trial',
  fitness: 'bundles.fitness',
  bulk: 'bundles.bulk',
};

export function Bundles() {
  return (
    // WR-07: `as="div"` so Bundles does NOT emit a second <section> inside
    // the outer <section aria-labelledby="catalog-heading"> wrapper from
    // CatalogBundles. The semantic landmark for the two-step narrative is
    // the CatalogBundles <section>; Bundles is a content block within it.
    <Section as="div" background="bg">
      <m.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <p className="text-sm font-bold tracking-wider text-[color:var(--color-brand-rose)] uppercase">
            Step 2 — Pack chuno.
          </p>
          <h3 className="mt-2 text-[24px] font-bold tracking-tight sm:text-[32px]">
            Pick your pack.
          </h3>
          <p className="mt-3 max-w-[52ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
            Three sizes, locked launch pricing. Join the waitlist and we'll
            ping you the moment pre-orders open.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            {bundles.map((bundle) => {
              const cta = getCta(TIER_SLOT[bundle.tier]);
              const isFitness = bundle.badge !== null;
              return (
                <li
                  key={bundle.handle}
                  data-bundle={bundle.tier}
                  style={cardStyle}
                  className={
                    'relative flex flex-col rounded-2xl bg-[color:var(--color-surface)] p-6 shadow-[0_4px_18px_-4px_rgba(89,69,69,0.18)] ring-1 ring-[color:var(--color-border)] focus-within:ring-2 focus-within:ring-[color:var(--color-ring)] ' +
                    (isFitness
                      ? 'md:scale-[1.03] md:shadow-[0_10px_30px_-6px_rgba(89,69,69,0.25)] ring-[color:var(--color-brand-rose)]/40'
                      : '')
                  }
                >
                  {bundle.badge ? (
                    <span className="absolute -top-3 right-6 rounded-full bg-[color:var(--color-brand-rose)] px-3 py-1 text-[11px] font-bold tracking-wider text-[color:var(--color-brand-cream)] uppercase shadow-[0_4px_12px_-2px_rgba(89,69,69,0.3)]">
                      {bundle.badge}
                    </span>
                  ) : null}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-xl font-bold tracking-tight sm:text-2xl">
                        {bundle.title}
                      </h4>
                      <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
                        {bundle.audience}
                      </p>
                    </div>
                    <BundleCountBadge
                      count={bundle.caps}
                      className="h-20 w-20 shrink-0"
                    />
                  </div>

                  <p className="mt-5 text-3xl font-bold tracking-tight">
                    ₹{bundle.priceInr}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--color-fg-muted)]">
                    {bundle.pricingNote}
                  </p>

                  <ul className="mt-5 space-y-2">
                    {bundle.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-[color:var(--color-fg)]"
                      >
                        <Check
                          size={16}
                          strokeWidth={2.25}
                          className="mt-0.5 shrink-0 text-[color:var(--color-brand-rose)]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={cta.ariaLabel ?? cta.label}
                    data-cta={cta.trackingId}
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 self-end rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-bold tracking-wide text-[color:var(--color-accent-fg)] uppercase shadow-[var(--shadow-cta)] transition-[filter,transform,box-shadow] hover:brightness-[0.92] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[color:var(--color-ring)] motion-reduce:transition-none motion-reduce:active:scale-100"
                  >
                    {cta.label}
                    <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </Container>
      </m.div>
    </Section>
  );
}
