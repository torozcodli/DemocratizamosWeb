import { headers } from 'next/headers';

/**
 * Get the base URL from request headers
 * This ensures metadata uses the same host as the request (important for preview deployments)
 */
export async function getBaseUrlFromHeaders(): Promise<URL> {
  const h = await headers();
  // Get host from x-forwarded-host (Vercel) or host header
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  // Get protocol from x-forwarded-proto (Vercel) or default to https
  const proto = h.get('x-forwarded-proto') ?? 'https';
  // Construct base URL from request headers
  return new URL(`${proto}://${host}`);
}

/**
 * Create an absolute URL from a relative path using request headers
 */
export async function getAbsoluteUrl(path: string): Promise<string> {
  const base = await getBaseUrlFromHeaders();
  return new URL(path, base).toString();
}
