import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { NosotrosHero } from '@/components/nosotros/NosotrosHero';
import { NosotrosQuienesSomos } from '@/components/nosotros/NosotrosQuienesSomos';
import { MissionVisionSection } from '@/components/nosotros/MissionVisionSection';
import { ValoresSection } from '@/components/nosotros/ValoresSection';
import { PrincipiosAccionSection } from '@/components/nosotros/PrincipiosAccionSection';
import { UbicacionSection } from '@/components/nosotros/UbicacionSection';
import { TeamSection } from '@/components/nosotros/TeamSection';
import { ResultsSection } from '@/components/nosotros/ResultsSection';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce nuestra misión, visión, valores y el equipo que trabaja para democratizar la innovación y reducir la brecha digital.',
  openGraph: {
    title: 'Nosotros',
    description: 'Conoce nuestra misión, visión, valores y el equipo que trabaja para democratizar la innovación y reducir la brecha digital.',
    url: '/nosotros',
    type: 'website',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Nosotros',
      },
    ],
  },
};

export default function NosotrosPage() {
  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <NosotrosHero />
      <NosotrosQuienesSomos />
      <MissionVisionSection />
      <ValoresSection />
      <PrincipiosAccionSection />
      <TeamSection />
      <ResultsSection />
      <UbicacionSection />
      <Footer />
    </main>
  );
}

