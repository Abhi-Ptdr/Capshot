import { Link } from 'react-router';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { getCta } from '@/config/cta';

export default function AboutClose() {
  const waitlistCta = getCta('about-waitlist');

  return (
    <Section background="bg" id="join-journey">
      <m.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        <Container>
          <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
            Join the CAPSHOT Journey
          </span>
          <h2 className="mt-5 text-[32px] font-bold leading-[1.05] tracking-tight sm:text-[44px] md:text-[56px]">
            Let's shake things
            <br />
            up, together.
          </h2>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-[color:var(--color-fg-muted)] sm:text-lg">
            CAPSHOT isn't just a product — it's a movement to make everyday
            hydration more exciting, convenient, and flavorful. Whether you're
            ready to taste the future, join our waitlist, or partner with us,
            we'd love to have you on board.
          </p>

          <ul role="list" className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-5">
            {/* Explore flavours — dark card, outlined CTA */}
            <li className="dark flex flex-col rounded-3xl bg-[color:var(--color-brand-deep)] p-6 text-[color:var(--color-brand-cream)] dark:bg-[color:var(--color-brand-mid)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(255,248,234,0.7)]">
                Explore Flavours
              </span>
              <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                Taste the experience.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(255,248,234,0.78)]">
                Discover our vibrant range of natural fruit flavors designed to
                transform your water.
              </p>
              <div className="mt-auto pt-6">
                <Link
                  to="/flavors"
                  data-cta="cta_about_explore_flavors"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--color-brand-cream)] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-brand-cream)] transition-colors hover:bg-[color:var(--color-brand-cream)] hover:text-[color:var(--color-brand-deep)]"
                >
                  Explore Flavours
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>

            {/* Join waitlist — highlighted cream card with email input (visual) + filled CTA */}
            <li className="relative flex flex-col rounded-3xl bg-[color:var(--color-bg)] p-6 ring-1 ring-[color:var(--color-border)] md:-translate-y-1 md:shadow-[0_18px_40px_-20px_rgba(89,69,69,0.35)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-fg-muted)]">
                Join the Waitlist
              </span>
              <h3 className="mt-3 text-xl font-bold tracking-tight text-[color:var(--color-fg)] sm:text-2xl">
                Be the first to know.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
                Sign up to get exclusive early access, special launch offers,
                and exciting brand updates.
              </p>
              {/* D3.2-01 — Phase 1 locked WhatsApp waitlist. */}
              <div className="mt-auto pt-6">
                <a
                  href={waitlistCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={waitlistCta.ariaLabel ?? waitlistCta.label}
                  data-cta={waitlistCta.trackingId}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[color:var(--color-brand-deep)] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-brand-cream)]"
                >
                  {waitlistCta.label}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>

            {/* Get in touch — dark card, outlined CTA */}
            <li className="dark flex flex-col rounded-3xl bg-[color:var(--color-brand-deep)] p-6 text-[color:var(--color-brand-cream)] dark:bg-[color:var(--color-brand-mid)]">
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[rgba(255,248,234,0.7)]">
                Get in Touch
              </span>
              <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">
                Let's connect.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[rgba(255,248,234,0.78)]">
                Interested in partnership, bulk orders, or just want to say hi?
                Reach out to our team.
              </p>
              <div className="mt-auto pt-6">
                <Link
                  to="/contact"
                  data-cta="cta_about_contact"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[color:var(--color-brand-cream)] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--color-brand-cream)] transition-colors hover:bg-[color:var(--color-brand-cream)] hover:text-[color:var(--color-brand-deep)]"
                >
                  Contact Us
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </li>
          </ul>

          <div className="mt-14 flex items-center justify-center gap-4">
            <span className="h-px flex-1 max-w-[220px] bg-[color:var(--color-border)]" />
            <p
              className="text-2xl leading-none text-[color:var(--color-fg)] sm:text-3xl"
              style={{ fontFamily: "'Whisper', cursive", fontWeight: 400 }}
            >
              The journey is just beginning.
            </p>
            <span className="h-px flex-1 max-w-[220px] bg-[color:var(--color-border)]" />
          </div>
        </Container>
      </m.div>
    </Section>
  );
}
