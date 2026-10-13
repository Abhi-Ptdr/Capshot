import { Link } from 'react-router';
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { getCta } from '@/config/cta';

/**
 * Phase 3.2 D3.2-01 — S5 waitlist card is button-only via getCta('about-waitlist').
 * The email input in the design mock is reference-only (Phase 1 locked WhatsApp
 * waitlist). D3.2-14 — CtaSlot literal 'about-waitlist' populated by Plan 01.
 *
 * CI grep gate: this file carries ZERO raw destination literal. The waitlist
 * href resolves at runtime from getCta('about-waitlist').href, which reads
 * from src/config/cta.ts — the single allowlisted module for the WhatsApp
 * destination literal.
 */

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
          <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
            JOIN THE CAPSHOT JOURNEY
          </p>
          <h2 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[36px] md:text-[44px]">
            Let's shake things up, together.
          </h2>
          <p className="mt-4 text-base text-[color:var(--color-fg-muted)] sm:text-lg max-w-[52ch]">
            Three ways to be part of CAPSHOT right now — try the flavors, hop on
            the pre-launch list, or just say hi.
          </p>

          <ul role="list" className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
            <li className="flex flex-col justify-between rounded-2xl bg-[color:var(--color-surface)] p-6 ring-1 ring-[color:var(--color-border)]">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
                  EXPLORE FLAVOURS
                </p>
                <h3 className="mt-3 text-xl font-bold tracking-tight">
                  Taste what's in the pipeline.
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  All 16 flavors across three ranges — Fruity Blast, Desi &amp; Cool, Premium Sports.
                </p>
              </div>
              <Link
                to="/flavors"
                data-cta="cta_about_explore_flavors"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 self-end rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-bold tracking-wide text-[color:var(--color-accent-fg)] uppercase shadow-[var(--shadow-cta)]"
              >
                EXPLORE FLAVOURS →
              </Link>
            </li>

            <li className="flex flex-col justify-between rounded-2xl bg-[color:var(--color-surface)] p-6 ring-1 ring-[color:var(--color-border)]">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
                  JOIN THE WAITLIST
                </p>
                <h3 className="mt-3 text-xl font-bold tracking-tight">
                  Be the first to twist.
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  Hop on the pre-launch WhatsApp list — early flavor access, launch alerts, pilot pricing.
                </p>
              </div>
              {/* D3.2-01: Button-only CTA via getCta('about-waitlist'); email input in design mock is reference-only — Phase 1 locked WhatsApp waitlist. */}
              <a
                href={waitlistCta.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={waitlistCta.ariaLabel ?? waitlistCta.label}
                data-cta={waitlistCta.trackingId}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 self-end rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-bold tracking-wide text-[color:var(--color-accent-fg)] uppercase shadow-[var(--shadow-cta)]"
              >
                {waitlistCta.label}
              </a>
            </li>

            <li className="flex flex-col justify-between rounded-2xl bg-[color:var(--color-surface)] p-6 ring-1 ring-[color:var(--color-border)]">
              <div>
                <p className="text-xs font-bold tracking-wider uppercase text-[color:var(--color-brand-rose)]">
                  GET IN TOUCH
                </p>
                <h3 className="mt-3 text-xl font-bold tracking-tight">
                  Say hi. We read everything.
                </h3>
                <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                  Questions, flavor requests, pilot ideas — the inbox is open.
                </p>
              </div>
              <Link
                to="/contact"
                data-cta="cta_about_contact"
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 self-end rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-bold tracking-wide text-[color:var(--color-accent-fg)] uppercase shadow-[var(--shadow-cta)]"
              >
                CONTACT US →
              </Link>
            </li>
          </ul>

          <p className="mt-10 text-center text-base italic text-[color:var(--color-fg-muted)] sm:text-lg">
            The journey is just beginning.
          </p>
        </Container>
      </m.div>
    </Section>
  );
}
