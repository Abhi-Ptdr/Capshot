import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Camera, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { m, AnimatePresence } from '@/lib/motion';
import { getCta } from '@/config/cta';

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
                  <Link to="/flavors" onClick={() => setOpen(false)}>
                    Flavors
                  </Link>
                  <Link to="/about" onClick={() => setOpen(false)}>
                    About
                  </Link>
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    Contact
                  </Link>
                </nav>

                <div className="mt-auto flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6 text-[color:var(--color-fg)]">
                  <a
                    href="https://instagram.com/capshot_twist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base"
                  >
                    {/*
                      Lucide 1.53.0 does not ship an Instagram glyph; the
                      Camera icon is the brand-neutral stand-in that matches
                      the Lucide geometric aesthetic. The handle text carries
                      the social identity.
                    */}
                    <Camera size={18} aria-hidden="true" />
                    @capshot_twist
                  </a>
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={whatsapp.trackingId}
                    className="inline-flex items-center gap-2 text-base"
                  >
                    {/*
                      Lucide does not ship a stable WhatsApp glyph; using the
                      Mail-adjacent neutral marker (Send) would be misleading,
                      and the brand voice preference is a text-only label here
                      (RESEARCH §4 pattern). The href is sourced from the
                      centralized CTA config — never a literal URL in this file.
                    */}
                    WhatsApp
                  </a>
                  <a
                    href="mailto:shi28.capshot@gmail.com"
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <Mail size={18} aria-hidden="true" />
                    shi28.capshot@gmail.com
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
