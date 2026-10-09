import type { Flavor } from './types';

/**
 * Phase 1 Plan 02 — 16-flavor Phase 1 stub (INFRA-04).
 *
 * Source of truth: `.claude/skills/capshot-catalog/SKILL.md`.
 * Handle, title, range, accentHex are populated. Phase 6 fields
 * (priceInr, shopifyProductId, available) are null until Shopify goes live.
 *
 * Order matters: within each range, flavors appear in the SKILL's listed
 * order. Fruity Blast (9) → Desi & Cool (3) → Premium Sports (4).
 *
 * Image paths point at `/flavors/<handle>.png` — these PNGs land in Phase 2
 * when the flavor-card photo set is produced; Phase 1 ships the paths only
 * so downstream components can resolve them without a code change.
 *
 * Descriptions are deliberately short (<140 chars) and avoid the forbidden
 * stimulant-beverage phrase (Plan 03's CI grep enforces this). Caffeinated
 * SKUs are marked `caffeinated beverage` or similar.
 */

const DOSAGE = {
  light: '3–4 g for 200–250 ml bottle',
  strong: '7–8 g for 350–500 ml bottle',
} as const;

export const flavors: Flavor[] = [
  // ─────────── Fruity Blast (9) ───────────
  {
    handle: 'orange',
    title: 'Orange',
    description: 'Classic orange, instantly. Twist on, shake, drink.',
    images: { cap: '/flavors/orange.png' },
    range: 'fruity-blast',
    accentHex: '#F57C1F',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'mixed-berry',
    title: 'Mixed Berry',
    description: 'Deep berry blend — strawberry, blueberry, raspberry notes.',
    images: { cap: '/flavors/mixed-berry.png' },
    range: 'fruity-blast',
    accentHex: '#6E3482',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'mango',
    title: 'Mango',
    description: 'Ripe Indian mango. Alphonso-forward, no overpowering sugar.',
    images: { cap: '/flavors/mango.png' },
    range: 'fruity-blast',
    accentHex: '#F9B233',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'pineapple',
    title: 'Pineapple',
    description: 'Sunny pineapple hit. Tropical without the syrupy aftertaste.',
    images: { cap: '/flavors/pineapple.png' },
    range: 'fruity-blast',
    accentHex: '#F7CA18',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'watermelon',
    title: 'Watermelon',
    description: 'Juicy summer watermelon. Shake karo, cool down.',
    images: { cap: '/flavors/watermelon.png' },
    range: 'fruity-blast',
    accentHex: '#E63950',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'guava',
    title: 'Guava',
    description: 'Pink guava with a soft kick. Nostalgic, familiar, bright.',
    images: { cap: '/flavors/guava.png' },
    range: 'fruity-blast',
    accentHex: '#F297B1',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'pomegranate',
    title: 'Pomegranate',
    description: 'Pomegranate red, deeply fruity. Antioxidant forward.',
    images: { cap: '/flavors/pomegranate.png' },
    range: 'fruity-blast',
    accentHex: '#B4213B',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'strawberry',
    title: 'Strawberry',
    description: 'Garden strawberry. Soft pink, sweet-tart finish.',
    images: { cap: '/flavors/strawberry.png' },
    range: 'fruity-blast',
    accentHex: '#E85A75',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'apple',
    title: 'Apple',
    description: 'Crisp green apple. Clean, no cloying sweetness.',
    images: { cap: '/flavors/apple.png' },
    range: 'fruity-blast',
    accentHex: '#8FC13E',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },

  // ─────────── Desi & Cool (3) ───────────
  {
    handle: 'citrus-mint',
    title: 'Citrus Mint',
    description: 'Mint-forward citrus hit. Cooling, bright, nimbu-pani cousin.',
    images: { cap: '/flavors/citrus-mint.png' },
    range: 'desi-cool',
    accentHex: '#7ED6A5',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'jaljeera',
    title: 'Jaljeera',
    description: 'Classic Indian jaljeera. Cumin, mint, tangy black salt.',
    images: { cap: '/flavors/jaljeera.png' },
    range: 'desi-cool',
    accentHex: '#7A5A36',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'ors-electrolyte',
    title: 'ORS (Electrolyte)',
    description: 'Oral rehydration salts in a cap. Hot days, long rides, recovery.',
    images: { cap: '/flavors/ors-electrolyte.png' },
    range: 'desi-cool',
    accentHex: '#4FA3D1',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },

  // ─────────── Premium Sports (4) ───────────
  {
    handle: 'japanese-matcha',
    title: 'Japanese Matcha',
    description: 'Ceremonial-grade matcha. Clean caffeinated beverage, no crash.',
    images: { cap: '/flavors/japanese-matcha.png' },
    range: 'premium-sports',
    accentHex: '#5B8A3A',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'black-pump',
    title: 'Black Pump',
    description: 'Pre-workout caffeinated beverage. Dark, strong, training-day fuel.',
    images: { cap: '/flavors/black-pump.png' },
    range: 'premium-sports',
    accentHex: '#1A1A1A',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'java-pump',
    title: 'Java Pump',
    description: 'Dark coffee caffeinated beverage. Pre-workout focus + aroma.',
    images: { cap: '/flavors/java-pump.png' },
    range: 'premium-sports',
    accentHex: '#3E2817',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
  {
    handle: 'coffee',
    title: 'Coffee',
    description: 'Everyday coffee cap. Smooth, mid-roast, grab-and-go.',
    images: { cap: '/flavors/coffee.png' },
    range: 'premium-sports',
    accentHex: '#6B4423',
    dosage: { ...DOSAGE },
    shopifyProductId: null,
    priceInr: null,
    available: null,
  },
];
