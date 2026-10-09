import { Hero } from '@/sections/Hero';

/**
 * Phase 1 Plan 02 — HomePage body is the Hero section.
 *
 * The `<main id="main">` landmark lives INSIDE `<Hero>` (promoted from the
 * Hero's outer wrapper) so the skip-link still resolves and the Hero's
 * section is the first announced content.
 *
 * No scroll-reset helper component — Phase 1 has a single scrollable
 * section so no scroll-reset state exists. Future phases will introduce
 * multi-section scroll handling when there is more than one section to
 * scroll.
 */
export default function HomePage() {
  return <Hero />;
}
