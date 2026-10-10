import Container from '@/components/primitives/Container';
import { m } from '@/lib/motion';
import { FlavorCard } from '@/components/ui/FlavorCard';
import type { Flavor } from '@/data/types';

/**
 * Phase 2 Plan 03 — Responsive flavor grid (D2-06 / RESEARCH §8).
 *
 * Grid density is locked by D2-06:
 *   - mobile  (<640 px): 2 columns, 16px gap
 *   - tablet  (640–1023 px): 3 columns, 20px gap
 *   - desktop (≥1024 px): 4 columns, 24px gap
 *
 * 16 cards split cleanly into 8 rows mobile, 5 full rows + 1 orphan
 * tablet, 4 full rows desktop. Grid default `justify-self: start` keeps
 * the tablet orphan row aligned top-left; no center-last-row trickery.
 *
 * The grid is wrapped in its OWN `<Container>` so callers can place
 * `<FlavorGrid>` as a top-level route child without a wrapping Container
 * — the page composition in `FlavorsPage` keeps the heading + filter
 * inside its own Container and renders this grid OUTSIDE to avoid
 * double-container padding stacking.
 *
 * Flavor cards are theme-independent — the `accentHex` background and
 * cream text + chip stay fixed in both light + dark mode. No `.dark`
 * overrides needed on the card itself.
 *
 * Phase 3 Plan 03 Task 2 — Row-by-row stagger (D3-12 / RESEARCH Q8).
 * Each `<li>` is upgraded to `<m.li>` with whileInView fade+slide
 * (opacity 0 → 1 + y 16 → 0, 0.4s, ease [0.2, 0, 0.2, 1], once,
 * margin -10% 0px). Per-card delay is `(i % 2) * 0.12` — zero on
 * even indices (mobile left column) and 120ms on odd indices (mobile
 * right column). On tablet (3 cols) and desktop (4 cols) the stagger
 * is still indexed from the mobile baseline per RESEARCH Q8 (flat-
 * index recommendation — zero new files, no useMediaQuery hook, no
 * hydration-shift risk; the stagger simply reads slightly denser at
 * desktop breakpoints without visual breakage).
 *
 * The `exit={{ opacity: 0, transition: { duration: 0.16 } }}` prop
 * is what makes the sibling-level AnimatePresence filter crossfade in
 * `FlavorsPage` actually fire — without `exit`, the outgoing <m.li>
 * elements would unmount synchronously on key change. Nested
 * `transition` inside `exit` overrides the element-level transition
 * during the exit phase (Motion 14 behavior).
 *
 * The inner `<FlavorCard>` is UNCHANGED (D3-14 lock — Phase 3 adds no
 * new motion inside the card). Motion lives at the parent <m.li> level.
 */
export function FlavorGrid({ flavors }: { flavors: Flavor[] }) {
  return (
    <Container>
      <ul
        aria-label="Flavor grid"
        className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        {flavors.map((f, i) => (
          <m.li
            key={f.handle}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.16 } }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{
              duration: 0.4,
              delay: (i % 2) * 0.12,
              ease: [0.2, 0, 0.2, 1],
            }}
            className="motion-reduce:!transform-none motion-reduce:!opacity-100"
          >
            <FlavorCard flavor={f} />
          </m.li>
        ))}
      </ul>
    </Container>
  );
}
