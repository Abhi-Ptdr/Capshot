import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import {
  aboutCollage,
  aboutTwist,
  aboutShake,
  aboutBoom,
} from '@/data/about-assets';

/**
 * Phase 3.2 D3.2-05 — Section 3 dual-band (bg → surface).
 * D3.2-07 — Real client assets for Twist/Shake/Boom; captions
 * '1. TWIST / 2. SHAKE / 3. BOOM' locked verbatim.
 */

const steps = [
  { image: aboutTwist, caption: '1. TWIST' },
  { image: aboutShake, caption: '2. SHAKE' },
  { image: aboutBoom, caption: '3. BOOM' },
] as const;

export default function AboutWhy() {
  return (
    <>
      <Section background="bg" id="why">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
              WHY WE CREATED IT
            </p>
            <h2 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[36px] md:text-[44px]">
              Water is essential. Plain is boring.
            </h2>
            <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg max-w-[52ch]">
              Everyone knows they should drink more water. But sip after sip of
              plain water isn't a routine anyone sticks to. Most people reach
              for sugary bottled drinks instead — and the planet pays for every
              single empty bottle.
            </p>
            <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg max-w-[52ch]">
              We looked at the daily hydration hassle and asked: what if flavor
              was something you carried, not something you bought pre-mixed?
              That question is where CAPSHOT started.
            </p>
            <figure>
              <img
                src={aboutCollage.src}
                alt={aboutCollage.alt}
                width={aboutCollage.width}
                height={aboutCollage.height}
                loading="lazy"
                className="mt-8 w-full h-auto rounded-2xl"
              />
              <figcaption className="mt-3 text-sm text-[color:var(--color-fg-muted)]">
                The daily hydration hassle.
              </figcaption>
            </figure>
          </Container>
        </m.div>
      </Section>

      <Section background="surface" id="experience">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
              The Thinking Behind the Experience
            </p>
            <h2 className="mt-3 text-[24px] font-bold tracking-tight sm:text-[32px] md:text-[40px]">
              The twist-shake-boom experience.
            </h2>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {steps.map((step) => (
                <li key={step.caption} className="flex flex-col items-center text-center">
                  <img
                    src={step.image.src}
                    alt={step.image.alt}
                    width={240}
                    height={240}
                    loading="lazy"
                    className="w-full max-w-[240px] h-auto"
                  />
                  <p className="mt-3 text-sm font-bold tracking-wider uppercase">
                    {step.caption}
                  </p>
                </li>
              ))}
            </ul>
            <ul role="list" className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <li>
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-bg)] px-4 py-2 text-sm font-semibold ring-1 ring-[color:var(--color-border)]">
                  Natural Flavors
                </span>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-bg)] px-4 py-2 text-sm font-semibold ring-1 ring-[color:var(--color-border)]">
                  0% Mess 100% Fun
                </span>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-bg)] px-4 py-2 text-sm font-semibold ring-1 ring-[color:var(--color-border)]">
                  Eco-conscious &amp; Portable
                </span>
              </li>
            </ul>
          </Container>
        </m.div>
      </Section>
    </>
  );
}
