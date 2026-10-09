import { BrowserRouter, Routes, Route, Link } from 'react-router';
import HomePage from '@/pages/HomePage';
import FlavorsPage from '@/pages/FlavorsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Phase 1 Plan 01: BrowserRouter + 4 routes + 404 fallback.
 *
 * - Uses `react-router` (NOT `react-router-dom` — removed in v8 per
 *   CLAUDE.md "What NOT to Use").
 * - Skip-to-main-content link mounts above <BrowserRouter> so it's reachable
 *   from the URL bar on every route; UI-SPEC §Interaction Contracts.
 * - Phase 2 wraps <App> in <ThemeProvider> and <InAppBrowserBanner>
 *   (above <BrowserRouter> per the UI-SPEC Phase 6 migration contract).
 * - Hidden nav links with data-testid attributes exist so the Playwright
 *   SPA-navigation test can click an in-document <Link> and verify that
 *   client-side routing does not trigger a full-page reload. Plan 02's
 *   real <Nav> replaces this stub.
 */
export default function App() {
  return (
    <BrowserRouter>
      <a
        href="#main"
        data-testid="skip-link"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-[color:var(--color-accent)] focus:px-4 focus:py-2 focus:text-[color:var(--color-accent-fg)]"
      >
        Skip to main content
      </a>
      {/*
        Phase 1 nav stub: hidden-until-focus links that exist only so the
        SPA-navigation Playwright test (Test 7) can click an in-DOM <Link>.
        Plan 02 replaces this with the real <Nav> component (logo + theme
        toggle; still no visible menu — CONTEXT D-16).
      */}
      <nav aria-label="Phase 1 route stub" className="sr-only">
        <Link to="/" data-testid="nav-link-home">
          Home
        </Link>
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flavors" element={<FlavorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
