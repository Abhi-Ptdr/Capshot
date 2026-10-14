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
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12 lg:gap-16">
            {/* Left — pill, portrait, caption, signature */}
            <div>
              <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
                The Founder's Story
              </span>
              <figure className="mt-5">
                <img
                  src={aboutFounder.photo}
                  alt={aboutFounder.alt}
                  width={442}
                  height={601}
                  loading="lazy"
                  className="w-full h-auto rounded-2xl object-cover shadow-[0_8px_32px_-8px_rgba(89,69,69,0.24)]"
                />
                <figcaption className="mt-4 flex items-center justify-between gap-3 text-sm text-[color:var(--color-fg-muted)]">
                  <span>Meet Akhilesh, Founder of CAPSHOT</span>
                  <span
                    aria-hidden="true"
                    className="text-2xl leading-none text-[color:var(--color-brand-rose)]"
                    style={{ fontFamily: "'Whisper', cursive", fontWeight: 400 }}
                  >
                    Akhilesh
                  </span>
                  <span className="sr-only">Akhilesh signature</span>
                </figcaption>
              </figure>
            </div>

            {/* Right — eyebrow, headline, body, personal note card */}
            <div>
              <p className="text-sm text-[color:var(--color-fg-muted)]">
                The story behind SHI-28.
              </p>
              <h2 className="mt-2 text-[30px] font-bold leading-[1.1] tracking-tight sm:text-[40px] md:text-[48px]">
                From a simple 'what if'
                <br />
                to SHI-28.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                It started with a question Akhilesh kept asking himself on long
                train rides — why does plain water, the one thing we drink most,
                feel like the one thing we skip? The sugary alternatives were
                everywhere, but they weren't the answer. Something simpler had
                to exist.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                Years of engineering notebooks and prototype caps later, SHI-28
                was the shape of the answer. A tiny, pre-filled cap that twists
                onto any 28mm water bottle. One quick shake, and plain water
                becomes a flavor moment — without the plastic, the mess, or
                the compromise.
              </p>
              <p className="mt-4 text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
                CAPSHOT isn't just a product. It's Akhilesh's belief that
                hydration deserves to be exciting — that convenience and real
                flavor don't have to be a trade-off, and that the smallest
                ritual in your day can be the one you look forward to most.
              </p>

              {/* Personal note — always a filled brown card. Elevates to mid brown in dark mode so it stays distinct from the page bg. */}
              <aside className="mt-7 rounded-2xl bg-[color:var(--color-brand-deep)] p-6 dark:bg-[color:var(--color-brand-mid)]">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(255,248,234,0.7)]">
                  A Personal Note
                </p>
                <blockquote className="mt-3 text-base italic leading-relaxed text-[color:var(--color-brand-cream)] sm:text-lg">
                  “Our goal has always been simple: to pack joy, flavor, and innovation into a tiny cap, so you can transform your water anytime, anywhere.”
                </blockquote>
                <p className="mt-3 text-sm font-semibold text-[color:var(--color-brand-cream)]">
                  — Akhilesh, Founder
                </p>
              </aside>
            </div>
          </div>
        </Container>
      </m.div>
    </Section>
  );
}
