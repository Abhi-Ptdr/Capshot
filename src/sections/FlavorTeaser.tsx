import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { m } from '@/lib/motion';
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
 * The scroller is CONTAINED inside the same Container as the heading
 * so left/right gutters match Hero and the "Pick your flavor" headline.
 * On desktop (lg+) a pair of ChevronLeft / ChevronRight circular
 * buttons overlay the scroller edges — click to pan by ~80% of the
 * visible width. Buttons hide at the respective boundary (disabled +
 * opacity-0). Touch devices still use native swipe; the arrows are
 * display:none below lg to keep mobile uncluttered.
 *
 * D2-09 locks the curated 8 as a fixed tuple — ordered 4 Fruity Blast
 * (Orange / Mango / Watermelon / Strawberry) → 2 Desi & Cool
 * (Jaljeera / ORS Electrolyte) → 2 Premium Sports (Japanese Matcha /
 * Coffee). This is NOT random — SEO + testability demand determinism.
 * `tests/e2e/flavor-teaser.spec.ts` FT6 enforces that a cold reload
 * returns the identical ordering.
 *
 * The scroller is keyboard-accessible: `tabIndex={0}` + the arrow
 * buttons both work (WCAG 2.1.1).
 *
 * Copy uses "caffeinated" NOT the forbidden stimulant-beverage phrase —
 * the Phase 1 CI grep gate (`npm run grep:ci`) catches regressions.
 *
 * Reuses `<FlavorCard>` from Wave 1 — no teaser-only fork (RESEARCH §9).
 *
 * Phase 3 Plan 03 Task 1 — Section-level entrance (D3-11).
 * The two Containers (heading + scroller) are wrapped in a single
 * `<m.section>` with `whileInView` fade+slide (opacity 0 → 1 + y 32 → 0,
 * 0.6s, ease [0.2, 0, 0.2, 1], once, margin -10% 0px). Individual cards
 * do NOT stagger — section-level entrance only (D3-11 locked).
 *
 * The motion wrapper sits INSIDE the semantic `<Section>` (not around
 * it) so Section's `pt-*` layout classes stay on the outer layout
 * element and the `<m.section>` is purely a motion wrapper. The
 * horizontal scroll-snap region is OUTSIDE/below any transform parent
 * only in render terms — the touch physics attach to `scrollerRef`
 * which never gets a motion transform applied to it, so native
 * swipe/snap are byte-identical to Phase 2 (D2-10 preserved).
 *
 * Tailwind `motion-reduce:!transform-none motion-reduce:!opacity-100`
 * on the `<m.section>` collapses the entrance to final-state
 * immediately for reduced-motion users (D3-16; same pattern as the
 * HowItWorks per-step `<m.li>`).
 */

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

const curated: Flavor[] = TEASER_HANDLES.map((h) =>
  flavors.find((f) => f.handle === h),
).filter((f): f is Flavor => f !== undefined);

// Tile widths: mobile shows ~1.4 cards (70%); sm shows ~2.4 (42%);
// lg shows ~5 cards (19%) — slightly smaller than before so more of
// the catalog is visible per scroll frame.
const TILE_CLS =
  'snap-start shrink-0 basis-[70%] sm:basis-[42%] md:basis-[32%] lg:basis-[19%]';

export function FlavorTeaser() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // 1-px tolerances absorb sub-pixel scroll positions in various engines
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollBy = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Pan by ~80% of the visible viewport so a few cards shift per click
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  }, []);

  return (
    <Section className="pt-8 sm:pt-12 md:pt-16" background="bg">
      <m.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]">
            Pick your flavor.
          </h2>
          <p className="mt-3 max-w-[48ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
            Sixteen caps, three ranges. Fruity, desi, caffeinated.
          </p>
        </Container>

        {/*
          Scroll region contained inside the SAME Container as the heading
          so left/right gutters align exactly. Arrow buttons sit in the
          padding gutter on desktop.
        */}
        <Container className="relative mt-6">
        <div
          ref={scrollerRef}
          role="region"
          aria-label="Flavor teaser"
          tabIndex={0}
          className="snap-x snap-mandatory scroll-smooth overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
        >
          <ul className="flex gap-4 pb-4 sm:gap-5 lg:gap-6 [&::-webkit-scrollbar]:hidden">
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

        {/* Scroll arrows — desktop only; disabled at scroll boundaries */}
        <button
          type="button"
          aria-label="Scroll flavors left"
          onClick={() => scrollBy(-1)}
          disabled={atStart}
          className="pointer-events-auto absolute top-1/2 left-1 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-brand-cream)] text-[color:var(--color-brand-deep)] shadow-[0_6px_20px_-4px_rgba(89,69,69,0.3)] ring-1 ring-[color:var(--color-border)] transition-all hover:bg-[color:var(--color-brand-rose)] hover:text-[color:var(--color-brand-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)] disabled:pointer-events-none disabled:opacity-0 lg:flex dark:bg-[color:var(--color-surface)] dark:text-[color:var(--color-fg)] dark:ring-white/10"
        >
          <ChevronLeft size={20} strokeWidth={2.25} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Scroll flavors right"
          onClick={() => scrollBy(1)}
          disabled={atEnd}
          className="pointer-events-auto absolute top-1/2 right-1 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--color-brand-cream)] text-[color:var(--color-brand-deep)] shadow-[0_6px_20px_-4px_rgba(89,69,69,0.3)] ring-1 ring-[color:var(--color-border)] transition-all hover:bg-[color:var(--color-brand-rose)] hover:text-[color:var(--color-brand-cream)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)] disabled:pointer-events-none disabled:opacity-0 lg:flex dark:bg-[color:var(--color-surface)] dark:text-[color:var(--color-fg)] dark:ring-white/10"
        >
          <ChevronRight size={20} strokeWidth={2.25} aria-hidden="true" />
        </button>
        </Container>
      </m.section>
    </Section>
  );
}
