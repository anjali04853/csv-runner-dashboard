// lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 * This is the standard shadcn/ui utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}