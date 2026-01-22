import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { ProgramasHero } from '@/components/sections/programas/ProgramasHero';
import { NosotrosPropuestaValorSection } from '@/components/nosotros/NosotrosPropuestaValorSection';
import { NosotrosTestimonioVideoSection } from '@/components/nosotros/NosotrosTestimonioVideoSection';
import { ProgramasModeloIntervencionSection } from '@/components/sections/programas/ProgramasModeloIntervencionSection';
import { ProgramasProyectosSection } from '@/components/sections/programas/ProgramasProyectosSection';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Programas',
  description: 'Descubre nuestros programas de capacitación, inclusión digital y transformación social para comunidades.',
  openGraph: {
    title: 'Programas',
    description: 'Descubre nuestros programas de capacitación, inclusión digital y transformación social para comunidades.',
    url: '/programas',
    type: 'website',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Programas',
      },
    ],
  },
};

export default function ProgramasPage() {
  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <ProgramasHero />
      <NosotrosPropuestaValorSection />
      <NosotrosTestimonioVideoSection />
      <ProgramasProyectosSection />
      <ProgramasModeloIntervencionSection />
      {/* Aquí irán las demás secciones de Programas */}
      <Footer />
    </main>
  );
}
