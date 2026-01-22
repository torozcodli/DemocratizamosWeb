import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter, Orbitron, Tektur } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { siteConfig } from '@/config/site';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

// Generate metadata dynamically based on request headers
// This ensures og:image and og:url use the same host as the request
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  // Get host from x-forwarded-host (Vercel) or host header
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  // Get protocol from x-forwarded-proto (Vercel) or default to https
  const proto = h.get('x-forwarded-proto') ?? 'https';
  // Construct base URL from request headers
  const base = new URL(`${proto}://${host}`);

  return {
    metadataBase: base,
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
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      url: new URL('/', base).toString(),
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: new URL('/og/og-default.png', base).toString(),
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
      images: [new URL('/og/og-default.png', base).toString()],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtener sesión UNA VEZ en el servidor para evitar múltiples llamadas a /api/auth/session
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} ${tektur.variable} ${inter.className}`}>
        <SessionProvider session={session}>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

