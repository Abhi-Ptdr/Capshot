import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import {
  aboutConvenience,
  aboutPortability,
  aboutFlavors,
  aboutPlayWithFlavor,
  aboutProductDesign,
} from '@/data/about-assets';

/**
 * Phase 3.2 D3.2-08 — Section 4 locked to FIVE feature cards.
 * Cards 3 and 4 intentionally share the title "Play with flavor"
 * per design (only the pills differ). The 5th card hangs on its own
 * row at lg+ (grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3).
 */

const cards = [
  {
    step: '01',
    title: 'Uncomplicate the routine',
    pill: 'Convenience First',
    body: "No measuring powders, no messy stirrers. Just grab your favorite cap, attach, and you're ready. It's flavor in a snap, exactly when you want it.",
    image: aboutConvenience,
  },
  {
    step: '02',
    title: 'Portability',
    pill: 'Portability',
    body: 'Lightweight, pocket-sized, and spill-proof. Carry your flavor in your pocket, bag, or gym pouch without the bulk of heavy liquid bottles.',
    image: aboutPortability,
  },
  {
    step: '03',
    title: 'Play with flavor',
    pill: 'Infinite Flavor Variety',
    body: 'Why stick to one drink? Mix, match, and switch flavors instantly. Carry a tropical burst and a berry splash in one tiny pocket.',
    image: aboutFlavors,
  },
  {
    step: '04',
    title: 'Play with flavor',
    pill: 'Designed for Life',
    body: 'From workouts to road-trips to midnight study grinds — pick the flavor that matches the moment, swap when it changes.',
    image: aboutPlayWithFlavor,
  },
  {
    step: '05',
    title: 'Product Design',
    pill: 'Product Design',
    body: 'An engineering marvel in a tiny cap. Spill-free, eco-conscious, and meticulously crafted to fit standard bottles seamlessly. Design that feels as good as it looks.',
    image: aboutProductDesign,
  },
] as const;

export default function AboutHowWeThink() {
  return (
    <Section background="bg" id="how-we-think">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
            HOW WE THINK DIFFERENTLY
          </p>
          <h2 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[36px] md:text-[44px]">
            We don't fit the mold. We reshape it.
          </h2>
          <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg max-w-[52ch]">
            Everything we build starts from one principle — hydration should fit
            your life, not the other way around.
          </p>
          <ul role="list" className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {cards.map((card) => (
              <li
                key={card.step}
                className="relative flex flex-col rounded-2xl bg-[color:var(--color-surface)] p-6 shadow-[0_4px_18px_-4px_rgba(89,69,69,0.18)] ring-1 ring-[color:var(--color-border)]"
              >
                <span className="self-start rounded-full bg-[color:var(--color-brand-rose)] px-3 py-1 text-[11px] font-bold tracking-wider text-[color:var(--color-brand-cream)] uppercase">
                  {card.pill}
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight">
                  {card.step} / {card.title}
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  {card.body}
                </p>
                {card.image ? (
                  <img
                    src={card.image.src}
                    alt={card.image.alt}
                    width={card.image.width}
                    height={card.image.height}
                    loading="lazy"
                    className="mt-4 w-full h-auto rounded-lg"
                  />
                ) : null}
              </li>
            ))}
          </ul>
        </Container>
      </m.div>
    </Section>
  );
}
