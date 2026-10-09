import { describe, it, expect } from 'vitest';
import { getCta, ctaConfig } from '@/config/cta';

/**
 * Phase 1 Plan 02 — CTA swap-point truth.
 *
 * Locks CONTEXT D-07 (label TRY CAPSHOT), D-08 (wa.me pre-filled message
 * body), D-09 (WhatsApp Business number +91 9203975762). The label +
 * message + number live in src/config/cta.ts and nowhere else — this
 * is the single file Phase 6 edits to swap destination.
 */

describe('cta config — primary destination (CONTEXT D-07/D-08/D-09)', () => {
  it('getCta("primary").href points at wa.me/919203975762 with URL-encoded message', () => {
    expect(getCta('primary').href).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);
  });

  it('getCta("primary").label is the locked CONTEXT D-07 string "TRY CAPSHOT"', () => {
    expect(getCta('primary').label).toBe('TRY CAPSHOT');
  });

  it('bundles slots are stubbed empty until Phase 6 flips features.ENABLE_BUNDLES=true', () => {
    expect(ctaConfig.bundles.trial).toBe('');
    expect(ctaConfig.bundles.fitness).toBe('');
    expect(ctaConfig.bundles.bulk).toBe('');
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
