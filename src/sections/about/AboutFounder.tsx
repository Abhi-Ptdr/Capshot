import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { aboutFounder } from '@/data/about-assets';

/**
 * Phase 3.2 D3.2-02 — Founder is REAL (Akhilesh Pateliya), not placeholder.
 * D3.2-03 — Copy byte-identical to design mock with mechanical swaps only
 * (design placeholder name replaced with Akhilesh; design placeholder product
 * code replaced with SHI-28). "A Personal Note" quote LOCKED verbatim.
 * D3.2-06a — Portrait from aboutFounder.photo. D3.2-11 — zero new web-fonts;
 * signature mark is inline SVG option (b) because no handwritten font family
 * is loaded site-wide (verified at planning time via repo-wide grep).
 */

export default function AboutFounder() {
  return (
    <Section background="bg" id="founder">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
            <figure>
              <img
                src={aboutFounder.photo}
                alt={aboutFounder.alt}
                width={442}
                height={601}
                loading="lazy"
                className="w-full h-auto rounded-2xl shadow-[0_8px_32px_-8px_rgba(89,69,69,0.24)]"
              />
              <figcaption className="mt-3 text-sm text-[color:var(--color-fg-muted)]">
                Meet Akhilesh, Founder of CAPSHOT
              </figcaption>
              {/* D3.2-02 option (b): inline SVG signature; zero new web-font loads per D3.2-11. */}
              <svg
                aria-hidden="true"
                viewBox="0 0 240 60"
                width={160}
                height={40}
                className="mt-2 text-[color:var(--color-brand-rose)]"
              >
                <path
                  d="M8 42 C 20 10, 36 10, 42 36 C 46 54, 60 44, 64 24 C 68 8, 82 10, 86 32 C 90 50, 104 42, 108 22 C 112 10, 124 12, 128 30 L 140 30 M 150 20 C 158 16, 170 20, 168 32 C 166 44, 150 44, 150 32 C 150 20, 164 18, 174 24 M 184 10 L 184 44 M 196 24 C 204 20, 216 24, 214 36 C 212 48, 196 48, 196 36 C 196 24, 212 22, 222 28"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="sr-only">Akhilesh signature</span>
            </figure>

            <div className="mt-6 md:mt-0">
              <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
                THE FOUNDER'S STORY
              </p>
              <p className="mt-3 text-sm uppercase tracking-wider text-[color:var(--color-fg-muted)]">
                The story behind SHI-28.
              </p>
              <h2 className="mt-2 text-[24px] font-bold tracking-tight sm:text-[32px] md:text-[36px]">
                From a simple 'what if' to SHI-28.
              </h2>
              <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg">
                It started with a question Akhilesh kept asking himself on long
                train rides — why does plain water, the one thing we drink most,
                feel like the one thing we skip? The sugary alternatives were
                everywhere, but they weren't the answer. Something simpler had
                to exist.
              </p>
              <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg">
                Years of engineering notebooks and prototype caps later, SHI-28
                was the shape of the answer. A tiny, pre-filled cap that twists
                onto any 28mm water bottle. One quick shake, and plain water
                becomes a flavor moment — without the plastic, the mess, or
                the compromise.
              </p>
              <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg">
                CAPSHOT isn't just a product. It's Akhilesh's belief that
                hydration deserves to be exciting — that convenience and real
                flavor don't have to be a trade-off, and that the smallest
                ritual in your day can be the one you look forward to most.
              </p>

              <aside className="mt-6 rounded-2xl bg-[color:var(--color-surface)] p-6 ring-1 ring-[color:var(--color-border)]">
                <p className="text-xs font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
                  A Personal Note
                </p>
                <blockquote className="mt-3 text-base italic text-[color:var(--color-fg)] sm:text-lg">
                  Our goal has always been simple: to pack joy, flavor, and innovation into a tiny cap, so you can transform your water anytime, anywhere.
                </blockquote>
                <p className="mt-3 text-sm font-semibold">— Akhilesh, Founder</p>
              </aside>
            </div>
          </div>
        </Container>
      </m.div>
    </Section>
  );
}
