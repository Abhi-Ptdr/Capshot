import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

/**
 * Phase 1 Plan 02 — ThemeProvider (CONV-04 companion).
 *
 * The inline FOUC script in `index.html` has ALREADY run before React mounts:
 *   - It read `localStorage.capshot-theme` (if present) or
 *     `window.matchMedia('(prefers-color-scheme: dark)')`.
 *   - If the computed theme is dark, it added `.dark` to `<html>` and set
 *     `<meta name="theme-color">` to `#594545`.
 *
 * This provider's job is to:
 *   1. Pick up the initial state by reading `<html>.classList` (NOT
 *      re-reading matchMedia — that would re-introduce a flash risk).
 *   2. Expose `{ theme, toggle }` to descendants.
 *   3. On every subsequent `theme` change, mirror into the DOM:
 *      - Toggle `.dark` class on `<html>`
 *      - Persist `localStorage.capshot-theme`
 *      - Swap `<meta name="theme-color">` content
 *
 * The FOUC inline script is the first-paint guarantee; this provider owns
 * the post-mount lifecycle.
 */

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('capshot-theme', theme);
    } catch {
      /* no-op: localStorage can throw in private mode */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#594545' : '#FFF8EA');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
}
