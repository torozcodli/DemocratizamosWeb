/**
 * Environment detection utilities for SEO
 */

export const isProd = process.env.VERCEL_ENV === 'production';

export interface RobotsDirectives {
  index: boolean;
  follow: boolean;
  noarchive?: boolean;
  nocache?: boolean;
}

/**
 * Get robots directives based on environment
 * In non-production, returns noindex, nofollow
 */
export function robotsDirectives(): RobotsDirectives {
  if (isProd) {
    return {
      index: true,
      follow: true,
    };
  }

  return {
    index: false,
    follow: false,
    noarchive: true,
    nocache: true,
  };
}
