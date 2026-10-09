import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { flavors } from '@/data/flavors';
import { FlavorCard } from '@/components/ui/FlavorCard';
import type { Flavor } from '@/data/types';

/**
 * Phase 2 Plan 02 Task 2 — Flavor Teaser (FLAV-03 / D2-09 / D2-10 /
 * RESEARCH §3 + §9).
 *
 * Horizontally-scrolling (CSS scroll-snap, mandatory on x) row of 8
 * curated FlavorCards + a 9th terminal tile "See all 16 flavors →"
 * (brand-rose background) that links to `/flavors`.
 *
 * D2-09 locks the curated 8 as a fixed tuple — ordered 4 Fruity Blast
 * (Orange / Mango / Watermelon / Strawberry) → 2 Desi & Cool
 * (Jaljeera / ORS Electrolyte) → 2 Premium Sports (Japanese Matcha /
 * Coffee). This is NOT random — SEO + testability demand determinism.
 * `tests/e2e/flavor-teaser.spec.ts` FT6 enforces that a cold reload
 * returns the identical ordering.
 *
 * The scroller is keyboard-accessible: `tabIndex={0}` makes the region
 * itself a tab-stop, and arrow keys pan horizontally via native browser
 * scroll behavior on focusable scroll-containers (WCAG 2.1.1).
 *
 * The scroller region is intentionally full-bleed (OUTSIDE Container)
 * so cards can bleed past the 1200 px content lane on wide viewports;
 * the heading block sits inside Container to keep paragraph measure
 * controlled.
 *
 * Copy uses "caffeinated" NOT the forbidden stimulant-beverage phrase —
 * the Phase 1 CI grep gate (`npm run grep:ci`) catches regressions.
 *
 * Reuses `<FlavorCard>` from Wave 1 — no teaser-only fork (RESEARCH §9).
 */

// Curated 8 — D2-09 lock. Order chosen for max visual contrast across
// the three ranges on scroll (warm oranges → juicy pinks → earthy
// browns/greens → greens again → dark coffee).
const TEASER_HANDLES = [
  'orange',
  'mango',
  'watermelon',
  'strawberry',
  'jaljeera',
  'ors-electrolyte',
  'japanese-matcha',
  'coffee',
] as const;

// Resolve each handle to its full Flavor record. The filter + type
// predicate narrows the array type to `Flavor[]` so TS 7 strict mode
// is happy; FlavorCard's prop is `{ flavor: Flavor }` (non-nullable).
// The Wave 1 FL3 locked-field invariant proves these handles exist in
// src/data/flavors.ts, so the filter never actually drops anything.
const curated: Flavor[] = TEASER_HANDLES.map((h) =>
  flavors.find((f) => f.handle === h),
).filter((f): f is Flavor => f !== undefined);

// Visual sizing shared between the 8 FlavorCard tiles and the 9th
// "See all" tile so the scroller feels uniform.
const TILE_CLS =
  'snap-start shrink-0 basis-[70%] sm:basis-[42%] lg:basis-[24%]';

export function FlavorTeaser() {
  return (
    <Section className="pt-8 sm:pt-12 md:pt-16" background="bg">
      <Container>
        <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]">
          Pick your flavor.
        </h2>
        <p className="mt-3 max-w-[48ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
          Sixteen caps, three ranges. Fruity, desi, caffeinated.
        </p>
      </Container>

      {/*
        Full-bleed scroll region. role="region" + aria-label gives
        screen readers a named landmark; tabIndex={0} + a visible focus
        ring makes keyboard arrow-key panning discoverable.
      */}
      <div
        role="region"
        aria-label="Flavor teaser"
        tabIndex={0}
        className="mt-6 snap-x snap-mandatory scroll-smooth overflow-x-auto [-ms-overflow-style:none] [scroll-padding-inline:1rem] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)] sm:[scroll-padding-inline:1.5rem] lg:[scroll-padding-inline:2rem]"
      >
        <ul className="flex gap-4 px-4 pb-4 sm:gap-5 sm:px-6 lg:gap-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
          {curated.map((flavor) => (
            <li key={flavor.handle} className={TILE_CLS}>
              <FlavorCard flavor={flavor} />
            </li>
          ))}
          {/* 9th terminal tile — brand-rose bg, routes to /flavors */}
          <li className={TILE_CLS}>
            <Link
              to="/flavors"
              data-cta="cta_teaser_see_all"
              aria-label="See all 16 flavors"
              className="group flex aspect-[3/4] flex-col items-start justify-end rounded-2xl bg-[color:var(--color-brand-rose)] p-5 text-[color:var(--color-brand-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
            >
              <span className="text-lg font-bold tracking-tight sm:text-xl">
                See all
                <br />
                16 flavors
              </span>
              <ArrowUpRight
                size={28}
                strokeWidth={2}
                className="mt-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </li>
        </ul>
      </div>
    </Section>
  );
}
