import type { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/cn';

type SectionProps = {
  children: ReactNode;
  as?: ElementType;
  background?: 'bg' | 'surface';
  id?: string;
  className?: string;
};

/**
 * Vertical page band. Vertical padding scales 32 → 48 → 64 px per UI-SPEC §9.
 * `background` picks between the dominant page tone (`bg`) and the elevated
 * card tone (`surface`) using the Phase 1 semantic tokens from
 * src/index.css. Phase 1 sections sit on `bg` only; `surface` is reserved
 * for Phase 2+ alternating section cadence.
 */
export default function Section({
  children,
  as: As = 'section',
  background = 'bg',
  id,
  className,
}: SectionProps) {
  return (
    <As
      id={id}
      className={cn(
        'py-8 sm:py-12 md:py-16',
        background === 'surface'
          ? 'bg-[color:var(--color-surface)]'
          : 'bg-[color:var(--color-bg)]',
        className,
      )}
    >
      {children}
    </As>
  );
}
