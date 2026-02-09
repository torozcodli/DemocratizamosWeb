import type { Metadata } from 'next';
import { Inter, Orbitron, Tektur } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { siteConfig } from '@/config/site';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { robotsDirectives } from '@/lib/seo/env';
import { getCanonicalBaseUrl } from '@/config/site';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
// Fuente tech principal: Orbitron Bold (700) - estilo cuadrado/futurista
const orbitron = Orbitron({ 
  subsets: ['latin'], 
  variable: '--font-tech', 
  weight: ['700'] 
});
// Alternativa: Tektur Bold (700) - más cuadrada si Orbitron no es suficiente
const tektur = Tektur({ 
  subsets: ['latin'], 
  variable: '--font-tech-alt', 
  weight: ['700'] 
});

// Generate metadata for root layout
// Uses canonical base URL (production domain) for consistency
export async function generateMetadata(): Promise<Metadata> {
  const robots = robotsDirectives();
  const canonicalBase = getCanonicalBaseUrl();

  return {
    metadataBase: new URL(canonicalBase),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      'tecnología',
      'inclusión digital',
      'educación',
      'México',
      'brecha digital',
      'capacitación',
    ],
    authors: [{ name: siteConfig.name }],
    robots: {
      index: robots.index,
      follow: robots.follow,
      ...(robots.noarchive && { archive: false }),
      ...(robots.nocache && { 'max-image-preview': 'none' }),
    },
    icons: {
      icon: [{ url: '/favicon.ico' }],
      shortcut: ['/favicon.ico'],
    },
    alternates: {
      canonical: canonicalBase,
    },
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      url: canonicalBase,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: `${canonicalBase}/og/og-default.png`,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [`${canonicalBase}/og/og-default.png`],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sesión: no se obtiene en el layout para evitar JWT_SESSION_ERROR si la cookie es inválida; SessionProvider la pide en cliente vía /api/auth/session.
  // JSON-LD structured data
  const organizationSchema = organizationJsonLd();
  const websiteSchema = websiteJsonLd();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} ${tektur.variable} ${inter.className}`}>
        <SessionProvider>
          <ThemeProvider>
            <PostHogProvider>{children}</PostHogProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

