# CAPSHOT — SHI-28

Premium D2C marketing site for the CAPSHOT flavor-cap product. Mobile-first,
ad-driven, pre-launch waitlist conversion funnel. Phase 6 flips the CTA
destination from WhatsApp to Shopify checkout with a 3-file edit.

## Setup

```bash
npm install
npx playwright install chromium   # or rely on system Chrome via channel: 'chrome'
```

**Node ≥ 22.22 is required** (React Router v8 floor). This project is tested
on Node 22.23. The GitHub Actions CI workflow pins `node-version: '22.22'`.

## Dev

```bash
npm run dev        # Vite on http://localhost:5173
```

## Build

```bash
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # serves dist/ on http://localhost:4173
```

## Test suites

```bash
npm run test       # Vitest — unit specs under tests/unit/*.spec.{ts,tsx}
npm run test:e2e   # Playwright — e2e under tests/e2e/*.spec.ts (system Chrome)
npm run grep:ci    # Phase 1 CI greps (INFRA-06) — see "CI Guardrails" below
```

As of Phase 1 Plan 03: **24 Vitest + 28 Playwright = 52 automated tests**.

## Environment variables

Copy `.env.example` to `.env.local` (gitignored) for local dev. For
deployments, set these in the Vercel dashboard under
Project → Settings → Environment Variables.

| Var                      | Scope           | Browser visibility           | Purpose                                                                                        |
|--------------------------|-----------------|------------------------------|------------------------------------------------------------------------------------------------|
| `VITE_META_PIXEL_ID`     | Client (public) | **Available in browser: ON** | Meta Pixel tag ID — safe to ship in bundle (not a secret per Meta docs)                        |
| `META_CAPI_ACCESS_TOKEN` | Server only     | **Available in browser: OFF**| Conversions API access token — **never prefix with `VITE_`**                                   |
| `META_CAPI_DATASET_ID`   | Server only     | **Available in browser: OFF**| CAPI dataset ID (typically same as Pixel ID for standard setups)                               |

**Security contract (threat register T-03-01):** The grep assertion
`grep -r "META_CAPI_ACCESS_TOKEN" dist/` must return zero matches after any
`npm run build`. Vite only inlines `VITE_*` vars into the client bundle at
build time, so the correct-prefix discipline on these two vars is what
keeps the access token off the wire.

## Deploy

Target: Vercel static (CDN) + Vercel Edge Functions for `/api/track-lead`.
`vercel.json` declares the edge runtime explicitly:

```json
"functions": { "api/track-lead.ts": { "runtime": "edge" } }
```

```bash
vercel deploy          # publishes a preview URL
vercel --prod          # promotes to production
```

### Verify Lead-event dedup after deploy

1. Set `VITE_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_DATASET_ID`
   in Vercel env (Preview + Production).
2. Deploy: `vercel deploy`.
3. On a real phone, open Meta Events Manager → Data Sources → [Pixel] →
   **Test Events**. Paste the Vercel Preview URL into the Test Browser
   Events panel; open the URL.
4. Tap `TRY CAPSHOT`.
5. Within 30 seconds, Events Manager should log **exactly one** `Lead`
   event with the "Deduplicated" indicator. If two events appear, the
   client-side Pixel `event_id` and the server-side CAPI `event_id` do not
   match — regression. Investigate before approving the Phase 1 close-out.

Probe the raw CAPI endpoint directly:

```bash
curl -X POST https://<preview>.vercel.app/api/track-lead \
  -H "Content-Type: application/json" \
  -d '{"event_id":"test-123","event_source_url":"https://<preview>/","event_name":"Lead"}'
# → {"ok":true}  (env set + Meta accepts)
# → {"skipped":true,"reason":"env-missing"}  (deploy without env — graceful)
# → {"ok":false,"status":400,"text":"..."}  (Meta rejects — token wrong?)
```

## CI Guardrails

GitHub Actions (`.github/workflows/ci.yml`) runs on every PR to `main`:
lint → grep gates → Vitest → `tsc --noEmit` → build → Playwright e2e.

The grep gate script (`scripts/ci-grep-forbidden-strings.mjs`) enforces
**INFRA-06** by failing any commit that introduces either of:

1. **`wa.me` outside `src/config/cta.ts`** — the WhatsApp destination is the
   single Phase 6 swap point. CI fails if any other `src/` file references
   the string so no component accidentally hard-codes the URL.
2. **`energy drink` (case-insensitive) anywhere in `src/`** — the FSSAI
   2026 regulation prohibits this phrase for products not categorized as
   energy drinks. CAPSHOT is **not** an energy drink; the Premium Sports
   range uses "caffeinated beverages" (research/SUMMARY.md §1, capshot-
   commerce-rollout SKILL §Pitfalls to avoid). Catalog and marketing copy
   must respect this.

Run the gate locally:

```bash
npm run grep:ci
# → "✅ No forbidden strings found in src/"  (passes)
# → "❌ wa.me outside src/config/cta.ts: src/sections/Foo.tsx:42"  (fails)
```

Tests scanning `tests/` CAN reference `wa.me` (anchor href assertions) —
the gate scope is deliberately `src/` only.
