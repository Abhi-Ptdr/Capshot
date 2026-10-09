import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { FlavorRange } from '@/data/types';
import { cn } from '@/lib/cn';

/**
 * Phase 2 Plan 03 — Range filter pill chips (D2-07 / D2-08 / RESEARCH §2).
 *
 * UX contract:
 *   - Four pills: All / Fruity Blast / Desi & Cool / Premium Sports
 *   - Active pill = filled with `--color-fg` + text in `--color-bg`;
 *     `aria-pressed="true"`
 *   - Inactive pills = outlined with `--color-border`; `aria-pressed="false"`
 *   - Pills WRAP on narrow mobile viewports (`flex-wrap`) — they must
 *     NOT become horizontally scrollable (D2-07)
 *   - WCAG focus-visible ring + `motion-reduce:transition-none`
 *
 * URL state contract:
 *   - Pills call `onChange(FlavorRange | null)` so the parent (FlavorsPage)
 *     writes to `useSearchParams`. Clean URL for All; `?range=<slug>` for
 *     filtered views.
 *   - Invalid `?range=` values are cleaned up HERE via a mount `useEffect`
 *     with `replace: true` (so bogus share-links don't pollute back-stack).
 *     The parent's `active` prop will separately resolve to null when the
 *     param is invalid.
 *
 * Why `useSearchParams` lives in BOTH this component and the parent:
 *   - Parent reads it to derive the current `active` + filter the grid.
 *   - This component reads it ONLY to run the one-shot invalid-param
 *     cleanup — handing that responsibility to the component that owns
 *     the pill UI keeps `FlavorsPage` focused on composition.
 *
 * Imports from `'react-router'` ONLY — v8 removed the legacy DOM-suffixed
 * sister package entirely (CLAUDE.md "What NOT to Use").
 */

const RANGES: readonly { id: FlavorRange | null; label: string }[] = [
  { id: null, label: 'All' },
  { id: 'fruity-blast', label: 'Fruity Blast' },
  { id: 'desi-cool', label: 'Desi & Cool' },
  { id: 'premium-sports', label: 'Premium Sports' },
];

const VALID: readonly string[] = [
  'fruity-blast',
  'desi-cool',
  'premium-sports',
];

type Props = {
  active: FlavorRange | null;
  onChange: (next: FlavorRange | null) => void;
};

export function RangeFilter({ active, onChange }: Props) {
  const [params, setParams] = useSearchParams();

  // Clean up invalid or empty-string `?range=` on mount so bogus share-links
  // don't pollute the back-stack (replace: true). The parent `FlavorsPage`
  // already resolves `active` to null when the param is invalid, so this
  // effect's only job is URL normalization.
  useEffect(() => {
    const raw = params.get('range');
    if (raw !== null && !VALID.includes(raw)) {
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  return (
    <nav
      aria-label="Filter flavors by range"
      className="mt-6 flex flex-wrap gap-2 sm:mt-8"
    >
      {RANGES.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold tracking-wide uppercase transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]',
              isActive
                ? 'bg-[color:var(--color-fg)] text-[color:var(--color-bg)]'
                : 'border border-[color:var(--color-border)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-fg)]/5',
              'motion-reduce:transition-none',
            )}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
