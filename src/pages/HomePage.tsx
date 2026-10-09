import Section from '@/components/primitives/Section';
import Container from '@/components/primitives/Container';

/**
 * Phase 1 Plan 01: minimal coming-soon shell for `/`. Plan 02 replaces this
 * body with the full `<Hero>` (product shot + Hinglish H1 + sub-copy + real
 * PrimaryCTA). The route file path is stable — only the body changes.
 *
 * React 19 hoists `<title>` from any component into `<head>`, so this per-
 * route title is enough for Phase 1. Phase 5 switches to `@unhead/react`
 * for per-route OG/Twitter/canonical tags once there's real content.
 */
export default function HomePage() {
  return (
    <>
      <title>CAPSHOT — Twist karo. Shake karo. BOOM.</title>
      <main id="main" tabIndex={-1}>
        <Section>
          <Container>
            <h1 className="text-4xl font-bold">CAPSHOT</h1>
            <p className="mt-4 text-[color:var(--color-fg-muted)]">
              Twist karo. Shake karo. BOOM. (Hero landing in Plan 02)
            </p>
          </Container>
        </Section>
      </main>
    </>
  );
}
