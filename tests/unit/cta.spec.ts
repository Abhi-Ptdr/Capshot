import { describe, it, expect } from 'vitest';
import { getCta, ctaConfig } from '@/config/cta';

/**
 * Phase 1 Plan 02 — CTA swap-point truth.
 *
 * Locks CONTEXT D-07 (label TRY CAPSHOT), D-08 (wa.me pre-filled message
 * body), D-09 (WhatsApp Business number +91 9203975762). The label +
 * message + number live in src/config/cta.ts and nowhere else — this
 * is the single file Phase 6 edits to swap destination.
 *
 * Phase 3.1 Plan 01 extension (D3.1-06): A second describe block below
 * exercises `getCta('bundles.{trial|fitness|bulk}')` — the dotted-string
 * bundle-slot API. The Phase 1 primary/secondary/nav contract stays
 * byte-identical.
 */

describe('cta config — primary destination (CONTEXT D-07/D-08/D-09)', () => {
  it('getCta("primary").href points at wa.me/919203975762 with URL-encoded message', () => {
    expect(getCta('primary').href).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);
  });

  it('getCta("primary").label is the locked CONTEXT D-07 string "TRY CAPSHOT"', () => {
    expect(getCta('primary').label).toBe('TRY CAPSHOT');
  });

  it('getCta("primary") returns the full CtaDestination shape with ariaLabel + trackingId', () => {
    const cta = getCta('primary');
    expect(cta.kind).toBe('whatsapp');
    expect(cta.ariaLabel).toBe('Try CAPSHOT — join the waitlist on WhatsApp');
    expect(cta.trackingId).toBe('cta_primary_whatsapp');
  });

  it('WhatsApp message body uses %21 for ! per wa.me URL spec (CONTEXT D-09)', () => {
    // The literal "Hi!" must encode as "Hi%21" — raw "!" is invalid in wa.me URLs
    expect(getCta('primary').href).toContain('Hi%21');
    expect(getCta('primary').href).toContain('waitlist');
  });
});

describe('cta config — bundle slots (D3.1-06 Phase 3.1 wiring)', () => {
  it('getCta("bundles.trial").href carries &tier=trial and matches wa.me pattern', () => {
    expect(getCta('bundles.trial').href).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);
    expect(getCta('bundles.trial').href).toContain('&tier=trial');
  });

  it('getCta("bundles.fitness").href carries &tier=fitness query', () => {
    expect(getCta('bundles.fitness').href).toContain('&tier=fitness');
  });

  it('getCta("bundles.bulk").href carries &tier=bulk query', () => {
    expect(getCta('bundles.bulk').href).toContain('&tier=bulk');
  });

  it('every bundle CTA uses the phase-invariant label "Join waitlist for early access" (D3.1-06)', () => {
    for (const slot of ['bundles.trial', 'bundles.fitness', 'bundles.bulk'] as const) {
      expect(getCta(slot).label).toBe('Join waitlist for early access');
    }
  });

  it('every bundle CTA kind is "whatsapp" (Phase 3.1 pre-launch destination)', () => {
    for (const slot of ['bundles.trial', 'bundles.fitness', 'bundles.bulk'] as const) {
      expect(getCta(slot).kind).toBe('whatsapp');
    }
  });

  it('wa.me %21 encoding is preserved on every bundle CTA', () => {
    for (const slot of ['bundles.trial', 'bundles.fitness', 'bundles.bulk'] as const) {
      expect(getCta(slot).href).toContain('Hi%21');
    }
  });

  it('ctaConfig.bundles.{trial,fitness,bulk} are non-empty strings (Phase 3.1 populated — replaces Phase 1 stub-empty assertion)', () => {
    expect(ctaConfig.bundles.trial.length).toBeGreaterThan(0);
    expect(ctaConfig.bundles.fitness.length).toBeGreaterThan(0);
    expect(ctaConfig.bundles.bulk.length).toBeGreaterThan(0);
  });
});
