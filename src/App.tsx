import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LazyMotion, domAnimation } from '@/lib/motion';
import { Nav } from '@/sections/Nav';
import HomePage from '@/pages/HomePage';
import FlavorsPage from '@/pages/FlavorsPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Phase 1 Plan 02 — App shell.
 *
 * Composition order (outermost → innermost):
 *   <ThemeProvider>              — Context for { theme, toggle }
 *     <LazyMotion features={domAnimation}>  — CONV-05 provider contract
 *       <BrowserRouter>          — React Router v8 declarative mode
 *         skip-link              — keyboard a11y, anchors to #main
 *         <Nav />                — fixed-top, logo + ThemeToggle (CONTEXT D-16)
 *         <Routes>               — 4 known routes + * fallback
 *
 * The LazyMotion provider is mounted here (and NOT inside any route
 * component) so downstream phases can drop `<m.div>` / `<m.a>` primitives
 * from `@/lib/motion` ANYWHERE in the tree without first refactoring
 * App.tsx. Features context is already present (CONV-05 provider contract
 * closed in Phase 1).
 *
 * ThemeProvider wraps LazyMotion so if Motion ever needs to react to theme
 * class changes it can — but Phase 1 does not animate theme flips.
 *
 * The sr-only nav route-stub links moved into `<Nav>` so the Playwright
 * SPA-navigation test (Test 7) still has clickable in-DOM `<Link>` targets
 * without changing the visible navigation (CONTEXT D-16 kept logo-only).
 */
export default function App() {
  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation}>
        <BrowserRouter>
          <a
            href="#main"
            data-testid="skip-link"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-[color:var(--color-accent)] focus:px-4 focus:py-2 focus:text-[color:var(--color-accent-fg)]"
          >
            Skip to main content
          </a>
          <Nav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flavors" element={<FlavorsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </ThemeProvider>
  );
}
