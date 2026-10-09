import type { FlavorRangeMeta } from './types';
import { flavors } from './flavors';

/**
 * Phase 1 Plan 02 — Range metadata derived from flavors.
 *
 * Phase 2's `/flavors` page composes range filters off this. Phase 6's
 * bundles can reference `range` for cross-sell logic.
 *
 * NOTE: the premium-sports tagline uses "caffeinated beverages" per the
 * brand positioning policy — Plan 03's CI grep enforces the ban on the
 * forbidden stimulant-beverage phrase.
 */

export const ranges: FlavorRangeMeta[] = [
  {
    id: 'fruity-blast',
    label: 'Fruity Blast',
    tagline: 'Nine fruit hits for every mood.',
    flavors: flavors.filter((f) => f.range === 'fruity-blast'),
  },
  {
    id: 'desi-cool',
    label: 'Desi & Cool',
    tagline: 'The Indian flavor rack.',
    flavors: flavors.filter((f) => f.range === 'desi-cool'),
  },
  {
    id: 'premium-sports',
    label: 'Premium Sports',
    tagline: 'Caffeinated beverages for training days.',
    flavors: flavors.filter((f) => f.range === 'premium-sports'),
  },
];
