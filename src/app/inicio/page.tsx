import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { InclusionDigitalSection } from '@/components/sections/InclusionDigitalSection';
import { Ribbon } from '@/components/ui/Ribbon';
import { AlliesSection } from '@/components/sections/AlliesSection';
import { LatestSection } from '@/components/sections/LatestSection';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
  openGraph: {
    title: 'Inicio',
    description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
    url: '/inicio',
    type: 'website',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Democratizamos la Innovación',
      },
    ],
  },
};

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
