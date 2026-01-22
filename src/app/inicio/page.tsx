import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { InclusionDigitalSection } from '@/components/sections/InclusionDigitalSection';
import { Ribbon } from '@/components/ui/Ribbon';
import { AlliesSection } from '@/components/sections/AlliesSection';
import { LatestSection } from '@/components/sections/LatestSection';
import { Footer } from '@/components/sections/Footer';

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const base = new URL(`${proto}://${host}`);

  return {
    title: 'Inicio',
    description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
    openGraph: {
      title: 'Inicio',
      description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
      url: new URL('/inicio', base).toString(),
      type: 'website',
      images: [
        {
          url: new URL('/og/og-default.png', base).toString(),
          width: 1200,
          height: 630,
          alt: 'Democratizamos la Innovación',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Inicio',
      description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
      images: [new URL('/og/og-default.png', base).toString()],
    },
  };
}

export default function InicioPage() {
  return (
    <main className="min-h-screen w-full p-0 m-0">
      <Navbar />
      <Hero />
      <About />
      <InclusionDigitalSection />
      <Ribbon />
      <AlliesSection />
      <LatestSection />
      <Footer />
    </main>
  );
}
