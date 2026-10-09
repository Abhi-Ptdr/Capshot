import { describe, it, expect } from 'vitest';
import { flavors } from '@/data/flavors';

/**
 * Phase 1 Plan 02 — Shopify-shaped flavors stub (INFRA-04).
 *
 * 16 flavors in capshot-catalog SKILL order. Phase 6 fields (priceInr,
 * shopifyProductId, available) are nullable until Shopify goes live.
 */

const FRUITY_BLAST_HANDLES = [
  'orange',
  'mixed-berry',
  'mango',
  'pineapple',
  'watermelon',
  'guava',
  'pomegranate',
  'strawberry',
  'apple',
];

const DESI_COOL_HANDLES = ['citrus-mint', 'jaljeera', 'ors-electrolyte'];

const PREMIUM_SPORTS_HANDLES = [
  'japanese-matcha',
  'black-pump',
  'java-pump',
  'coffee',
];

describe('flavors — Shopify-shaped stub (INFRA-04)', () => {
  it('contains exactly 16 flavors (capshot-catalog SKILL §Flavor count)', () => {
    expect(flavors.length).toBe(16);
  });

  it('every flavor has Phase 6 fields set to null', () => {
    for (const f of flavors) {
      expect(f.priceInr).toBeNull();
      expect(f.shopifyProductId).toBeNull();
      expect(f.available).toBeNull();
    }
  });

  it('the 9 fruity-blast handles appear in capshot-catalog SKILL order', () => {
    const got = flavors.filter((f) => f.range === 'fruity-blast').map((f) => f.handle);
    expect(got).toEqual(FRUITY_BLAST_HANDLES);
  });

  it('the 3 desi-cool handles appear in capshot-catalog SKILL order', () => {
    const got = flavors.filter((f) => f.range === 'desi-cool').map((f) => f.handle);
    expect(got).toEqual(DESI_COOL_HANDLES);
  });

  it('the 4 premium-sports handles appear in capshot-catalog SKILL order', () => {
    const got = flavors
      .filter((f) => f.range === 'premium-sports')
      .map((f) => f.handle);
    expect(got).toEqual(PREMIUM_SPORTS_HANDLES);
  });

  it('every flavor carries a non-empty description, title, and accentHex', () => {
    for (const f of flavors) {
      expect(f.description.length).toBeGreaterThan(0);
      expect(f.description.length).toBeLessThanOrEqual(140);
      expect(f.title.length).toBeGreaterThan(0);
      expect(f.accentHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('every flavor carries the canonical two-dosage strings', () => {
    for (const f of flavors) {
      expect(f.dosage.light).toBe('3–4 g for 200–250 ml bottle');
      expect(f.dosage.strong).toBe('7–8 g for 350–500 ml bottle');
    }
  });

  it('every flavor images.cap path matches /flavors/<handle>.png', () => {
    for (const f of flavors) {
      expect(f.images.cap).toBe(`/flavors/${f.handle}.png`);
    }
  });
});

/**
 * Phase 2 Plan 01 — D2-14 invariants (RESEARCH §11.8).
 *
 * FL1: every description still fits the card's 1-line budget (<=140 chars)
 *      after any Wave 1 refinement.
 * FL2: zero stimulant-beverage phrase anywhere in flavor descriptions
 *      (Premium Sports uses "caffeinated beverage" instead; the forbidden
 *      phrase is excluded by case-insensitive regex /energy\s+drink/i).
 * FL3: handle / title / range / accentHex are byte-identical to the
 *      pre-Phase-2 Phase 1 shipped state — these fields are LOCKED. Any
 *      accidental edit to a locked field is caught here, not at runtime.
 */

const LOCKED_FLAVOR_IDENTITY: ReadonlyArray<{
  handle: string;
  title: string;
  range: 'fruity-blast' | 'desi-cool' | 'premium-sports';
  accentHex: string;
}> = [
  // Fruity Blast (9)
  { handle: 'orange', title: 'Orange', range: 'fruity-blast', accentHex: '#F57C1F' },
  { handle: 'mixed-berry', title: 'Mixed Berry', range: 'fruity-blast', accentHex: '#6E3482' },
  { handle: 'mango', title: 'Mango', range: 'fruity-blast', accentHex: '#F9B233' },
  { handle: 'pineapple', title: 'Pineapple', range: 'fruity-blast', accentHex: '#F7CA18' },
  { handle: 'watermelon', title: 'Watermelon', range: 'fruity-blast', accentHex: '#E63950' },
  { handle: 'guava', title: 'Guava', range: 'fruity-blast', accentHex: '#F297B1' },
  { handle: 'pomegranate', title: 'Pomegranate', range: 'fruity-blast', accentHex: '#B4213B' },
  { handle: 'strawberry', title: 'Strawberry', range: 'fruity-blast', accentHex: '#E85A75' },
  { handle: 'apple', title: 'Apple', range: 'fruity-blast', accentHex: '#8FC13E' },
  // Desi & Cool (3)
  { handle: 'citrus-mint', title: 'Citrus Mint', range: 'desi-cool', accentHex: '#7ED6A5' },
  { handle: 'jaljeera', title: 'Jaljeera', range: 'desi-cool', accentHex: '#7A5A36' },
  { handle: 'ors-electrolyte', title: 'ORS (Electrolyte)', range: 'desi-cool', accentHex: '#4FA3D1' },
  // Premium Sports (4)
  { handle: 'japanese-matcha', title: 'Japanese Matcha', range: 'premium-sports', accentHex: '#5B8A3A' },
  { handle: 'black-pump', title: 'Black Pump', range: 'premium-sports', accentHex: '#1A1A1A' },
  { handle: 'java-pump', title: 'Java Pump', range: 'premium-sports', accentHex: '#3E2817' },
  { handle: 'coffee', title: 'Coffee', range: 'premium-sports', accentHex: '#6B4423' },
];

describe('flavors — D2-14 refinement + locked-field invariants (Phase 2 Plan 01)', () => {
  it('FL1: every description is <=140 chars', () => {
    for (const f of flavors) {
      expect(f.description.length).toBeLessThanOrEqual(140);
    }
  });

  it('FL2: no description contains the forbidden stimulant-beverage phrase', () => {
    const bad = flavors.filter((f) => /energy\s+drink/i.test(f.description));
    expect(bad).toEqual([]);
  });

  it('FL3: handle/title/range/accentHex are byte-identical to the Phase 1 locked snapshot', () => {
    const actual = flavors.map((f) => ({
      handle: f.handle,
      title: f.title,
      range: f.range,
      accentHex: f.accentHex,
    }));
    expect(actual).toEqual(LOCKED_FLAVOR_IDENTITY);
  });
});
