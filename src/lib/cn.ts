import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Composes `clsx` + `tailwind-merge` so Tailwind utilities passed via
 * variant APIs (and downstream `className` overrides) resolve correctly
 * without duplicate / conflicting utilities. Pattern defined in
 * UI-SPEC §Design System and locked for Phase 6.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
