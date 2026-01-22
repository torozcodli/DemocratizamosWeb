// Get base URL dynamically based on environment
// This function is evaluated at module load time, which works for both build and runtime
function getBaseUrl(): string {
  // In Vercel preview deployments, use VERCEL_URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Allow override via environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to production domain
  return 'https://democratizamoslanovacion.org';
}

// Calculate base URL once at module load
const baseUrl = getBaseUrl();

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

