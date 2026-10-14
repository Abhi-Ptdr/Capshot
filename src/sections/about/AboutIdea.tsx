import { Link } from 'react-router';
import { Sparkles, Apple, Droplet, Zap, Rocket, Smile, Users } from 'lucide-react';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { aboutHero } from '@/data/about-assets';

const heroPills = [
  { icon: Sparkles, label: '100% Tasty Flavors' },
  { icon: Apple, label: 'Real-Fruit Flavor' },
  { icon: Droplet, label: 'Supports Hydration' },
] as const;

const bigPictureCards = [
  {
    icon: Zap,
    title: 'Exciting Flavours',
    body: "From fruity favourites to cool classics, there's a flavour for every mood.",
  },
  {
    icon: Rocket,
    title: 'On-the-Go Convenience',
    body: 'Compact, lightweight and easy to carry — perfect for your everyday adventures.',
  },
  {
    icon: Smile,
    title: 'Simple & Fun',
    body: 'Just twist, shake, and enjoy. No mess, no hassle.',
  },
  {
    icon: Users,
    title: 'Designed for Everyone',
    body: "Whether you're at work, the gym, on a trip or just at home — CAPSHOT fits in.",
  },
] as const;

export default function AboutIdea() {
  return (
    <>
      {/* Band 1 — hero band. Theme-aware: dark brown in dark mode, cream in light mode. */}
      <Section
        background="bg"
        id="idea"
        className="scroll-mt-20 sm:scroll-mt-24"
      >
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-16">
              {/* Left — copy + CTA */}
              <div>
                <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
                  The Idea Behind CAPSHOT
                </span>
                <h1 className="mt-5 text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[44px] md:text-[56px]">
                  Same water.
                  <br />
                  Bigger moments.
                </h1>
                <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                  CAPSHOT was born from a simple idea — to make everyday hydration
                  more exciting, convenient and flavorful.
                </p>
                <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                  We noticed that most people drink plain water, even when they
                  crave something more. So, we created SHI-28 — a pre-filled
                  flavour cap that turns your regular bottle into a refreshing
                  drink in seconds. Just twist, shake and boom — a burst of
                  flavour, anytime, anywhere.
                </p>
                <Link
                  to="/flavors"
                  data-cta="cta_about_idea_explore"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[color:var(--color-fg)] px-6 text-sm font-bold uppercase tracking-wider text-[color:var(--color-fg)] transition-colors hover:bg-[color:var(--color-fg)] hover:text-[color:var(--color-brand-deep)]"
                >
                  Explore Flavors
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Right — hero image + feature pills side-by-side on md+ */}
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-5">
                <img
                  src={aboutHero.src}
                  alt={aboutHero.alt}
                  width={aboutHero.width}
                  height={aboutHero.height}
                  loading="eager"
                  className="w-full h-auto rounded-2xl object-cover md:w-[62%] md:max-w-[300px]"
                />
                <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex md:flex-1 md:flex-col md:gap-3">
                  {heroPills.map(({ icon: Icon, label }) => (
                    <li key={label}>
                      <span className="flex items-center gap-3 rounded-2xl border border-[color:var(--color-border)] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-fg)]">
                        <Icon
                          aria-hidden="true"
                          size={26}
                          strokeWidth={1.75}
                          className="shrink-0 text-[color:var(--color-brand-rose)]"
                        />
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </m.div>
      </Section>

      {/* Band 2 — "big picture" band with 2x2 card grid. Theme-aware. */}
      <Section background="surface" id="big-picture">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="motion-reduce:!transform-none motion-reduce:!opacity-100"
        >
          <Container>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
              {/* Left — intro */}
              <div>
                <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
                  The Big Picture
                </span>
                <h2 className="mt-5 text-[28px] font-bold leading-[1.15] tracking-tight sm:text-[36px] md:text-[44px]">
                  More than just a drink.
                  <br />
                  It's a better way to hydrate.
                </h2>
                <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                  We believe that hydration should be simple, enjoyable and fit
                  into your lifestyle. CAPSHOT is our answer to the everyday
                  need for flavour, convenience, and variety — packed into a
                  small, innovative cap.
                </p>
              </div>

              {/* Right — 2x2 cards (held at 2 cols even on mobile), borderless, warm outlined icons */}
              <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-6 sm:gap-y-7">
                {bigPictureCards.map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex flex-col">
                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.75}
                      className="h-6 w-6 text-[color:var(--color-brand-rose)] sm:h-[30px] sm:w-[30px]"
                    />
                    <h3 className="mt-2 text-sm font-bold tracking-tight sm:mt-3 sm:text-lg">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-fg-muted)] sm:mt-2 sm:text-sm">
                      {body}
                    </p>
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
