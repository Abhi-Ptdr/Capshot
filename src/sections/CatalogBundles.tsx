// H2 copy choice: short English imperative paired with the brand name —
// a one-line directive heading over the two-step narrative (flavors →
// packs); Hinglish is reserved for the per-step eyebrows below. If a
// visual review wants a Hinglish variant, swap to "Apna CAPSHOT chuno."
// as a one-line change at the H2 literal below.
//
// GAP-02 (2026-10-11 UAT, approach (a)): explicit numbered step markers
// ("01" above the flavor scroller and "02" above the bundles tri-card lane)
// scaffold the two-step narrative so the sub-sections no longer read as
// three independent headings. FlavorTeaser remains byte-identical per
// D3.1-05a; Bundles' internal eyebrow+H3 band is removed in Plan 06 Task 2
// so the parent step marker is the sole step-2 scaffolding.
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
 * D3.1-05a locks FlavorTeaser as byte-identical — only its parent in
 * `src/pages/HomePage.tsx` changes. The existing
 * `tests/e2e/flavor-teaser.spec.ts` FT1–FT6 + FT-P3-1/FT-P3-2 contracts
 * MUST all pass unchanged after relocation.
 *
 * Section-level motion entrance applies ONLY to the heading band
 * (D3.1-11 — section-level entrance only, no stagger). FlavorTeaser
 * carries its own motion wrapper; Bundles carries its own.
 *
 * Step markers (GAP-02): the two numbered step scaffolds (01 above the
 * flavor scroller, 02 above the bundles lane) are plain <div>s (NOT
 * wrapped in <m.div>) — section-level entrance only (D3.1-11); the
 * parent heading band's motion wrapper already fades in the whole stack
 * as the catalog section scrolls into view.
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
        <Container className="pt-8 sm:pt-12 md:pt-16">
          <p className="text-sm font-bold tracking-wider text-[color:var(--color-brand-rose)] uppercase">
            Flavor + pack
          </p>
          <h2
            id="catalog-heading"
            className="mt-2 text-[28px] font-bold tracking-tight sm:text-[36px]"
          >
            Pick your CAPSHOT.
          </h2>
          <p className="mt-3 max-w-[52ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
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
        section-level-entrance-only; the heading band's <m.div> already
        fades the whole stack in on scroll.
      */}
      <Container>
        <div data-step="1" className="mt-10 flex items-center gap-3 sm:mt-12">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-brand-rose)] text-sm font-bold text-[color:var(--color-brand-cream)]"
          >
            01
          </span>
          <span className="text-sm font-bold tracking-wider text-[color:var(--color-brand-rose)] uppercase">
            Step 1 — Pick your flavor
          </span>
        </div>
      </Container>

      <FlavorTeaser />

      {/*
        GAP-02 Step 2 scaffold — sits above Bundles as its immediate previous
        sibling. Pairs with the Step 1 scaffold above FlavorTeaser so the
        catalog section reads as a two-step flow (01 → 02) under the shared
        H2. Plan 06 Task 2 removes Bundles' internal eyebrow+H3 band so this
        is the sole "Step 2" scaffolding.
      */}
      <Container>
        <div data-step="2" className="mt-10 flex items-center gap-3 sm:mt-12">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-brand-rose)] text-sm font-bold text-[color:var(--color-brand-cream)]"
          >
            02
          </span>
          <span className="text-sm font-bold tracking-wider text-[color:var(--color-brand-rose)] uppercase">
            Step 2 — Pick your pack
          </span>
        </div>
      </Container>

      <Bundles />
    </section>
  );
}
