import { Link } from 'react-router';
import Container from '@/components/primitives/Container';
import { Image } from '@/components/primitives/Image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';

/**
 * Phase 1 Plan 02 — Nav (UI-SPEC §Component 1).
 *
 * Logo-only + ThemeToggle (CONTEXT D-16). No hamburger, no in-nav links.
 * 56 px mobile / 64 px ≥sm. z-index 50 (below Plan 03's in-app banner at z-60).
 *
 * Phase 1 Plan 03 — Nav uses `position: sticky; top: 0` (not `fixed`) so when
 * the InAppBrowserBanner renders (Instagram/Facebook WebView visitors), the
 * banner sits in document flow above the Nav and the Nav moves DOWN by the
 * banner's height — satisfying CONTEXT D-10 ("banner pushes hero content
 * down"). Sticky positioning keeps the Nav visually pinned on scroll like
 * `fixed` would, but respects the banner's flow placement.
 *
 * On dark theme the metallic-black wordmark sits on a cream rounded surface
 * so the logo stays legible without recoloring the asset itself
 * (capshot-brand SKILL §Logo usage mandates never recolor the file).
 */

export function Nav() {
  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full bg-[color:var(--color-bg)]"
    >
      <Container className="flex h-14 items-center sm:h-16">
        <Link
          to="/"
          aria-label="CAPSHOT — go to homepage"
          data-testid="nav-link-home"
          className="inline-flex items-center rounded-md px-1 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)] dark:bg-[color:var(--color-brand-cream)] dark:px-2"
        >
          <Image
            src="/logos/logo-horizontal.png"
            alt="CAPSHOT"
            width={120}
            height={28}
            priority
            className="h-7 w-auto sm:h-8"
          />
        </Link>
        <div className="flex-1" aria-hidden="true" />
        <ThemeToggle />
        {/*
          Phase 2 Plan 01 (D2-11 / D2-12) — hamburger button sits to the
          right of ThemeToggle. ThemeToggle stays visible in the Nav; the
          hamburger opens a Radix Dialog slide-in panel with route links
          + socials. The hamburger panel sources its WhatsApp destination
          from the centralized CTA config (INFRA-06).
        */}
        <HamburgerMenu />
        {/*
          Phase 1 Plan 01 sr-only route-stub links kept for the SPA-navigation
          Playwright test (Test 7). CONTEXT D-16 lock keeps them invisible —
          they only exist so the e2e harness can dispatch a click without
          visible navigation. The visible hamburger panel from D2-12 provides
          the user-facing route navigation.
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
