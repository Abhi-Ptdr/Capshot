import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { TrustBadge } from '@/components/ui/TrustBadge';

/**
 * Phase 3.1 Plan 04 — Trust Badges strip (TRUST-01 + TRUST-02).
 *
 * Section 5 of the Phase 3.1 locked homepage order:
 *   Hero → HowItWorks → UspComparison → CatalogBundles → TrustBadges.
 *
 * GAP-01 (2026-10-11 UAT): added `<h2>` section heading above the `<ul>`
 * and flipped `<Section>` background prop from `bg` to `surface` so the
 * strip reads as a named section tonally separated from the Bundles cards
 * above (which sit on the dominant page tone). Before this change the
 * strip appeared as orphaned chrome below the last bundle card — same
 * tone, no heading, no visual presence as a section.
 *
 * This component renders four TrustBadge entries in the D3.1-07a locked
 * order (regulator-licensing claim first, then plant-based ingredient
 * claim, then country-of-origin claim, then checkout-safety claim) using
 * the visual-only arm of the Plan 01 discriminated union (D3.1-07/08):
 *   - renders a span (NOT anchor) — no evidence URL, no PROD throw, no
 *     dev-warning banner data attribute
 *   - the discriminated-union arm omits the evidence prop from its type,
 *     so passing it on this arm is a tsc compile error
 *
 * Layout contract (D3.1-10 + WR-05): `flex flex-wrap items-center
 * justify-center` wraps the 4-badge row across multiple rows on narrow
 * mobile (<375 px). The observed layout at 360x640 is 1+1+2 because the
 * plant-based claim pill is ~215px wide and can't pair with any sibling
 * under 360px — any multi-row wrap satisfies the contract; a strict 2x2
 * layout is not required.
 *
 * Motion contract (D3.1-11 + WR-07): section-level `<m.div>` entrance
 * only (NOT `<m.section>` — the motion wrapper must not pollute the a11y
 * landmark tree beyond the outer `<Section>`'s single section); NO
 * per-badge stagger. Tailwind `motion-reduce:` fallback collapses the
 * entrance to final state for reduced-motion users.
 *
 * Phase 5 handoff (post-GATE-FSSAI): each badge migrates to the linked
 * arm as evidence URLs land. Because the visual-only span className is
 * BYTE-IDENTICAL to the linked anchor className (Plan 01 design), the
 * swap is a one-line change per badge with zero visual change.
 *
 * Note: literal-value grep gates in the plan's acceptance criteria count
 * runtime code occurrences; this doc comment paraphrases the variant and
 * evidence-prop names so those gates stay strict (Phase 1 grep-safe-prose
 * convention; STATE.md decisions log).
 */
export function TrustBadges() {
  return (
    <Section background="surface">
      {/*
        WR-07: motion wrapper is <m.div>, NOT <m.section>, so the a11y
        landmark tree sees only the outer <Section>'s single <section>
        for this content region.
      */}
      <m.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <h2 className="text-center text-[28px] font-bold tracking-tight sm:text-[36px]">
            Why trust us.
          </h2>
          <ul
            aria-label="Trust indicators"
            className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            <li>
              <TrustBadge variant="visual-only" label="FSSAI Licensed" />
            </li>
            <li>
              <TrustBadge
                variant="visual-only"
                label="Plant-based ingredients"
              />
            </li>
            <li>
              <TrustBadge variant="visual-only" label="Made in India" />
            </li>
            <li>
              <TrustBadge variant="visual-only" label="Secure Checkout" />
            </li>
          </ul>
        </Container>
      </m.div>
    </Section>
  );
}
