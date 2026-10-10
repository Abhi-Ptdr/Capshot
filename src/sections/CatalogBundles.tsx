// H2 copy choice: "Pick your CAPSHOT." — short imperative, English (not
// Hinglish) because this is the shared heading over a two-step narrative
// (flavors → packs); Hinglish is reserved for the per-step eyebrows below.
// If a visual review wants a Hinglish variant, swap to "Apna CAPSHOT chuno."
// as a one-line change.
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import { FlavorTeaser } from '@/sections/FlavorTeaser';
import { Bundles } from '@/sections/Bundles';

/**
 * Phase 3.1 Plan 03 Task 2 — Section 4 wrapper (CATALOG-01 / D3.1-05 /
 * D3.1-05a).
 *
 * Combines the Phase 2 FlavorTeaser (Step 1 — "Pick your flavor.") and
 * the new Phase 3.1 Bundles tri-card lane (Step 2 — "Pick your pack.")
 * under one shared H2 heading band so the visitor reads a single two-step
 * narrative: pick a flavor, then pick a pack.
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

      <FlavorTeaser />

      <Bundles />
    </section>
  );
}
