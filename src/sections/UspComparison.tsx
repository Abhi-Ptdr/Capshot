import { Clock, Leaf, Package, Repeat, IndianRupee } from 'lucide-react';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';

/**
 * Phase 3.1 Plan 02 — USP & Comparison Grid (USP-01).
 * Phase 3.1 Plan 07 — gap closure: populated the previously-blank
 * first-column header (GAP-03 fix) and appended two new user-selected
 * rows for taste-variety and per-drink price (GAP-04 fix) carrying
 * the locked copy agreed in the 2026-10-11 UAT walkthrough.
 *
 * Semantic 5-row × 2-col comparison table (plus a `<th scope="row">`
 * row-prefix cell carrying the dimension name + lucide icon). Pits
 * CAPSHOT against the regulator-safe competitor framing per D3.1-01 —
 * the left-column label broadens the comparison beyond stimulant
 * beverages and dodges the Phase 1 CI grep gate at
 * `scripts/ci-grep-forbidden-strings.mjs:61` (`/energy\s+drink/i`).
 *
 * Row-prefix icons (D3.1-02 + Plan 07 GAP-04 additions): Clock, Leaf,
 * and Package continue to prefix the first three D3.1-02a-locked rows
 * (the dimension names appear exactly once in the data tuple below);
 * Repeat and IndianRupee prefix the two new Plan 07 rows.
 *
 * Row copy for the first three rows is LOCKED by D3.1-02a — no
 * copywriter discretion. The two new rows carry Plan 07 locked copy
 * (GAP-04-TASTE-COPY + GAP-04-PRICE-COPY frontmatter decisions).
 *
 * Price-pending posture (Plan 07 GAP-04-PRICE-DISPLAY):
 *   The rupee-per-drink row carries a `data-pricing-pending="true"`
 *   attribute on the `<tr>` and an asterisked footnote sibling under
 *   the `<table>`. The posture mirrors the Phase 3.1 bundle pattern
 *   (every Bundle in `src/data/bundles.ts` carries a `pricingNote`
 *   flagging the pre-Phase-6 approval window) — Phase 6 can
 *   grep-locate the row/footnote and update the numbers without a
 *   UX rewrite.
 *
 * H2 headline choice: "Why CAPSHOT, not a bottled drink." —
 * English body-level comparison headline. The capshot-brand skill
 * reserves Hinglish for punchy marketing hooks and keeps longer
 * explanatory headlines in English for scannability. 33 chars,
 * under the plan's ~40-char budget.
 *
 * Motion: ONE section-level `<m.div>` entrance (opacity 0 → 1 +
 * y 32 → 0, 0.6s, ease [0.2, 0, 0.2, 1], once, margin -10% 0px) —
 * NO per-row stagger (D3.1-11). Tailwind reduced-motion escape
 * utilities on the wrapper collapse the entrance to final state
 * for users with the prefers-reduced-motion media query active.
 *
 * Right-column (CAPSHOT) cells render in `--color-brand-rose` + bold;
 * left-column (competitor) cells render in `--color-fg-muted`.
 *
 * Column widths (32% / 34% / 34%) are a layout recommendation from
 * RESEARCH §Code Example 1 — kept because 360×640 Playwright check
 * (UC5) shows no horizontal overflow (D3.1-12).
 *
 * No new npm installs — `motion` and `lucide-react` are already locked
 * in the Phase 1 package.json; both new icon modules ship with the
 * installed lucide-react@1.53.0.
 */

const ROWS = [
  {
    icon: Clock,
    dim: 'Freshness',
    other: 'Preserved on shelves for months',
    capshot: 'Activated instantly by you',
  },
  {
    icon: Leaf,
    dim: 'Nutrient Value',
    other: 'Degrades over time in bottles',
    capshot: '100% intact, sealed vitamins',
  },
  {
    icon: Package,
    dim: 'Portability',
    other: 'Heavy to carry around',
    capshot: 'Pocket-sized, travel-friendly cap',
  },
  {
    icon: Repeat,
    dim: 'Taste variety',
    other: '1 flavor per bottle, locked',
    capshot: '16 flavors, three ranges — swap any time',
  },
  {
    icon: IndianRupee,
    dim: 'Price per drink',
    other: '₹30-₹50 per bottle',
    capshot: '₹24-₹30 per cap*',
    pricingPending: true as const,
  },
] as const;

export function UspComparison() {
  return (
    <Section background="bg">
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
          <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]">
            Why CAPSHOT, not a bottled drink.
          </h2>
          <table className="mt-6 w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[color:var(--color-border)]">
                {/* prettier-ignore */}
                <th scope="col" className="w-[32%] py-3 text-sm font-bold text-[color:var(--color-fg-muted)]">Feature</th>
                <th
                  scope="col"
                  className="w-[34%] py-3 text-sm font-bold text-[color:var(--color-fg-muted)]"
                >
                  Store-bought bottled drinks
                </th>
                <th
                  scope="col"
                  className="w-[34%] py-3 text-sm font-bold text-[color:var(--color-brand-rose)]"
                >
                  CAPSHOT (SHI-28)
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const { icon: Icon, dim, other, capshot } = row;
                // Plan 07 GAP-04: the per-drink price row carries
                // the data-pricing-pending discriminator so Phase 6
                // can grep-locate the row for final-price updates
                // without re-reading surrounding JSX.
                //
                // IN-01 (iteration 3): check `row.pricingPending === true`
                // rather than `'pricingPending' in row` so a future row
                // adding `pricingPending: false` would NOT inherit the
                // pending-state attribute via key-presence alone. The
                // `as const` on the ROWS tuple keeps discriminated-union
                // narrowing precise here.
                //
                // WR-02 (iteration 3): the price-pending row also wires
                // the capshot <td> to aria-describedby="price-pending-note"
                // so screen readers reach the asterisk footnote (defined
                // below the <table>) when the price cell receives focus.
                const isPricingPending =
                  'pricingPending' in row && row.pricingPending === true;
                const pricingProps = isPricingPending
                  ? { 'data-pricing-pending': 'true' as const }
                  : {};
                const capshotCellProps = isPricingPending
                  ? { 'aria-describedby': 'price-pending-note' }
                  : {};
                return (
                  <tr
                    key={dim}
                    className="border-b border-[color:var(--color-border)]"
                    {...pricingProps}
                  >
                    <th scope="row" className="py-4">
                      <span className="inline-flex items-center gap-2 font-bold text-[color:var(--color-fg)]">
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                        {dim}
                      </span>
                    </th>
                    <td className="py-4 text-sm text-[color:var(--color-fg-muted)] sm:text-base">
                      {other}
                    </td>
                    <td
                      className="py-4 text-sm font-bold text-[color:var(--color-brand-rose)] sm:text-base"
                      {...capshotCellProps}
                    >
                      {capshot}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/*
            Plan 07 GAP-04 footnote: positioned OUTSIDE the semantic
            <table> as a sibling <p> (not a <caption> or <tfoot>) —
            simpler DOM, same visual effect, no screen-reader
            table-structure disruption.

            WR-02 (iteration 3): id="price-pending-note" wires the
            footnote to the capshot <td> on the pending-price row via
            aria-describedby. Screen readers announce the disclaimer
            when the cell receives focus / is read linearly, so the
            provisional-price caveat is actually reachable for AT
            users (not just a sighted-user visual asterisk).
          */}
          <p
            id="price-pending-note"
            className="mt-3 text-xs text-[color:var(--color-fg-muted)]"
          >
            * CAPSHOT per-cap price range pending client final approval before Phase 6.
          </p>
        </Container>
      </m.div>
    </Section>
  );
}
