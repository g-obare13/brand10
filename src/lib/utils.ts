import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges and condenses CSS class strings resolving conflicting Tailwind CSS utilities.
 *
 * @param {...ClassValue[]} inputs - Array of class names, conditionals, arrays, or objects.
 * @returns {string} The optimized and merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
