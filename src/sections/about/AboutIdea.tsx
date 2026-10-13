import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { aboutHero } from '@/data/about-assets';

/**
 * Phase 3.2 D3.2-05 — Section 1 renders TWO sibling <Section> bands
 * (bg → surface) per lock. Both bands count as "Section 1" for ROADMAP SC1.
 * Motion contract per D3.2-09: initial y:16, duration 0.5, ease easeOut.
 */

export default function AboutIdea() {
  return (
    <>
      <Section background="bg" id="idea" className="scroll-mt-20 sm:scroll-mt-24">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
              THE IDEA BEHIND CAPSHOT
            </p>
            <h1 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[36px] md:text-[44px]">
              Same water. Bigger moments.
            </h1>
            <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg max-w-[48ch]">
              CAPSHOT started with a simple belief — the water you drink every day
              shouldn't be boring. One tiny cap, one quick twist, and plain water
              becomes something you actually look forward to.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 mt-8">
              <img
                src={aboutHero.src}
                alt={aboutHero.alt}
                width={aboutHero.width}
                height={aboutHero.height}
                loading="eager"
                className="w-full h-auto rounded-2xl"
              />
              <ul className="mt-6 md:mt-0 flex flex-col gap-3 items-start">
                <li>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold ring-1 ring-[color:var(--color-border)]">
                    Mix tasty flavors
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold ring-1 ring-[color:var(--color-border)]">
                    Real-fruit flavor
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold ring-1 ring-[color:var(--color-border)]">
                    Supports hydration
                  </span>
                </li>
              </ul>
            </div>
          </Container>
        </m.div>
      </Section>

      <Section background="surface" id="big-picture">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
              THE BIG PICTURE
            </p>
            <h2 className="mt-3 text-[24px] font-bold tracking-tight sm:text-[32px] md:text-[40px]">
              More than just a drink. It's a better way to hydrate.
            </h2>
            <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg max-w-[52ch]">
              We built CAPSHOT so hydration fits your real life — flavor on demand,
              zero waste, carried in your pocket. One cap transforms any 28mm water
              bottle into a drink you'll actually finish.
            </p>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <li className="flex flex-col rounded-2xl bg-[color:var(--color-bg)] p-6 ring-1 ring-[color:var(--color-border)]">
                <h3 className="text-lg font-bold tracking-tight">Exciting Flavours</h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  16 flavors across 3 ranges — real-fruit, no boring aftertaste.
                </p>
              </li>
              <li className="flex flex-col rounded-2xl bg-[color:var(--color-bg)] p-6 ring-1 ring-[color:var(--color-border)]">
                <h3 className="text-lg font-bold tracking-tight">On-the-Go Convenience</h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  Twist, shake, drink. No measuring, no shakers, no mess.
                </p>
              </li>
              <li className="flex flex-col rounded-2xl bg-[color:var(--color-bg)] p-6 ring-1 ring-[color:var(--color-border)]">
                <h3 className="text-lg font-bold tracking-tight">Simple &amp; Fun</h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  A tiny cap. A big flavor moment. Hydration you'll actually look forward to.
                </p>
              </li>
              <li className="flex flex-col rounded-2xl bg-[color:var(--color-bg)] p-6 ring-1 ring-[color:var(--color-border)]">
                <h3 className="text-lg font-bold tracking-tight">Designed for Everyone</h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  Fits standard 28mm water bottles — your bottle, your flavor, your call.
                </p>
              </li>
            </ul>
          </Container>
        </m.div>
      </Section>
    </>
  );
}
