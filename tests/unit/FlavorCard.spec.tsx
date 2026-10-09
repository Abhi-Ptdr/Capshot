import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { FlavorCard } from '@/components/ui/FlavorCard';
import { flavors } from '@/data/flavors';

/**
 * Phase 2 Plan 01 — <FlavorCard> contract (D2-04 / D2-05 / RESEARCH §5 + §7).
 *
 * Verifies the color-washed card shape consumed by Waves 2 and 3:
 *   - article root with data-flavor + accentHex background
 *   - --cap-base CSS variable set from accentHex (used by FlavorCapGraphic)
 *   - FlavorCapGraphic (aria-hidden SVG) rendered inside
 *   - Range tag chip shows Title-Case label, not kebab slug
 *   - Title + description text rendered (cream + text-shadow via class)
 */

afterEach(() => {
  cleanup();
});

const ORANGE = flavors.find((f) => f.handle === 'orange')!;
const MATCHA = flavors.find((f) => f.handle === 'japanese-matcha')!;

describe('<FlavorCard /> — color-washed card contract (D2-04)', () => {
  it('F1: renders the flavor title, description, and range label text', () => {
    render(<FlavorCard flavor={ORANGE} />);
    expect(screen.getByText('Orange')).toBeTruthy();
    expect(screen.getByText(ORANGE.description)).toBeTruthy();
    expect(screen.getByText('Fruity Blast')).toBeTruthy();
  });

  it('F2: article has data-flavor + inline backgroundColor matching accentHex', () => {
    render(<FlavorCard flavor={ORANGE} />);
    const article = screen.getByRole('article');
    expect(article.getAttribute('data-flavor')).toBe('orange');
    // JSDOM reports inline styled colors as rgb(r, g, b)
    expect(article.style.backgroundColor).toBe('rgb(245, 124, 31)');
  });

  it('F3: article sets --cap-base CSS variable to the flavor accentHex', () => {
    render(<FlavorCard flavor={ORANGE} />);
    const article = screen.getByRole('article') as HTMLElement;
    expect(article.style.getPropertyValue('--cap-base')).toBe('#F57C1F');
  });

  it('F4: article contains an aria-hidden <svg> (FlavorCapGraphic)', () => {
    const { container } = render(<FlavorCard flavor={ORANGE} />);
    const svg = container.querySelector('svg[aria-hidden="true"]');
    expect(svg).not.toBeNull();
  });

  it('F5: premium-sports range renders chip label "Premium Sports" (not slug)', () => {
    render(<FlavorCard flavor={MATCHA} />);
    expect(screen.getByText('Premium Sports')).toBeTruthy();
    expect(screen.queryByText('premium-sports')).toBeNull();
  });

  it('F6: exactly one <article> rendered per card', () => {
    render(<FlavorCard flavor={ORANGE} />);
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBe(1);
  });
});
