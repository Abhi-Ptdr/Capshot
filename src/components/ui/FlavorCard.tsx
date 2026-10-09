import { memo } from 'react';
import type { Flavor } from '@/data/types';
import { FlavorCapGraphic } from '@/components/ui/FlavorCapGraphic';
import { lightenHex } from '@/lib/color';

/**
 * Phase 2 Plan 01 — Single flavor card (D2-04 / D2-05 / RESEARCH §5 + §7).
 *
 * Visual: color-washed tile — the flavor's `accentHex` is the whole card
 * background. The shared `<FlavorCapGraphic>` is centered absolutely in
 * the card and recolors itself from `--cap-base` + `--cap-highlight`
 * CSS variables set on the article root.
 *
 * Typography: cream text + a 1px drop-shadow via Tailwind v4 arbitrary
 * `[text-shadow:...]` utility, so the four pastel-accent flavors
 * (Pineapple, Guava, Citrus Mint, Mango) stay legible without needing
 * per-flavor dark-text overrides (RESEARCH §7 "cream + shadow" strategy).
 *
 * Chip: opaque cream background with brand-deep text — a visual constant
 * across all 16 cards that reinforces the brand palette (RESEARCH §7).
 *
 * Memoized because downstream Wave 2 / Wave 3 render it inside grids and
 * horizontal scrollers where parent re-renders are frequent (filter
 * changes, hover state).
 */

const RANGE_LABEL: Record<Flavor['range'], string> = {
  'fruity-blast': 'Fruity Blast',
  'desi-cool': 'Desi & Cool',
  'premium-sports': 'Premium Sports',
};

export const FlavorCard = memo(function FlavorCard({
  flavor,
}: {
  flavor: Flavor;
}) {
  const highlight = lightenHex(flavor.accentHex, 15);
  const cardStyle: React.CSSProperties = {
    backgroundColor: flavor.accentHex,
    // CSS custom properties — read by <FlavorCapGraphic> below. The cast
    // is required because React's CSSProperties typing doesn't declare
    // the user-defined `--cap-*` custom-property names.
    ['--cap-base' as string]: flavor.accentHex,
    ['--cap-highlight' as string]: highlight,
  } as React.CSSProperties;

  return (
    <article
      data-flavor={flavor.handle}
      style={cardStyle}
      className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-[0_4px_18px_-4px_rgba(89,69,69,0.18)] transition-transform duration-200 hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
    >
      {/* Top: range tag chip — cream bg + brand-deep text, visual constant */}
      <span className="relative z-10 inline-flex items-center self-start rounded-full bg-[color:var(--color-brand-cream)]/90 px-2.5 py-1 text-[11px] font-bold tracking-wider text-[color:var(--color-brand-deep)] uppercase">
        {RANGE_LABEL[flavor.range]}
      </span>

      {/* Middle: shared cap SVG, centered absolutely */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <FlavorCapGraphic className="h-[55%] w-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]" />
      </div>

      {/* Bottom: name + 1-line desc, cream text + drop-shadow for pastel accents */}
      <div className="relative z-10 mt-auto text-[color:var(--color-brand-cream)]">
        <h3 className="text-lg leading-tight font-bold tracking-tight [text-shadow:0_1px_2px_rgb(0_0_0_/_0.35)] sm:text-xl">
          {flavor.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug opacity-90 [text-shadow:0_1px_2px_rgb(0_0_0_/_0.35)]">
          {flavor.description}
        </p>
      </div>
    </article>
  );
});
