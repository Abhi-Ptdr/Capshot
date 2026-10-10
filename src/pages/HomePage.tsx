import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks';
import { UspComparison } from '@/sections/UspComparison';
import { FlavorTeaser } from '@/sections/FlavorTeaser';

/**
 * Phase 2 Plan 02 — HomePage composition (RESEARCH §1).
 *
 * The `<main id="main">` landmark lives HERE (was inside <Hero> in
 * Phase 1); Hero, HowItWorks, and FlavorTeaser all share this landmark
 * so the skip-link lands on the whole homepage body rather than only
 * the Hero. Hero's root is now a plain <div> with the min-h-[100dvh]
 * sizing; its inner <section aria-labelledby="hero-title"> is still
 * the Hero's semantic container (and the Playwright H5/H6 target).
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
      <FlavorTeaser />
    </main>
  );
}
