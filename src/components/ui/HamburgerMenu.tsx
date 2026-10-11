import { useCallback, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { m, AnimatePresence } from '@/lib/motion';
import { getCta } from '@/config/cta';
import {
  InstagramGlyph,
  FacebookGlyph,
  WhatsAppGlyph,
} from '@/components/ui/SocialGlyphs';

const INSTAGRAM_URL = 'https://instagram.com/capshot_twist';
const FACEBOOK_URL = 'https://www.facebook.com/1433442473180564/';
const EMAIL = 'shi28.capshot@gmail.com';

const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Home' },
  { to: '/flavors', label: 'Flavors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

/**
 * Phase 2 Plan 01 — HamburgerMenu (D2-11 / D2-12 / RESEARCH §4).
 *
 * Radix Dialog gives us focus trap + Escape + click-outside + aria-modal
 * + focus-return + scroll lock for free. Motion's `m.aside` wraps
 * `Dialog.Content` via `asChild forceMount` + an outer `<AnimatePresence>`
 * so entry + exit transitions run with Motion's reduced-motion detection.
 *
 * The WhatsApp anchor's href comes from the centralized CTA config via
 * `getCta('nav')` — the configured waitlist deep-link is the single
 * legal source (INFRA-06 CI grep enforces this file never contains the
 * literal destination). The anchor also propagates the tracking ID so
 * Phase 3+ Pixel/CAPI wrappers continue to work without modification.
 *
 * Z-index: panel 71, overlay 70. The Phase 1 InAppBrowserBanner sits at
 * 60, so the hamburger panel + its dim overlay always stack above the
 * banner (RESEARCH §11.6).
 *
 * CONV-05 preserved: all Motion primitives come from `@/lib/motion`
 * (never `motion/react` directly).
 */
export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const whatsapp = getCta('nav');
  const location = useLocation();

  /**
   * On a same-route click (e.g., tapping "Home" while already on `/`),
   * React Router's <Link> is a no-op, so we close the hamburger and
   * smooth-scroll to the top ourselves. Mirrors the Nav behavior.
   */
  const handleRouteClick = useCallback(
    (to: string) => () => {
      setOpen(false);
      if (location.pathname === to && !to.includes('#')) {
        const prefersReduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches;
        window.scrollTo({
          top: 0,
          behavior: prefersReduced ? 'auto' : 'smooth',
        });
      }
    },
    [location.pathname],
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--color-fg-muted)] transition-colors hover:bg-black/5 hover:text-[color:var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)] motion-reduce:transition-none"
        >
          {open ? (
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop — click-outside closes via Radix's own handler */}
            <Dialog.Overlay asChild forceMount>
              <m.div
                data-testid="hamburger-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ zIndex: 70 }}
                className="fixed inset-0 bg-[color:var(--color-overlay)] motion-reduce:transition-none"
              />
            </Dialog.Overlay>

            {/* Panel — right-anchored slide-in */}
            <Dialog.Content asChild forceMount>
              <m.aside
                data-testid="hamburger-panel"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.24, ease: [0.2, 0, 0.2, 1] }}
                style={{ zIndex: 71 }}
                className="fixed inset-y-0 right-0 flex w-[min(88vw,320px)] flex-col bg-[color:var(--color-bg)] p-6 shadow-2xl focus:outline-none motion-reduce:transition-none"
                aria-label="Main navigation"
                aria-modal="true"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>

                <div className="flex items-center justify-end">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--color-fg)] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
                    >
                      <X size={20} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="mt-6 flex flex-col gap-5 text-2xl font-bold tracking-tight text-[color:var(--color-fg)]">
                  {NAV_LINKS.map(({ to, label }) => (
                    <Link key={to} to={to} onClick={handleRouteClick(to)}>
                      {label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6 text-[color:var(--color-fg)]">
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={whatsapp.trackingId}
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <WhatsAppGlyph />
                    WhatsApp
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <InstagramGlyph />
                    @capshot_twist
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <FacebookGlyph />
                    /capshot_twist
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <Mail size={18} aria-hidden="true" />
                    {EMAIL}
                  </a>
                </div>
              </m.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
