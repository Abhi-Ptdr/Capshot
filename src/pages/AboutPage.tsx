import AboutIdea from '@/sections/about/AboutIdea';
import AboutFounder from '@/sections/about/AboutFounder';
import AboutWhy from '@/sections/about/AboutWhy';
import AboutHowWeThink from '@/sections/about/AboutHowWeThink';
import AboutClose from '@/sections/about/AboutClose';

/**
 * Phase 3.2 Plan 03 composition — replaces the Phase 1 coming-soon shell with
 * the 5-section scroll narrative. Section order is locked by ROADMAP SC1.
 * Per-route SEO/OG lands in Phase 5; `<title>` preserved from Phase 1.
 */
export default function AboutPage() {
  return (
    <>
      <title>About — CAPSHOT</title>
      <main id="main" tabIndex={-1}>
        <AboutIdea />
        <AboutFounder />
        <AboutWhy />
        <AboutHowWeThink />
        <AboutClose />
      </main>
    </>
  );
}
