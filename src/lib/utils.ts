import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price to a locale currency string
 */
export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Format a date to a locale string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate a random hexadecimal color
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Truncate a string to a specified length
 */
export function truncateString(str: string, num: number): string {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

/**
 * Check if the current environment is a browser
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Generates a glass background style with given parameters
 */
export function glassBackground({
  opacity = 0.2,
  blur = 10,
  hueRotate = 0,
  saturation = 1,
}: {
  opacity?: number;
  blur?: number;
  hueRotate?: number;
  saturation?: number;
} = {}) {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) hue-rotate(${hueRotate}deg) saturate(${saturation})`,
    WebkitBackdropFilter: `blur(${blur}px) hue-rotate(${hueRotate}deg) saturate(${saturation})`,
  };
}

/**
 * Slugify a string (convert to URL-friendly slug)
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Get random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (!isBrowser) return false;
  return window.innerWidth <= 768;
}