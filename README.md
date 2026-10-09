# CAPSHOT — SHI-28

Premium D2C marketing site for the CAPSHOT flavor-cap product. Mobile-first,
ad-driven, pre-launch waitlist conversion funnel. Phase 6 flips the CTA
destination from WhatsApp to Shopify checkout with a 3-file edit.

## Setup

```bash
npm install
npx playwright install chromium   # or rely on system Chrome via channel: 'chrome'
```

Node ≥ 22.22 is required (React Router v8 floor). This project is tested on
Node 22.23.

## Dev

```bash
npm run dev        # Vite on http://localhost:5173
```

## Build

```bash
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # serves dist/ on http://localhost:4173
```

## E2E tests

```bash
npm run test:e2e   # Playwright, 9 route + build + a11y assertions
```

## Deploy

Target: Vercel static (CDN) + Vercel Edge Functions for `/api/track-lead`
(Phase 3).

```bash
vercel deploy
```

### Environment variables (Phase 3)

| Var | Scope | Purpose |
|-----|-------|---------|
| `VITE_META_PIXEL_ID` | Client (public) | Meta Pixel tag ID — safe to ship in bundle |
| `META_CAPI_ACCESS_TOKEN` | Server-only | Conversions API access token — NEVER prefix `VITE_` |
| `META_CAPI_DATASET_ID` | Server-only | CAPI dataset ID |

Values provided by the client at deploy time. Not required for Phase 1 ship.
