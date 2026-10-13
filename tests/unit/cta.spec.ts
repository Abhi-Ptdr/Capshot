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
  // WR-01: tier attribution rides on the `text` body (the only wa.me param
  // forwarded to the WhatsApp client); dropped `&tier=` query assertions
  // have been replaced with body-text assertions below.
  it('getCta("bundles.trial").href encodes "Interested in: trial" in the text body', () => {
    expect(getCta('bundles.trial').href).toMatch(/^https:\/\/wa\.me\/919203975762\?text=/);
    expect(getCta('bundles.trial').href).toContain('Interested%20in%3A%20trial');
  });

  it('getCta("bundles.fitness").href encodes "Interested in: fitness" in the text body', () => {
    expect(getCta('bundles.fitness').href).toContain('Interested%20in%3A%20fitness');
  });

  it('getCta("bundles.bulk").href encodes "Interested in: bulk" in the text body', () => {
    expect(getCta('bundles.bulk').href).toContain('Interested%20in%3A%20bulk');
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

describe('cta config — about-waitlist slot (D3.2-14 Phase 3.2 wiring)', () => {
  // WR-01 convention: tier attribution rides on the `text` body (the only
  // wa.me param forwarded to the WhatsApp client). About-page leads carry
  // the body-text ride-along "Interested in: about-waitlist" so the
  // Business inbox buckets About-page leads separately from Hero/Bundles.
  it('getCta("about-waitlist").kind is "whatsapp"', () => {
    expect(getCta('about-waitlist').kind).toBe('whatsapp');
  });

  it('getCta("about-waitlist").href targets wa.me/919203975762 with text param', () => {
    expect(getCta('about-waitlist').href).toMatch(
      /^https:\/\/wa\.me\/919203975762\?text=/,
    );
  });

  it('getCta("about-waitlist").href preserves %21 encoding (Phase 1 D-09)', () => {
    expect(getCta('about-waitlist').href).toContain('Hi%21');
  });

  it('getCta("about-waitlist").href encodes "Interested in: about-waitlist" body-text ride-along (WR-01)', () => {
    expect(getCta('about-waitlist').href).toContain(
      'Interested%20in%3A%20about-waitlist',
    );
  });

  it('getCta("about-waitlist").trackingId is "cta_about_waitlist_whatsapp"', () => {
    expect(getCta('about-waitlist').trackingId).toBe(
      'cta_about_waitlist_whatsapp',
    );
  });

  it('getCta("about-waitlist").label is a non-empty string (planner picked "JOIN WAITLIST" per D3.2-14)', () => {
    const label = getCta('about-waitlist').label;
    expect(typeof label).toBe('string');
    expect(label.length).toBeGreaterThan(0);
  });

  it('getCta("about-waitlist").ariaLabel mentions "waitlist" (case-insensitive)', () => {
    const aria = getCta('about-waitlist').ariaLabel ?? '';
    expect(aria.toLowerCase()).toContain('waitlist');
  });
});
