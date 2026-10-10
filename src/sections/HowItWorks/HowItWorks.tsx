import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';

/**
 * Phase 2 Plan 02 — How It Works section (HOW-01).
 *
 * Phase 3 Plan 02 — Per-step `<m.li>` stagger (D3-06, D3-07):
 *   - Right-column wrapper demoted from `m.div` to plain `<div>` (D3-08).
 *     The heading + eyebrow kicker inherit the surrounding viewport entry
 *     passively; only the 3 step list items animate on their own.
 *   - Each `<li>` becomes an `<m.li>` with `initial { opacity: 0, y: 16 }`
 *     → `whileInView { opacity: 1, y: 0 }`, duration 0.5s, ease
 *     [0.2, 0, 0.2, 1]. Per-item delays 0ms / 120ms / 240ms carry the
 *     01 → 02 → 03 beat progression (D3-10 Claude's-discretion default;
 *     Plan 03-03 manual-pass may tune to 0 / 150 / 300 ms).
 *   - Video card entrance (left column) is UNCHANGED — D3-09 locks the
 *     Phase 2 block `m.div whileInView` config to protect the Phase 2
 *     video UAT.
 *   - Tailwind `motion-reduce:!transform-none motion-reduce:!opacity-100`
 *     fallback carries forward from the block `m.div` to each `m.li`
 *     verbatim (and stays on the video card wrapper).
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
 * Entrance animation: Motion `whileInView` fade+slide. Video card uses
 * (opacity 0→1, y 24→0, 0.5s) wrapper block; right-column steps each
 * use (opacity 0→1, y 16→0, 0.5s, per-step delay). Fires once per
 * element. Reduced-motion skips entrances via Tailwind utilities.
 */

const STEPS = [
  {
    num: '01',
    label: 'Twist',
    body: 'Secure the cap onto any 28 mm bottle.',
    delay: 0,
  },
  {
    num: '02',
    label: 'Shake',
    body: 'Powder dissolves in 5 seconds.',
    delay: 0.12,
  },
  {
    num: '03',
    label: 'Boom',
    body: 'Flavor-forward drink, ready.',
    delay: 0.24,
  },
] as const;

export function HowItWorks() {
  return (
    <Section
      background="bg"
      className={[
        // Inverted theme vs the rest of the page: in light mode the
        // section bg is brand-deep (dark) with cream text; in dark mode
        // it's cream with brand-deep text. Achieved by overriding the
        // three semantic CSS variables locally — every descendant that
        // reads --color-bg / --color-fg / --color-fg-muted picks up the
        // flipped values automatically (Section's own bg too).
        '[--color-bg:var(--color-brand-deep)]',
        '[--color-fg:var(--color-brand-cream)]',
        '[--color-fg-muted:rgb(255_248_234_/_0.72)]',
        'dark:[--color-bg:var(--color-brand-cream)]',
        'dark:[--color-fg:var(--color-brand-deep)]',
        'dark:[--color-fg-muted:rgb(89_69_69_/_0.68)]',
        'pt-8 pb-16 sm:pt-12 md:pt-16 lg:pt-20 lg:pb-24',
      ].join(' ')}
    >
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

          {/*
            RIGHT (desktop) / ABOVE (mobile) — heading + 3-step bullet
            list. Wrapper is a plain `<div>` (D3-08). Each step inside
            the <ol> is its own `<m.li>` with per-item delay to produce
            the 01 → 02 → 03 beat progression.
          */}
          <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">
            {/*
              Eyebrow kicker — uses --color-fg so it inherits the
              section's inverted theme (cream text on brand-deep section
              in light mode; brand-deep text on cream section in dark).
            */}
            <p className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-brand-rose)]/20 px-3 py-1 text-[11px] font-bold tracking-[0.2em] text-[color:var(--color-fg)] uppercase ring-1 ring-[color:var(--color-brand-rose)]/40 sm:text-xs">
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
              {STEPS.map(({ num, label, body, delay }) => (
                <m.li
                  key={num}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{
                    duration: 0.5,
                    delay,
                    ease: [0.2, 0, 0.2, 1],
                  }}
                  className="flex items-start gap-4 text-left motion-reduce:!transform-none motion-reduce:!opacity-100 sm:gap-5"
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
                </m.li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
