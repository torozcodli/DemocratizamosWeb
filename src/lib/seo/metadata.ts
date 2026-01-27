/**
 * Centralized metadata builder for consistent SEO
 */

import type { Metadata } from 'next';
import { robotsDirectives } from './env';
import { canonicalUrl, absoluteUrl } from './url';
import { getCanonicalBaseUrl } from '@/config/site';
import { siteConfig } from '@/config/site';

export interface BaseMetadataOptions {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  twitterImage?: string;
  keywords?: string[];
}

/**
 * Build consistent metadata for all pages
 * Includes canonical, OpenGraph, Twitter, and robots directives
 */
export function buildBaseMetadata({
  title,
  description,
  path,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  twitterImage,
  keywords,
}: BaseMetadataOptions): Metadata {
  const canonical = canonicalUrl(path);
  const robots = robotsDirectives();
  
  // Default OG image
  const defaultOgImage = absoluteUrl('/og/og-default.png');
  const finalOgImage = ogImage ? absoluteUrl(ogImage) : defaultOgImage;
  const finalTwitterImage = twitterImage ? absoluteUrl(twitterImage) : finalOgImage;

  const metadata: Metadata = {
    metadataBase: new URL(getCanonicalBaseUrl()),
    title,
    description,
    keywords: keywords || [
      'tecnología',
      'inclusión digital',
      'educación',
      'México',
      'brecha digital',
      'capacitación',
    ],
    alternates: {
      canonical,
    },
    robots: {
      index: robots.index,
      follow: robots.follow,
      ...(robots.noarchive && { archive: false }),
      ...(robots.nocache && { 'max-image-preview': 'none' }),
    },
    openGraph: {
      type: ogType,
      locale: 'es_MX',
      url: canonical,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [finalTwitterImage],
    },
  };

  return metadata;
}
