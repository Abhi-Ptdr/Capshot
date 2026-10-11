import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import Container from '@/components/primitives/Container';
import { Image } from '@/components/primitives/Image';
import { getCta } from '@/config/cta';
import {
  InstagramGlyph,
  FacebookGlyph,
  WhatsAppGlyph,
} from '@/components/ui/SocialGlyphs';

/**
 * Footer — site-wide contentinfo landmark.
 *
 * Rendered once in `src/App.tsx` AFTER `<Routes>`, so it appears on every
 * route (`/`, `/flavors`, `/about`, `/contact`, + 404 fallback) without
 * each page component needing to import it.
 *
 * Theme: inverted (brand-deep bg + cream fg in light mode; cream bg +
 * brand-deep fg in dark mode) via the same CSS-var override pattern
 * HowItWorks and CatalogBundles use. The outer `<footer>` also paints
 * its own `bg-[color:var(--color-bg)]` and sets `text-[color:var(--color-fg)]`
 * so descendants that inherit `color: inherit` pick up the overridden fg.
 *
 * The `--color-border` token is swapped too (cream @ 14% in light, deep
 * @ 14% in dark) so the divider between the main footer and sub-footer
 * reads correctly in both modes.
 *
 * Layout: 4-column grid on `lg+`, 2-column on `sm`, single-column stack
 * on narrow mobile. Columns are Brand → Explore → Connect → Legal.
 *
 * Legal links (`/privacy`, `/terms`, `/refunds`, `/shipping`) currently
 * resolve to the 404 fallback — Phase 5 (FAQ + About + Contact + SEO +
 * Accessibility) will add the actual route files. Footer surfaces them
 * now so the IA + visual rhythm are stable; swapping the targets in
 * Phase 5 is a one-line change per link.
 *
 * Facebook URL + office address placeholders — surface the handle/address
 * now with the handle convention used elsewhere (`capshot_twist`); real
 * values go in whenever the client provides them.
 */

const INSTAGRAM_URL = 'https://instagram.com/capshot_twist';
const FACEBOOK_URL = 'https://www.facebook.com/1433442473180564/';
const EMAIL = 'shi28.capshot@gmail.com';
const OFFICE_LOCATION = 'Indore, Madhya Pradesh, India';
const COPYRIGHT = `© ${new Date().getFullYear()} CAPSHOT. All rights reserved.`;

const NAV_LINKS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Home' },
  { to: '/flavors', label: 'Flavors' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const LEGAL_LINKS: Array<{ to: string; label: string }> = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/refunds', label: 'Refund Policy' },
  { to: '/shipping', label: 'Shipping Policy' },
];

export function Footer() {
  const whatsapp = getCta('nav');
  const linkCls =
    'inline-flex items-center gap-2 text-sm text-[color:var(--color-fg)] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]';
  const columnHeadingCls =
    'text-xs font-bold tracking-wider uppercase text-[color:var(--color-fg-muted)]';

  return (
    <footer
      role="contentinfo"
      className={[
        // Inverted theme vs rest of page — mirrors HowItWorks + CatalogBundles.
        '[--color-bg:var(--color-brand-deep)]',
        '[--color-fg:var(--color-brand-cream)]',
        '[--color-fg-muted:rgb(255_248_234_/_0.72)]',
        '[--color-border:rgba(255,248,234,0.14)]',
        'dark:[--color-bg:var(--color-brand-cream)]',
        'dark:[--color-fg:var(--color-brand-deep)]',
        'dark:[--color-fg-muted:rgb(89_69_69_/_0.68)]',
        'dark:[--color-border:rgba(89,69,69,0.14)]',
        // Paint our own bg + explicit text color so inherit-color descendants
        // pick up the overridden fg.
        'bg-[color:var(--color-bg)]',
        'text-[color:var(--color-fg)]',
      ].join(' ')}
    >
      {/* Main footer */}
      <Container className="py-12 sm:py-16 md:py-20">
        {/*
          Mobile (<lg): 2-column grid with `grid-flow-row-dense` so Brand
          spans the top row, Explore + Legal pair up on row 2 (both have
          short labels that fit a 160px column), and Connect spans row 3
          (needs full width for the long email). Dense auto-flow backfills
          Legal into row 2 col 2 even though it comes after Connect in
          source order, keeping desktop's natural L-to-R column order
          (Brand | Explore | Connect | Legal) at lg:grid-cols-4.
        */}
        <div className="grid grid-cols-2 grid-flow-row-dense gap-y-10 gap-x-6 sm:gap-x-8 lg:grid-cols-4 lg:grid-flow-row lg:gap-12">
          {/* Column 1 — Brand (full width on mobile, 1-col on lg) */}
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <Link
              to="/"
              aria-label="CAPSHOT home"
              className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
            >
              {/*
                Logo is a dark-ink PNG. On the inverted footer the bg is
                brand-deep in light mode (invisible against dark logo) and
                cream in dark mode (visible). Wrap in a cream swatch in
                both modes so the logo always reads — the swatch merges
                into the cream dark-mode bg naturally.
              */}
              <span className="inline-block rounded bg-[color:var(--color-brand-cream)] px-2 py-1">
                <Image
                  src="/logos/logo-horizontal.png"
                  alt="CAPSHOT"
                  width={120}
                  height={28}
                  className="h-7 w-auto"
                />
              </span>
            </Link>
            <p className="max-w-[32ch] text-sm text-[color:var(--color-fg-muted)] leading-relaxed">
              Twist. Shake. BOOM. Pre-filled flavor caps that twist onto any
              standard 28&nbsp;mm bottle.
            </p>
          </div>

          {/* Column 2 — Nav mirror */}
          <nav aria-label="Footer navigation">
            <h3 className={columnHeadingCls}>Explore</h3>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 3 — Connect (full width on mobile for long email, 1-col on lg) */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className={columnHeadingCls}>Connect</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta={whatsapp.trackingId}
                  className={linkCls}
                >
                  <WhatsAppGlyph />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  <InstagramGlyph />
                  @capshot_twist
                </a>
              </li>
              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  <FacebookGlyph />
                  /capshot_twist
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className={linkCls}>
                  <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal */}
          <div>
            <h3 className={columnHeadingCls}>Legal</h3>
            <ul className="mt-4 space-y-3">
              {LEGAL_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className={linkCls}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Sub-footer */}
      <div className="border-t border-[color:var(--color-border)]">
        <Container className="py-6">
          <div className="flex flex-col items-center gap-2 text-center text-xs text-[color:var(--color-fg-muted)] sm:flex-row sm:justify-between sm:gap-4 sm:text-left">
            <p>{COPYRIGHT}</p>
            <p>
              Made with{' '}
              <span aria-label="love" className="text-[color:var(--color-brand-rose)]">
                ❤
              </span>{' '}
              by Abhishek Patidar
            </p>
            <p>{OFFICE_LOCATION}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
