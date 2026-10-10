import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks';
import { UspComparison } from '@/sections/UspComparison';
import { CatalogBundles } from '@/sections/CatalogBundles';
import { TrustBadges } from '@/sections/TrustBadges';

/**
 * Phase 2 Plan 02 — HomePage composition (RESEARCH §1).
 *
 * The `<main id="main">` landmark lives HERE (was inside <Hero> in
 * Phase 1); Hero, HowItWorks, UspComparison, and the catalog section all
 * share this landmark so the skip-link lands on the whole homepage body
 * rather than only the Hero. Hero's root is now a plain <div> with the
 * min-h-[100dvh] sizing; its inner <section aria-labelledby="hero-title">
 * is still the Hero's semantic container (and the Playwright H5/H6 target).
 *
 * Phase 3.1 Plan 03 — the standalone FlavorTeaser was replaced with the
 * CatalogBundles section wrapper which hosts the (byte-identical)
 * FlavorTeaser as Step 1 under a shared H2 and adds the Bundles tri-card
 * lane as Step 2.
 *
 * Phase 3.1 Plan 04 — TrustBadges joins as the LAST section inside <main>
 * (D3.1-09). Final composition: Hero -> HowItWorks -> UspComparison ->
 * CatalogBundles -> TrustBadges. Phase 5 will insert a Footer as a sibling
 * AFTER </main> without touching the TrustBadges section.
 *
 * No scroll-reset helper component — the homepage is a single-direction
 * scroll from top to bottom; future phases can introduce multi-section
 * scroll-reset handling when the IA calls for it.
 */
export default function HomePage() {
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <HowItWorks />
      <UspComparison />
      <CatalogBundles />
      <TrustBadges />
    </main>
  );
}
