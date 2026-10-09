import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';

/**
 * Phase 2 Plan 02 — How It Works section (HOW-01).
 *
 * Layout: 2-column at lg+ (video left, copy right); stacked on mobile
 * (video on top, copy below). Video is a short muted autoplay-loop MP4
 * showing the full twist → shake → BOOM action in 2.5 seconds. Copy
 * is a 3-step numbered list that labels each visible beat.
 *
 * Video asset: `public/how-it-works/capshot-demo.mp4` (214 KB, 406×720,
 * 30fps, no audio) — spliced from the client's demo footage with the
 * branded "TWIST + SHAKE = BOOM!" text overlay and model close-ups cut
 * out. Loops seamlessly. Poster = `capshot-demo-poster.jpg` (27 KB) —
 * also serves as the reduced-motion fallback since autoplay is
 * suppressed when the user has `prefers-reduced-motion: reduce`.
 *
 * Autoplay rules: `muted` + `playsinline` are mandatory for mobile
 * Safari to allow silent autoplay without going fullscreen; `loop` makes
 * it behave like a GIF. `preload="metadata"` keeps the initial page
 * weight small — only the first keyframe is fetched until the section
 * enters the viewport.
 *
 * Entrance animation: Motion `whileInView` fade+slide (opacity 0→1,
 * y 24→0, 0.5s). Fires once per element. Reduced-motion skips entrance.
 */

const STEPS = [
  {
    num: '01',
    label: 'Twist',
    body: 'Secure the cap onto any 28 mm bottle.',
  },
  {
    num: '02',
    label: 'Shake',
    body: 'Powder dissolves in 5 seconds.',
  },
  {
    num: '03',
    label: 'Boom',
    body: 'Flavor-forward drink, ready.',
  },
] as const;

export function HowItWorks() {
  return (
    <Section className="pt-8 pb-16 sm:pt-12 md:pt-16 lg:pt-20 lg:pb-24" background="bg">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-14 xl:gap-20">
          {/*
            LEFT (desktop) / BELOW (mobile) — looping demo video.
            Mobile order flips via CSS `order` so text + 3 steps read
            first above the fold on 360-wide; desktop keeps video left.
          */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }}
            className="relative order-2 mx-auto w-full max-w-[220px] motion-reduce:!transform-none motion-reduce:!opacity-100 sm:max-w-[240px] lg:order-1 lg:mx-0 lg:max-w-[260px] xl:max-w-[280px]"
          >
            {/* Soft brand-rose halo behind the video card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
            >
              <div className="h-[80%] w-[80%] rounded-full bg-[color:var(--color-brand-rose)] opacity-20 blur-3xl dark:opacity-25" />
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-[color:var(--color-brand-cream)] shadow-[0_18px_50px_-12px_rgba(89,69,69,0.25)] ring-1 ring-[color:var(--color-brand-rose)]/20 dark:bg-[color:var(--color-brand-deep)] dark:ring-[color:var(--color-brand-rose)]/35">
              <video
                className="block aspect-[9/16] h-auto w-full object-cover"
                src="/how-it-works/capshot-demo.mp4"
                poster="/how-it-works/capshot-demo-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="A CAPSHOT flavor cap being twisted onto a water bottle, shaken, and the resulting drink"
              >
                {/* Fallback for browsers without MP4 support (none in 2026 but harmless) */}
                <track kind="descriptions" srcLang="en" label="Demo description" />
              </video>
            </div>
          </m.div>

          {/* RIGHT (desktop) / ABOVE (mobile) — heading + 3-step bullet list */}
          <m.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.2, 0, 0.2, 1],
            }}
            className="order-1 flex flex-col items-center text-center motion-reduce:!transform-none motion-reduce:!opacity-100 lg:order-2 lg:items-start lg:text-left"
          >
            {/* Eyebrow kicker — matches Hero's pill style */}
            <p className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-rose)]/15 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-brand-mid)] uppercase ring-1 ring-[color:var(--color-brand-rose)]/30 sm:text-xs dark:bg-[color:var(--color-brand-rose)]/25 dark:text-[color:var(--color-fg)] dark:ring-[color:var(--color-brand-rose)]/50">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-brand-rose)]"
              />
              Three steps
            </p>

            {/* Heading */}
            <h2 className="mt-5 text-[32px] leading-[1.1] font-bold tracking-[-0.01em] text-[color:var(--color-fg)] sm:text-[40px] lg:text-[48px] xl:text-[56px]">
              How CAPSHOT works
            </h2>

            {/* 3-step list — numbered big step, label, body */}
            <ol className="mt-8 flex w-full flex-col gap-6 sm:gap-7">
              {STEPS.map(({ num, label, body }) => (
                <li
                  key={num}
                  className="flex items-start gap-4 text-left sm:gap-5"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[22px] leading-none font-black tracking-tight text-[color:var(--color-brand-rose)] tabular-nums sm:text-[26px]"
                  >
                    {num}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[18px] font-bold tracking-[-0.01em] text-[color:var(--color-fg)] uppercase sm:text-[20px]">
                      {label}
                    </h3>
                    <p className="mt-1 text-[15px] leading-[1.5] text-[color:var(--color-fg-muted)] sm:text-base">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </m.div>
        </div>
      </Container>
    </Section>
  );
}
