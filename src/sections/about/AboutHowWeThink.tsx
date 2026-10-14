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

type CardVariant = 'dark' | 'light';

type Card = {
  pill: string;
  title?: string;
  body: string;
  image: typeof aboutConvenience | null;
  variant: CardVariant;
  /** Tailwind utility string for grid placement on lg+ */
  span: string;
  /** How the image sits inside the card */
  imageSlot: 'inline' | 'bottom' | 'fill';
};

const cards: Card[] = [
  {
    pill: 'Convenience First',
    title: '01 / Uncomplicate the routine.',
    body: "No measuring powders, no messy stirrers. Just grab your favorite cap, attach, and you're ready. It's flavor in a snap, exactly when you want it.",
    image: aboutConvenience,
    variant: 'dark',
    span: '',
    imageSlot: 'inline',
  },
  {
    pill: 'Pocket Ready',
    title: '02 / Portability.',
    body: 'Lightweight, pocket-sized, and spill-proof. Carry your flavor in your pocket, bag, or gym pouch without the bulk of heavy liquid bottles.',
    image: aboutPortability,
    variant: 'light',
    span: 'lg:col-span-1',
    imageSlot: 'bottom',
  },
  {
    pill: 'Infinite Flavor Variety',
    title: '03 / Play with flavor.',
    body: 'Why stick to one drink? Mix, match, and switch flavors instantly. Carry a tropical burst and a berry splash in one tiny pocket.',
    image: aboutFlavors,
    variant: 'light',
    span: 'lg:col-span-1 lg:row-span-2',
    imageSlot: 'fill',
  },
  {
    pill: 'Designed for Life',
    title: '04 / Match the moment.',
    body: 'From workouts to road-trips to midnight study grinds — pick the flavor that matches the moment, swap when it changes.',
    image: aboutPlayWithFlavor,
    variant: 'dark',
    span: '',
    imageSlot: 'inline',
  },
  {
    pill: 'Built to Last',
    title: '05 / Product Design.',
    body: 'An engineering marvel in a tiny cap. Spill-free, eco-conscious, and meticulously crafted to fit standard bottles seamlessly.',
    image: aboutProductDesign,
    variant: 'dark',
    span: 'lg:col-span-1',
    imageSlot: 'bottom',
  },
];

function CardPill({ variant, children }: { variant: CardVariant; children: React.ReactNode }) {
  const base =
    'inline-flex items-center rounded-full border px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] sm:text-[11px]';
  if (variant === 'dark') {
    return (
      <span className={`${base} border-[rgba(255,248,234,0.3)] text-[rgba(255,248,234,0.78)]`}>
        {children}
      </span>
    );
  }
  return (
    <span className={`${base} border-[color:var(--color-border)] text-[color:var(--color-fg-muted)]`}>
      {children}
    </span>
  );
}

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
          {/* Header row — pill, headline, intro body */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
            <div>
              <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
                How We Think Differently
              </span>
              <h2 className="mt-5 text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[40px] md:text-[48px]">
                We don't fit the mold.
                <br />
                We reshape it.
              </h2>
            </div>
            <p className="self-end text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
              While others focus on just filling bottles, we're busy rethinking
              how you interact with flavor. We believe hydration should adapt
              to your life — not the other way around. Here is how we challenge
              the standard.
            </p>
          </div>

          {/* Bento grid — explicit 48/28/24 column proportions on lg, matching the design mock */}
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-[2fr_1.2fr_1fr] lg:auto-rows-fr"
          >
            {cards.map((card, idx) => {
              const base =
                'relative flex flex-col overflow-hidden rounded-3xl p-5 sm:p-6';
              const tone =
                card.variant === 'dark'
                  ? 'dark bg-[color:var(--color-brand-deep)] text-[color:var(--color-brand-cream)] dark:bg-[color:var(--color-brand-mid)]'
                  : 'bg-[color:var(--color-surface)] text-[color:var(--color-fg)] ring-1 ring-[color:var(--color-border)]';
              return (
                <li key={idx} className={`${base} ${tone} ${card.span}`}>
                  <CardPill variant={card.variant}>{card.pill}</CardPill>

                  {card.imageSlot === 'inline' ? (
                    // Side-by-side: title + body on left, image on right (desktop).
                    // Image capped so the illustration doesn't push row height past the design proportion.
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1.6fr_1fr] sm:items-center">
                      <div>
                        {card.title && (
                          <h3 className="text-base font-bold leading-snug tracking-tight sm:text-lg">
                            {card.title}
                          </h3>
                        )}
                        <p
                          className={`mt-2 text-sm leading-relaxed ${
                            card.variant === 'dark'
                              ? 'text-[rgba(255,248,234,0.78)]'
                              : 'text-[color:var(--color-fg-muted)]'
                          }`}
                        >
                          {card.body}
                        </p>
                      </div>
                      {card.image && (
                        <img
                          src={card.image.src}
                          alt={card.image.alt}
                          width={card.image.width}
                          height={card.image.height}
                          loading="lazy"
                          className="h-full max-h-[160px] w-full rounded-xl object-cover"
                        />
                      )}
                    </div>
                  ) : card.imageSlot === 'fill' ? (
                    // Tall card: title/body on top, image fills the rest
                    <>
                      {card.title && (
                        <h3 className="mt-4 text-base font-bold leading-snug tracking-tight sm:text-lg">
                          {card.title}
                        </h3>
                      )}
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          card.variant === 'dark'
                            ? 'text-[rgba(255,248,234,0.78)]'
                            : 'text-[color:var(--color-fg-muted)]'
                        }`}
                      >
                        {card.body}
                      </p>
                      {card.image && (
                        <img
                          src={card.image.src}
                          alt={card.image.alt}
                          width={card.image.width}
                          height={card.image.height}
                          loading="lazy"
                          className="mt-4 w-full h-auto flex-1 rounded-xl object-cover"
                        />
                      )}
                    </>
                  ) : (
                    // Bottom slot: text stack, image at bottom (capped height so the row stays uniform)
                    <>
                      {card.title && (
                        <h3 className="mt-4 text-base font-bold leading-snug tracking-tight sm:text-lg">
                          {card.title}
                        </h3>
                      )}
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          card.variant === 'dark'
                            ? 'text-[rgba(255,248,234,0.78)]'
                            : 'text-[color:var(--color-fg-muted)]'
                        }`}
                      >
                        {card.body}
                      </p>
                      {card.image && (
                        <img
                          src={card.image.src}
                          alt={card.image.alt}
                          width={card.image.width}
                          height={card.image.height}
                          loading="lazy"
                          className="mt-4 h-auto max-h-[120px] w-full rounded-xl object-cover"
                        />
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </m.div>
    </Section>
  );
}
