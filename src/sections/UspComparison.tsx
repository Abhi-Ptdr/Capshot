import { Clock, Leaf, Package } from 'lucide-react';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';

/**
 * Phase 3.1 Plan 02 — USP & Comparison Grid (USP-01).
 *
 * Semantic 3-row × 2-col comparison table (plus a `<th scope="row">`
 * row-prefix cell carrying the dimension name + lucide icon). Pits
 * CAPSHOT against the regulator-safe competitor framing per D3.1-01 —
 * the left-column label broadens the comparison beyond stimulant
 * beverages and dodges the Phase 1 CI grep gate at
 * `scripts/ci-grep-forbidden-strings.mjs:61` (`/energy\s+drink/i`).
 *
 * Row-prefix icons (D3.1-02):
 *   - Clock   → Freshness
 *   - Leaf    → Nutrient Value
 *   - Package → Portability
 *
 * Row copy is LOCKED by D3.1-02a — no copywriter discretion.
 *
 * H2 headline choice: "Why CAPSHOT, not a bottled drink." —
 * English body-level comparison headline. The capshot-brand skill
 * reserves Hinglish for punchy marketing hooks and keeps longer
 * explanatory headlines in English for scannability. 33 chars,
 * under the plan's ~40-char budget.
 *
 * Motion: ONE section-level `<m.section>` entrance (opacity 0 → 1 +
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
 * in the Phase 1 package.json.
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
                <th
                  scope="col"
                  className="w-[32%] py-3 text-sm font-bold text-[color:var(--color-fg-muted)]"
                >
                  &nbsp;
                </th>
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
              {ROWS.map(({ icon: Icon, dim, other, capshot }) => (
                <tr
                  key={dim}
                  className="border-b border-[color:var(--color-border)]"
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
                  <td className="py-4 text-sm font-bold text-[color:var(--color-brand-rose)] sm:text-base">
                    {capshot}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Container>
      </m.div>
    </Section>
  );
}
