import type { Metadata } from 'next';
import { Inter, Orbitron, Tektur } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { siteConfig } from '@/config/site';

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

export const metadata: Metadata = {
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
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} ${tektur.variable} ${inter.className}`}>
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

