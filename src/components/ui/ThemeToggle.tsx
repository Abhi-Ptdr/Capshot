import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Phase 1 Plan 02 — ThemeToggle (UI-SPEC §Component 2).
 *
 * 44×44 hit target (WCAG 2.5.5). Sun/Moon from lucide-react@1.53.0.
 * aria-pressed reflects whether dark mode is CURRENTLY ACTIVE (so when
 * the toggle is pressed, screen readers announce "pressed: true").
 * aria-label flips between "Switch to dark mode" and "Switch to light mode".
 *
 * Reduced-motion contract: color + background transitions apply via Tailwind
 * utilities; `motion-reduce:transition-none` suppresses them when the user
 * prefers reduced motion.
 */

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const Icon = isDark ? Moon : Sun;
  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      onClick={toggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--color-fg-muted)] transition-colors hover:bg-black/5 hover:text-[color:var(--color-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)] motion-reduce:transition-none"
    >
      <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
