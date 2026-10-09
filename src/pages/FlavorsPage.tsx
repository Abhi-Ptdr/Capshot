import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { RangeFilter } from '@/components/ui/RangeFilter';
import { FlavorGrid } from '@/sections/FlavorGrid';
import { flavors } from '@/data/flavors';
import type { FlavorRange } from '@/data/types';

/**
 * Phase 2 Plan 03 — `/flavors` route (FLAV-01 + FLAV-02 / RESEARCH §1).
 *
 * Replaces the Phase 1 coming-soon shell with the real 16-flavor catalog +
 * URL-synced range filter.
 *
 * Reads `?range=` via React Router v8 `useSearchParams` (import from
 * `'react-router'` ONLY — v8 removed the legacy DOM-suffixed sister
 * package entirely; see CLAUDE.md "What NOT to Use").
 * Resolves `active` against the frozen `VALID_RANGES` literal; invalid
 * values fall through to `null` (= All) and are cleaned from the URL by
 * `<RangeFilter>`'s mount effect.
 *
 * URL state contract:
 *   - All        → `/flavors`                (clean URL)
 *   - Fruity Blast → `/flavors?range=fruity-blast`
 *   - Desi & Cool  → `/flavors?range=desi-cool`
 *   - Premium Sports → `/flavors?range=premium-sports`
 *
 * Pill clicks use `replace: false` so each click pushes a history entry
 * (back-button is a visible undo per D2-08). Invalid-param cleanup inside
 * `<RangeFilter>` uses `replace: true` so bogus share-links don't pollute.
 *
 * Share-link resilience: cold-loading any valid URL renders the filtered
 * grid immediately on mount — no fetch, no spinner, no flicker.
 *
 * React 19 metadata hoisting is used here for `<title>` + `<meta>` so SEO
 * works without an extra library in Phase 2. Phase 5 (SEO-01) migrates to
 * `@unhead/react` for per-filter canonical consolidation.
 *
 * The `<FlavorGrid>` renders OUTSIDE this file's `<Container>` because
 * FlavorGrid already wraps itself in a Container — avoids double-padding.
 */

const VALID_RANGES: readonly FlavorRange[] = [
  'fruity-blast',
  'desi-cool',
  'premium-sports',
];

export default function FlavorsPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('range');
  const active: FlavorRange | null = (
    VALID_RANGES as readonly string[]
  ).includes(raw ?? '')
    ? (raw as FlavorRange)
    : null;

  const visible = useMemo(
    () => (active ? flavors.filter((f) => f.range === active) : flavors),
    [active],
  );

  return (
    <>
      <title>All 16 flavors — CAPSHOT</title>
      <meta
        name="description"
        content="Browse 16 CAPSHOT flavor caps across Fruity Blast, Desi & Cool, and Premium Sports."
      />
      <main id="main" tabIndex={-1}>
        <Section className="pt-20 sm:pt-24">
          <Container>
            <h1 className="text-[32px] font-bold tracking-tight sm:text-[48px]">
              All 16 flavors.
            </h1>
            <RangeFilter
              active={active}
              onChange={(r) => {
                if (r === null) {
                  setParams({}, { replace: false });
                } else {
                  setParams({ range: r }, { replace: false });
                }
              }}
            />
          </Container>
          <FlavorGrid flavors={visible} />
        </Section>
      </main>
    </>
  );
}
