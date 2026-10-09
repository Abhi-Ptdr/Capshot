import Container from '@/components/primitives/Container';
import { Image } from '@/components/primitives/Image';
import { PrimaryCTA } from '@/components/ui/PrimaryCTA';

/**
 * Phase 1 Plan 02 — Hero (UI-SPEC §Component 4).
 *
 * The <main> landmark lives HERE (promoted from the HomePage wrapper) so
 * the skip-link's #main target still works and the H1 is the first element
 * announced after the skip. Phase 2 adds subsequent sections BELOW this
 * <main>; Hero stays the only 100dvh section.
 *
 * Viewport sizing:
 *   min-height: 100vh   (fallback)
 *   min-height: 100dvh  (modern iOS Safari + Chrome Android)
 * The CSS cascade order means older browsers use the first line and modern
 * browsers use the second — PITFALL #4 (iOS 100vh crop) is mitigated.
 *
 * Hinglish headline is CONTEXT D-05 locked. BOOM is wrapped in a span with
 * a brand-rose underline (UI-SPEC §Typography "underline treatment" decision).
 * Sub-copy is CONTEXT D-06 locked, max-w-28ch so it wraps to 2 lines on 360.
 *
 * The content layout is a 3-row flex column: image band → text stack → CTA.
 * `justify-between` + `min-h-[calc(100dvh-56px)]` on the inner column keep
 * the CTA pinned near the bottom while the image breathes at the top; at
 * 360×640 (nav 56 px subtracted = 584 usable) this fits with cushion per the
 * UI-SPEC vertical-rhythm calculation.
 */

export function Hero() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative min-h-screen min-h-[100dvh]"
    >
      <title>CAPSHOT — Twist karo. Shake karo. BOOM.</title>
      <meta
        name="description"
        content="Pre-filled flavor powder caps that twist onto any 28mm water bottle. Twist, shake, boom — drink ready. Join the India waitlist on WhatsApp."
      />
      <section
        aria-labelledby="hero-title"
        className="relative min-h-screen min-h-[100dvh] px-4 pt-14 pb-[calc(env(safe-area-inset-bottom)+1rem)] sm:pt-16"
      >
        <Container>
          <div className="mx-auto flex min-h-[calc(100dvh-56px)] max-w-md flex-col items-center justify-between gap-6 pt-6 pb-4">
            {/* Product image band — 3:4 portrait on a soft surface card */}
            <div className="flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg bg-[color:var(--color-surface)]">
              <Image
                src="/hero/cap-on-bottle.jpg"
                alt="A CAPSHOT flavor cap twisted onto a standard water bottle."
                width={800}
                height={1067}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            {/* Text stack */}
            <div className="flex w-full flex-col items-center gap-4">
              <h1
                id="hero-title"
                className="text-center text-[36px] leading-[1.05] font-bold tracking-[-0.02em] text-[color:var(--color-fg)] sm:text-[56px] lg:text-[72px]"
              >
                Twist karo. Shake karo.{' '}
                <span className="underline decoration-[color:var(--color-brand-rose)] decoration-[3px] underline-offset-4">
                  BOOM
                </span>
                .
              </h1>
              <p className="max-w-[28ch] text-center text-[18px] leading-[1.45] text-[color:var(--color-fg-muted)] sm:text-[20px]">
                Pre-filled flavor caps for any bottle.
              </p>
            </div>

            {/* Primary CTA — 56 px tall per HERO-02 */}
            <PrimaryCTA size="lg" className="w-full sm:w-auto" />
          </div>
        </Container>
      </section>
    </main>
  );
}
