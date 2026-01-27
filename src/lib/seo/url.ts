/**
 * URL utilities for SEO - canonical URLs and absolute URLs
 */

import { getCanonicalBaseUrl } from '@/config/site';

/**
 * Check if a URL is already absolute
 */
function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

/**
 * Convert a path or URL to an absolute URL
 * If already absolute, returns as-is
 * If relative (starts with /), prepends canonical base URL
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (isAbsoluteUrl(pathOrUrl)) {
    return pathOrUrl;
  }

  const base = getCanonicalBaseUrl();
  // Ensure path starts with /
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

/**
 * Normalize a path for canonical URL:
 * - Remove trailing slash (except for root "/")
 * - Remove query parameters
 * - Remove hash fragments
 */
export function canonicalPath(path: string): string {
  // Remove query and hash
  const [pathOnly] = path.split('?').join('').split('#');
  
  // Remove trailing slash except for root
  if (pathOnly === '/') {
    return '/';
  }
  
  return pathOnly.replace(/\/$/, '');
}

/**
 * Build a canonical URL from a path
 * Uses canonical base URL (production domain)
 */
export function canonicalUrl(path: string): string {
  const normalizedPath = canonicalPath(path);
  const base = getCanonicalBaseUrl();
  return `${base}${normalizedPath}`;
}
