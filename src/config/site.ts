/**
 * Get canonical base URL (production domain)
 * NEVER uses VERCEL_URL - always returns production domain for canonical URLs
 */
export function getCanonicalBaseUrl(): string {
  // Allow override via environment variable (for canonical URLs)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to production domain
  return 'https://democratizamoslanovacion.org';
}

/**
 * Get request base URL (can use VERCEL_URL for previews)
 * Use this for non-canonical purposes (logs, previews, etc.)
 */
export function getRequestBaseUrl(): string {
  // In Vercel preview deployments, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback to canonical base
  return getCanonicalBaseUrl();
}

// Calculate base URL once at module load (for backward compatibility)
// This is used by siteConfig.url but should be replaced with getCanonicalBaseUrl() where appropriate
const baseUrl = getCanonicalBaseUrl();

export const siteConfig = {
  name: 'Democratizamos la Innovación',
  description:
    'Transformamos vidas a través de la Tecnología. Llevando habilidades digitales a quienes más las necesitan.',
  url: baseUrl,
  phone: '+52 614 141 8003',
  email: 'administracion@democratizamoslanovacion.org',
  navigation: [
    { label: 'Inicio', href: '/inicio' },
    { label: 'Nosotros', href: '/nosotros' },
    { label: 'Programas', href: '/programas' },
    { label: 'Blog/Publicaciones', href: '/blog' },
    { label: 'Herramientas', href: '/herramientas' },
    { label: 'Academia', href: '#' },
  ],
  cta: {
    label: 'Contacto',
    href: 'https://wa.me/+5216145871758',
  },
  social: {
    facebook: 'https://www.facebook.com/share/1ANP7cJHGf/?mibextid=wwXIfr',
    twitter: '#',
    instagram: 'https://www.instagram.com/democratizamoslainnovacion?igsh=NXJ3YjFudTFnZmNn',
    linkedin: 'https://www.linkedin.com/company/democratizamoslainnovacion/posts/?feedView=all',
  },
} as const;

