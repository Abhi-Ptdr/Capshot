import { Link } from 'react-router';
import { PrimaryCTA } from '@/components/ui/PrimaryCTA';

/**
 * Phase 1 Plan 02 — Branded 404 fallback. Headline per CONTEXT D-17 default
 * (playful on-brand English). Uses Hero display scale (36px/56px) per
 * UI-SPEC §Component 7. The actual HTTP 404 status is served by the
 * `spa-fallback-with-404` preview plugin + `vercel.json` in production.
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
        <div className="mx-auto max-w-[28rem] text-center">
          <h1 className="text-4xl font-bold sm:text-[56px]">
            404 — looks like you took a wrong twist.
          </h1>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            This page doesn&apos;t exist. The flavor still does.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex justify-center">
              <PrimaryCTA size="md" />
            </div>
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
