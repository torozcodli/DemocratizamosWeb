/**
 * JSON-LD structured data generators
 */

import { getCanonicalBaseUrl } from '@/config/site';
import { siteConfig } from '@/config/site';
import { absoluteUrl } from './url';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Organization JSON-LD schema
 */
export function organizationJsonLd() {
  const baseUrl = getCanonicalBaseUrl();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: baseUrl,
    logo: absoluteUrl('/solar/icons/Demoinnlogo.svg'),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      contactType: 'customer service',
      email: siteConfig.email,
    },
    sameAs: ([
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
    ] as string[]).filter((url) => url && url !== '#'),
  };
}

/**
 * WebSite JSON-LD schema
 */
export function websiteJsonLd() {
  const baseUrl = getCanonicalBaseUrl();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: baseUrl,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };
}

/**
 * BreadcrumbList JSON-LD schema
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

/**
 * Article JSON-LD schema for blog posts
 */
export function articleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  url: string;
}) {
  const baseUrl = getCanonicalBaseUrl();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: absoluteUrl(image),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/solar/icons/Demoinnlogo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(url),
    },
  };
}
