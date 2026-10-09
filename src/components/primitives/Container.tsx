import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Horizontal content lane. Max-width 1200px per UI-SPEC §9. Padding scales
 * 16px → 24px → 32px across sm / lg breakpoints. Phase 2 Hero, Phase 2
 * Flavor grid, Phase 5 FAQ, and Phase 6 Bundles all compose this.
 */
export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
