import { MetadataRoute } from 'next';
import { getCanonicalBaseUrl } from '@/config/site';
import { isProd } from '@/lib/seo/env';

export default function robots(): MetadataRoute.Robots {
  // Block indexing in non-production environments
  if (!isProd) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      // Don't include sitemap in non-production
    };
  }

  // Production: allow all
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${getCanonicalBaseUrl()}/sitemap.xml`,
  };
}

