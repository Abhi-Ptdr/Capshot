/**
 * Shared brand SVGs for Instagram / Facebook / WhatsApp.
 *
 * lucide-react 1.53 doesn't ship these three glyphs natively; defining them
 * inline (not via <img>) keeps them tree-shaken, styleable via currentColor,
 * and consistent with the Lucide geometric aesthetic used elsewhere.
 *
 * Used by Footer.tsx (desktop social column) and HamburgerMenu.tsx (mobile
 * drawer socials). Changing the glyph here updates both touchpoints.
 */

type GlyphProps = { size?: number };

export function InstagramGlyph({ size = 18 }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function FacebookGlyph({ size = 18 }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function WhatsAppGlyph({ size = 18 }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a0.5 .5 0 0 0 1 0V9a0.5 .5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0-1h-1a0.5 .5 0 0 0 0 1" />
    </svg>
  );
}
