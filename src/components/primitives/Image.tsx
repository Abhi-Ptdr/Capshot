import { cn } from '@/lib/cn';

/**
 * Phase 1 Plan 02 — Image primitive.
 *
 * Enforces CLS-safe `width` + `height` and routes all `<img>` emissions
 * through a single wrapper. Phase 4 (PERF-02) upgrades this to responsive
 * AVIF/WebP/JPG srcset via `vite-imagetools` — API shape stays stable so
 * no section needs refactor at that time.
 *
 * `priority` promotes LCP candidates (hero image): eager load, sync decode,
 * `fetchpriority="high"`. Non-priority images use the browser lazy-load +
 * async decode defaults.
 */

type ImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

export default function Image({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn(className)}
    />
  );
}

export { Image };
