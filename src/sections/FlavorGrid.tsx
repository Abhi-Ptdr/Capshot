import Container from '@/components/primitives/Container';
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
 */
export function FlavorGrid({ flavors }: { flavors: Flavor[] }) {
  return (
    <Container>
      <ul
        aria-label="Flavor grid"
        className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
      >
        {flavors.map((f) => (
          <li key={f.handle}>
            <FlavorCard flavor={f} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
