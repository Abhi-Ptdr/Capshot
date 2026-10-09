import { describe, it, expect, afterEach } from 'vitest';
import {
  render,
  screen,
  within,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { HamburgerMenu } from '@/components/ui/HamburgerMenu';
import { getCta } from '@/config/cta';

/**
 * Phase 2 Plan 01 — HamburgerMenu CTA-contract tests (D2-12).
 *
 * Mirrors the Phase 1 cta.spec.ts pattern: the hamburger panel's WhatsApp
 * anchor MUST source its href + tracking ID from `getCta('nav')`. The
 * literal `wa.me` URL is forbidden anywhere outside `src/config/cta.ts`
 * (INFRA-06 CI grep). This test enforces the behavioral contract that
 * backs that grep gate.
 */

afterEach(() => {
  cleanup();
});

function renderMenu() {
  return render(
    <BrowserRouter>
      <HamburgerMenu />
    </BrowserRouter>,
  );
}

describe('<HamburgerMenu /> — nav CTA destination contract (D2-12)', () => {
  it('HC1: WhatsApp link href strictly equals getCta("nav").href', async () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /Open menu/i }));
    const dialog = await screen.findByRole('dialog', undefined, {
      timeout: 1000,
    });
    const link = within(dialog).getByRole('link', { name: /WhatsApp/i });
    expect(link.getAttribute('href')).toBe(getCta('nav').href);
  });

  it('HC2: WhatsApp link data-cta attribute equals getCta("nav").trackingId', async () => {
    renderMenu();
    fireEvent.click(screen.getByRole('button', { name: /Open menu/i }));
    const dialog = await screen.findByRole('dialog', undefined, {
      timeout: 1000,
    });
    const link = within(dialog).getByRole('link', { name: /WhatsApp/i });
    expect(link.getAttribute('data-cta')).toBe(getCta('nav').trackingId);
  });
});
