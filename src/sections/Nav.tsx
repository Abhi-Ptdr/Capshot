import { useCallback } from 'react';
import { Link, useLocation } from 'react-router';
import Container from '@/components/primitives/Container';
import { Image } from '@/components/primitives/Image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';

/**
 * Nav — site-wide header landmark.
 *
 * Sticky top-of-page; sits BELOW the InAppBrowserBanner in document flow
 * (banner is a sticky-top element above the Nav at z-60), so the Nav
 * pushes down naturally when the banner renders.
 *
 * Theme: inverted (brand-deep bg + cream fg in light mode; cream bg +
 * brand-deep fg in dark mode) — matches HowItWorks + CatalogBundles +
 * Footer, giving the site a consistent dark-chrome header/footer frame
 * around the lighter content body.
 *
 * Logo (black "SHI-28" + blue CAPSHOT wordmark, transparent bg): always
 * wrapped in a cream swatch in LIGHT mode (because the inverted nav bg
 * is brand-deep, which would hide the dark logo); the swatch becomes
 * transparent in DARK mode where the nav bg is cream (logo visible on
 * its own).
 *
 * Desktop (`md+`): shows visible route links (Home · Flavors · About ·
 * Contact) in the center of the nav row; hamburger is hidden.
 * Mobile (`<md`): hamburger menu takes over; the route links hide to
 * keep the mobile nav uncluttered. ThemeToggle is always visible.
 *
 * The sr-only route-stub <nav> is kept so the Phase 1 Playwright
 * `nav-link-*` test IDs are reachable at mobile viewports too (where
 * the visible md+ nav is display:none and would fail `.click()`).
 */

const ROUTES: Array<{ to: string; label: string; testId: string }> = [
  { to: '/', label: 'Home', testId: 'nav-link-home-visible' },
  // 'Why Capshot' is an in-page anchor into UspComparison on `/`. The
  // ScrollToHash effect in App.tsx picks up the `#why-capshot` hash on
  // every SPA navigation and scrolls to the target. Works from any
  // route (routes to `/` first if not already there).
  { to: '/#why-capshot', label: 'Why Capshot', testId: 'nav-link-why-visible' },
  { to: '/flavors', label: 'Flavors', testId: 'nav-link-flavors-visible' },
  { to: '/about', label: 'About', testId: 'nav-link-about-visible' },
  { to: '/contact', label: 'Contact', testId: 'nav-link-contact-visible' },
];

export function Nav() {
  const location = useLocation();
  const linkCls =
    'inline-flex items-center rounded-md px-2 py-1 text-sm font-medium text-[color:var(--color-fg)] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]';

  /**
   * Same-route click: React Router's <Link> is a no-op when `to` equals
   * the current pathname (no location change, no re-render, no effect
   * fire), so clicking "Home" while on `/` normally does nothing. Users
   * expect it to scroll back to the Hero. Intercept clicks that resolve
   * to the current pathname AND carry no hash, and smooth-scroll to top.
   * Links with a hash (/#why-capshot) are left alone — ScrollManager
   * picks up those cases via the hash dep.
   */
  const handleRouteClick = useCallback(
    (to: string) => (e: React.MouseEvent) => {
      if (to.includes('#')) return;
      if (location.pathname !== to) return;
      e.preventDefault();
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    },
    [location.pathname],
  );

  return (
    <header
      role="banner"
      className={[
        // Inverted theme (mirrors HowItWorks + CatalogBundles + Footer).
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
        'sticky top-0 z-50 w-full',
      ].join(' ')}
    >
      <Container className="flex h-14 items-center sm:h-16">
        <Link
          to="/"
          aria-label="CAPSHOT — go to homepage"
          data-testid="nav-link-home"
          onClick={handleRouteClick('/')}
          className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
        >
          {/*
            New logo is a black-ink wordmark on transparent bg. On the
            inverted light-mode nav (brand-deep bg) it would be invisible,
            so we wrap it in a cream swatch. In dark mode the nav bg is
            already cream — swatch becomes transparent to avoid double-cream
            squares.
          */}
          <span className="inline-block rounded bg-[color:var(--color-brand-cream)] px-2 py-1 dark:bg-transparent dark:px-0 dark:py-0">
            <Image
              src="/logos/logo-horizontal.png"
              alt="CAPSHOT"
              width={75}
              height={28}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </span>
        </Link>

        {/*
          Centered desktop route links. The wrapper is `flex-1` on every
          viewport so it eats the space between the logo and ThemeToggle;
          on mobile it stays empty (nav inside is hidden), which still
          pushes ThemeToggle + hamburger to the right. On md+ the wrapper
          flexes + justify-centers so the visible nav row sits exactly
          between logo and ThemeToggle.
        */}
        <div className="flex-1 md:flex md:justify-center">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-3 md:flex lg:gap-5"
          >
            {ROUTES.map(({ to, label, testId }) => (
              <Link
                key={to}
                to={to}
                data-testid={testId}
                className={linkCls}
                onClick={handleRouteClick(to)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <ThemeToggle />

        {/* Hamburger — mobile only; md+ uses the visible nav above */}
        <div className="md:hidden">
          <HamburgerMenu />
        </div>

        {/*
          Phase 1 Plan 01 sr-only route-stub links kept for the SPA-navigation
          Playwright test (Test 7). They remain reachable at every viewport
          — the visible md+ nav above goes `display: none` on mobile and
          would fail a Playwright `.click()` under default visibility rules.
        */}
        <nav aria-label="Phase 1 route stub" className="sr-only">
          <Link to="/flavors" data-testid="nav-link-flavors">
            Flavors
          </Link>
          <Link to="/about" data-testid="nav-link-about">
            About
          </Link>
          <Link to="/contact" data-testid="nav-link-contact">
            Contact
          </Link>
        </nav>
      </Container>
    </header>
  );
}
