// H2 copy choice: short English imperative paired with the brand name —
// a one-line directive heading over the two-step narrative (flavors →
// packs); Hinglish is reserved for the per-step eyebrows below. If a
// visual review wants a Hinglish variant, swap to "Apna CAPSHOT chuno."
// as a one-line change at the H2 literal below.
//
// GAP-02 (2026-10-11 UAT, approach (a)): explicit numbered step markers
// ("01" above the flavor scroller and "02" above the bundles tri-card lane)
// scaffold the two-step narrative so the sub-sections no longer read as
// three independent headings. Second pass (same day, user direction):
// FlavorTeaser's inline H2 + intro paragraph collapsed into the Step 1
// scaffold here — supersedes D3.1-05a byte-identical lock. Bundles'
// internal eyebrow+H3 band likewise removed in Plan 06 Task 2.
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import { FlavorTeaser } from '@/sections/FlavorTeaser';
import { Bundles } from '@/sections/Bundles';

/**
 * Phase 3.1 Plan 03 Task 2 — Section 4 wrapper (CATALOG-01 / D3.1-05 /
 * D3.1-05a). Phase 3.1 Plan 06 — adds GAP-02 step markers.
 *
 * Combines the Phase 2 FlavorTeaser (the flavor-choice step) and the new
 * Phase 3.1 Bundles tri-card lane (the pack-choice step) under one shared
 * H2 heading band so the visitor reads a single two-step narrative: pick
 * a flavor, then pick a pack.
 *
 * CRITICAL — Pitfall 5 (RESEARCH §Pitfall 5 + PATTERNS §CatalogBundles
 * Gotchas): the root MUST be a plain `<section aria-labelledby>`, NOT the
 * `<Section>` primitive. FlavorTeaser already brings its own `<Section>`
 * wrapper (`src/sections/FlavorTeaser.tsx` line 116) and Bundles likewise
 * brings its own in `src/sections/Bundles.tsx`. Wrapping this component
 * in the `<Section>` primitive would double the `py-8 sm:py-12 md:py-16`
 * padding of EITHER child, breaking vertical rhythm.
 *
 * D3.1-05a (SUPERSEDED 2026-10-11): FlavorTeaser was byte-identical for
 * Plan 03, then updated to collapse its inline H2 + intro paragraph into
 * the Step 1 scaffold below per user direction. The behavioural contracts
 * in `tests/e2e/flavor-teaser.spec.ts` (FT1–FT6 + FT-P3-1/FT-P3-2) still
 * all pass — they target the scroll region, 8 curated cards, "See all"
 * tile, scroll-snap CSS, and motion wrapper, not the inline heading.
 *
 * Section-level motion entrance applies ONLY to the heading band
 * (D3.1-11 — section-level entrance only, no stagger). FlavorTeaser
 * carries its own motion wrapper; Bundles carries its own.
 *
 * Step markers (GAP-02): the two numbered step scaffolds (01 above the
 * flavor scroller, 02 above the bundles lane) are plain <div>s (NOT
 * wrapped in <m.div>) — section-level entrance only (D3.1-11). The
 * heading-band <m.div> only wraps the <Container> that holds the H2 +
 * intro paragraph; the step-marker <div>s are sibling elements OUTSIDE
 * that wrapper, so they render at final position without an entrance.
 * FlavorTeaser and Bundles below each carry their own <m.div> wrapper
 * for the per-sub-section entrance.
 */
export function CatalogBundles() {
  return (
    <section aria-labelledby="catalog-heading">
      {/*
        WR-07: motion wrapper is a <m.div>, NOT <m.section>, so it doesn't
        pollute the a11y landmark tree. The outer <section
        aria-labelledby="catalog-heading"> is the sole semantic landmark
        for the two-step narrative; FlavorTeaser + Bundles render inside
        it as plain <div> siblings (see their internal `<Section as="div">`
        wrappers).
      */}
      <m.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container className="pt-8 text-center sm:pt-12 md:pt-16">
          <h2
            id="catalog-heading"
            className="text-[28px] font-bold tracking-tight sm:text-[36px]"
          >
            Pick your CAPSHOT.
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
            Two steps. Pick a flavor you'll actually drink, then pick a pack
            that matches how often you'll use it.
          </p>
        </Container>
      </m.div>

      {/*
        GAP-02 Step 1 scaffold — sits above FlavorTeaser as its immediate
        previous sibling so the two sub-sections read as explicit steps of
        one flow instead of three stacked bold headings. The circled badge
        is decorative (aria-hidden); the label text carries the semantic
        "Step 1" signal for screen readers. No motion wrapper — D3.1-11
        section-level-entrance-only. The step markers render at final
        position without an entrance; FlavorTeaser's and Bundles' own
        motion wrappers below cover the per-sub-section entrance.

        WR-01 (iteration 3 fix): step-label text uses --color-fg (not
        --color-brand-rose). In dark mode brand-rose (#9E7676) on bg
        (#594545) is ~2.28:1, below the WCAG AA 3:1 large-text floor.
        --color-fg resolves to brand-deep in light and brand-cream in
        dark (see src/index.css lines 19 + 65), passing AA in both
        modes. The brand-rose accent is still carried visually by the
        pill next to the label.
      */}
      <Container>
        <div data-step="1" className="mt-10 flex items-center gap-3 sm:mt-12">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-brand-rose)] text-sm font-bold text-[color:var(--color-brand-cream)]"
          >
            01
          </span>
          <span className="text-sm font-bold tracking-wider text-[color:var(--color-fg)] uppercase">
            Step 1 — Pick your flavor
          </span>
        </div>
        <p className="mt-3 max-w-[48ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
          Sixteen caps, three ranges. Fruity, desi, caffeinated.
        </p>
      </Container>

      <FlavorTeaser />

      {/*
        GAP-02 Step 2 scaffold — sits above Bundles as its immediate previous
        sibling. Pairs with the Step 1 scaffold above FlavorTeaser so the
        catalog section reads as a two-step flow (01 → 02) under the shared
        H2. Plan 06 Task 2 removes Bundles' internal eyebrow+H3 band so this
        is the sole "Step 2" scaffolding.

        WR-01 (iteration 3 fix): step-label text uses --color-fg for AA
        compliance in both light and dark modes. See the Step 1 scaffold
        comment above for the full rationale.
      */}
      <Container>
        <div data-step="2" className="mt-10 flex items-center gap-3 sm:mt-12">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-brand-rose)] text-sm font-bold text-[color:var(--color-brand-cream)]"
          >
            02
          </span>
          <span className="text-sm font-bold tracking-wider text-[color:var(--color-fg)] uppercase">
            Step 2 — Pick your pack
          </span>
        </div>
      </Container>

      <Bundles />
    </section>
  );
}
