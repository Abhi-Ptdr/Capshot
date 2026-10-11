import { Link } from 'react-router';
import Container from '@/components/primitives/Container';
import { Image } from '@/components/primitives/Image';
import { PrimaryCTA } from '@/components/ui/PrimaryCTA';

/**
 * Phase 1 Plan 02 — Hero (UI-SPEC §Component 4).
 *
 * Layout rules:
 *   - Mobile (default): single column, text FIRST (eyebrow → H1 → sub-copy →
 *     CTAs → trust strip), product image renders BELOW the fold. Text-first
 *     keeps the CTA above fold on 360×640 (HERO-01 criterion #2).
 *   - Desktop (lg+): 2-column grid. Text left, product right with an ambient
 *     brand-rose halo behind the image card.
 *
 * Viewport sizing:
 *   min-height: 100vh   (fallback)
 *   min-height: 100dvh  (modern iOS Safari + Chrome Android)
 * Cascade order means older browsers use the first line and modern browsers
 * use the second — PITFALL #4 (iOS 100vh crop) is mitigated.
 *
 * Hinglish headline is CONTEXT D-05 locked. BOOM is wrapped in a span with a
 * brand-rose underline (UI-SPEC §Typography underline treatment). Sub-copy is
 * CONTEXT D-06 locked.
 *
 * Phase 2 Plan 02 — The homepage main landmark moved OUT of this
 * component and UP into HomePage so Hero + HowItWorks + FlavorTeaser
 * share one landmark (and the skip-link lands on the whole homepage, not
 * just the Hero). The Hero's root is now a plain div carrying the
 * min-h-[100dvh] sizing; the inner section with aria-labelledby="hero-title"
 * is the Hero's semantic landmark and the Playwright H5/H6 target.
 */

export function Hero() {
  return (
    <div className="relative min-h-screen min-h-[100dvh]">
      <title>CAPSHOT — Twist karo. Shake karo. BOOM.</title>
      <meta
        name="description"
        content="Pre-filled flavor powder caps that twist onto any 28mm water bottle. Twist, shake, boom — drink ready. Join the India waitlist on WhatsApp."
      />

      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden px-4 pt-20 pb-[calc(env(safe-area-inset-bottom)+2rem)] sm:px-6 sm:pt-24 lg:px-8 lg:pt-28 lg:pb-24"
      >
        {/*
          Decorative background layer. Three soft radial glows + a subtle
          cream-to-warm gradient give the section depth without any image
          or JS. All elements are pointer-events-none and aria-hidden.
          The vertical gradient uses var(--color-brand-cream) at both ends
          with a hint of brand-rose in between so dark mode stays coherent.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[color:var(--color-bg)] via-[color:var(--color-brand-rose)]/5 to-[color:var(--color-bg)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 -left-24 -z-10 h-[520px] w-[520px] rounded-full bg-[color:var(--color-brand-rose)] opacity-20 blur-3xl sm:h-[640px] sm:w-[640px] dark:opacity-25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -bottom-40 -z-10 hidden h-[560px] w-[560px] rounded-full bg-[color:var(--color-brand-mid)] opacity-15 blur-3xl lg:block dark:opacity-20"
        />

        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-24">
            {/* LEFT — text stack (DOM-first so CTA is above fold on 360×640) */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              {/* Eyebrow kicker — small cream pill in brand-mid for presence */}
              <p className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-rose)]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--color-brand-mid)] ring-1 ring-[color:var(--color-brand-rose)]/25 sm:text-xs dark:bg-[color:var(--color-brand-rose)]/20 dark:text-[color:var(--color-fg)] dark:ring-[color:var(--color-brand-rose)]/40">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-rose)]"
                />
                Pre-filled flavor caps
              </p>

              {/* H1 — EXACT CONTEXT D-05 text; <span>BOOM</span> gets the brand-rose underline */}
              <h1
                id="hero-title"
                className="mt-5 text-[40px] leading-[1.02] font-bold tracking-[-0.02em] text-balance text-[color:var(--color-fg)] sm:text-[64px] lg:text-[80px] xl:text-[96px]"
              >
                Twist karo. Shake karo.{' '}
                <span className="underline decoration-[color:var(--color-brand-rose)] decoration-[4px] underline-offset-[6px] sm:decoration-[6px] sm:underline-offset-[8px] lg:decoration-[8px]">
                  BOOM
                </span>
                .
              </h1>

              {/*
                Sub-copy — EXACT CONTEXT D-06 text. Uses --color-fg (not
                fg-muted) so the primary value prop keeps full brand-deep
                punch on cream; fg-muted felt faded in light mode.
              */}
              <p className="mt-5 max-w-[34ch] text-[18px] leading-[1.5] font-medium text-[color:var(--color-fg)] sm:text-[20px] lg:mt-7 lg:text-[22px]">
                Pre-filled flavor caps for any bottle.
              </p>

              {/* CTAs — primary + secondary */}
              <div className="mt-8 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:gap-7 lg:mt-10">
                <PrimaryCTA size="lg" className="w-full sm:w-auto" />
                <Link
                  to="/flavors"
                  data-cta="cta_hero_see_flavors"
                  className="group inline-flex items-center gap-1.5 rounded text-[15px] font-semibold tracking-wide text-[color:var(--color-fg-muted)] transition-colors hover:text-[color:var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-ring)]"
                >
                  See all flavors
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  >
                    →
                  </span>
                </Link>
              </div>

              {/* Trust strip — three honest claims; FSSAI-compliant copy (no stimulant-beverage phrasing). */}
              <p className="mt-7 text-[13px] text-[color:var(--color-fg-muted)] sm:text-sm lg:mt-8">
                No prep <span aria-hidden="true">·</span> Pocket sized{' '}
                <span aria-hidden="true">·</span> Made in India
              </p>
            </div>

            {/* RIGHT — product image with ambient brand-rose halo */}
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-none">
              {/* Ambient halo (decorative) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
              >
                <div className="h-[82%] w-[82%] rounded-full bg-[color:var(--color-brand-rose)] opacity-25 blur-3xl dark:opacity-30" />
              </div>

              {/* Image card */}
              <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--color-surface)] shadow-[0_18px_50px_-12px_rgba(89,69,69,0.22)] ring-1 ring-[color:var(--color-border)]">
                <Image
                  src="/hero/cap-on-bottle.jpg"
                  alt="A CAPSHOT flavor cap twisted onto a standard water bottle."
                  width={800}
                  height={1067}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
