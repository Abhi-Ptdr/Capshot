import { Leaf, Sparkles, Globe } from 'lucide-react';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import {
  aboutCollage,
  aboutTwist,
  aboutShake,
  aboutBoom,
} from '@/data/about-assets';

const steps = [
  { image: aboutTwist, caption: '1. TWIST' },
  { image: aboutShake, caption: '2. SHAKE' },
  { image: aboutBoom, caption: '3. BOOM' },
] as const;

const featurePills = [
  { icon: Leaf, label: 'Natural Flavors' },
  { icon: Sparkles, label: '0% Mess, 100% Fun' },
  { icon: Globe, label: 'Eco & Portable' },
] as const;

export default function AboutWhy() {
  return (
    <>
      {/* Band 1 — Why we created it: text left + collage right */}
      <Section background="bg" id="why">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-16">
              {/* Left — pill, headline, body */}
              <div>
                <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
                  Why We Created It
                </span>
                <h2 className="mt-5 text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[40px] md:text-[48px]">
                  Water is essential.
                  <br />
                  Plain is boring.
                </h2>
                <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                  We noticed a frustrating pattern. Most people want to stay
                  hydrated, but plain water often feels like a chore. The
                  alternative? Sugary drinks, bulky flavor bottles, or wasteful
                  single-use plastics that clutter our lives and the planet.
                </p>
                <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                  We believed there had to be a better, more natural way to
                  make water exciting on the go.
                </p>
              </div>

              {/* Right — customer problem collage */}
              <figure>
                <figcaption className="mb-3 text-sm text-[color:var(--color-fg-muted)]">
                  The Customer Problem
                </figcaption>
                <img
                  src={aboutCollage.src}
                  alt={aboutCollage.alt}
                  width={aboutCollage.width}
                  height={aboutCollage.height}
                  loading="lazy"
                  className="w-full h-auto rounded-2xl"
                />
              </figure>
            </div>
          </Container>
        </m.div>
      </Section>

      {/* Band 2 — The Thinking: inner dark card with 3-steps + feature-pills column */}
      <Section background="bg" id="experience">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              The Thinking Behind the Experience
            </p>
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[3.4fr_1fr] lg:gap-6">
              {/* Dark inner card — pill, headline, body, 3 steps */}
              <div className="dark relative overflow-hidden rounded-3xl bg-[color:var(--color-brand-deep)] p-6 text-[color:var(--color-brand-cream)] sm:p-8 md:p-10 dark:bg-[color:var(--color-brand-mid)]">
                <span className="inline-flex items-center rounded-full border border-[rgba(255,248,234,0.3)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(255,248,234,0.75)]">
                  The Innovation
                </span>
                <h3 className="mt-5 text-[26px] font-bold leading-[1.15] tracking-tight sm:text-[32px] md:text-[36px]">
                  The twist-shake-boom
                  <br className="hidden sm:inline" /> experience.
                </h3>
                <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-[rgba(255,248,234,0.8)] sm:text-base">
                  We didn't just want to create a drink; we wanted to design a
                  moment. Our patented cap keeps natural flavour separate until
                  you're ready, giving you a fresh burst with a ritual that's
                  as fun.
                </p>
                <ul role="list" className="mt-7 grid grid-cols-3 gap-3 sm:gap-6">
                  {steps.map((step) => (
                    <li key={step.caption} className="flex flex-col items-center text-center">
                      <img
                        src={step.image.src}
                        alt={step.image.alt}
                        width={240}
                        height={240}
                        loading="lazy"
                        className="w-full h-auto max-w-[180px] rounded-xl"
                      />
                      <p className="mt-3 text-[11px] font-bold tracking-wider uppercase sm:text-xs">
                        {step.caption}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feature pills column — small cream chips with icons.
                  Desktop: stretches to match dark-card height, each pill is a tall rounded rectangle.
                  Mobile: horizontal row (unchanged). */}
              <ul
                role="list"
                className="flex flex-row flex-wrap gap-3 lg:flex-col lg:gap-4 lg:h-full"
              >
                {featurePills.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex-1 lg:flex-1">
                    <div className="flex h-full flex-col items-start justify-center gap-3 rounded-2xl bg-[color:var(--color-surface)] p-4 ring-1 ring-[color:var(--color-border)] lg:p-6">
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.75}
                        className="h-[22px] w-[22px] text-[color:var(--color-brand-rose)] lg:h-7 lg:w-7"
                      />
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-fg)] sm:text-xs lg:text-sm">
                        {label}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </m.div>
      </Section>
    </>
  );
}
