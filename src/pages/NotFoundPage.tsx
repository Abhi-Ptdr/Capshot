import { Link } from 'react-router';
import Button from '@/components/primitives/Button';

/**
 * Phase 1 Plan 01: branded 404 fallback. Headline per CONTEXT D-17 default
 * (playful on-brand English). Uses Hero display scale (36px/56px) per
 * UI-SPEC §Component 7 since the playful line "deserves weight".
 *
 * `<meta name="robots" content="noindex">` keeps crawlers from indexing
 * 404 variants; the actual HTTP 404 status is served by the preview
 * middleware (dev/preview) and `vercel.json` (production).
 */
export default function NotFoundPage() {
  return (
    <>
      <title>404 — CAPSHOT</title>
      <meta name="robots" content="noindex" />
      <main
        id="main"
        tabIndex={-1}
        className="grid min-h-[calc(100dvh-56px)] place-items-center px-4"
      >
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-4xl font-bold sm:text-[56px]">
            404 — looks like you took a wrong twist.
          </h1>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            This page doesn&apos;t exist. The flavor still does.
          </p>
          <div className="mt-8 space-y-4">
            <Button
              as="a"
              href="#"
              aria-label="Try CAPSHOT"
              className="h-12 px-5 bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)]"
            >
              TRY CAPSHOT
            </Button>
            <div>
              <Link
                to="/"
                className="text-[color:var(--color-fg-muted)] underline-offset-4 hover:underline"
              >
                Back to home →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
