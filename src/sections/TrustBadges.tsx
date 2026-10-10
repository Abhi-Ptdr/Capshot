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
 * This component renders four TrustBadge entries in the D3.1-07a locked
 * order (FSSAI Licensed → Plant-based ingredients → Made in India →
 * Secure Checkout) using the visual-only arm of the Plan 01 discriminated
 * union (D3.1-07/08):
 *   - renders a <span> (NOT <a>) — no evidence URL, no PROD throw, no
 *     [data-pending-fssai] dev-warning banner
 *   - the discriminated-union arm omits the evidence prop from its type,
 *     so passing it on this arm is a tsc compile error
 *
 * Layout contract (D3.1-10): `flex flex-wrap items-center justify-center`
 * wraps the 4-badge row to 2x2 on narrow mobile (<375 px).
 *
 * Motion contract (D3.1-11): section-level <m.section> entrance only; NO
 * per-badge stagger. Tailwind `motion-reduce:` fallback collapses the
 * entrance to final state for reduced-motion users.
 *
 * Phase 5 handoff (post-GATE-FSSAI): each badge migrates to the linked
 * arm as evidence URLs land. Because the visual-only <span> className is
 * BYTE-IDENTICAL to the linked <a> className (Plan 01 design), the swap
 * is a one-line change per badge with zero visual change.
 *
 * Note: literal-value grep gates in the plan's acceptance criteria count
 * runtime code occurrences; this doc comment paraphrases the variant and
 * evidence-prop names so those gates stay strict (Phase 1 grep-safe-prose
 * convention; STATE.md decisions log).
 */
export function TrustBadges() {
  return (
    <Section background="bg">
      <m.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <ul
            aria-label="Trust indicators"
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
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
      </m.section>
    </Section>
  );
}
