import { Navbar } from '@/components/sections/Navbar';
import { ProgramasHero } from '@/components/sections/programas/ProgramasHero';
import { NosotrosPropuestaValorSection } from '@/components/nosotros/NosotrosPropuestaValorSection';
import { NosotrosTestimonioVideoSection } from '@/components/nosotros/NosotrosTestimonioVideoSection';
import { ProgramasModeloIntervencionSection } from '@/components/sections/programas/ProgramasModeloIntervencionSection';
import { Footer } from '@/components/sections/Footer';

export default function ProgramasPage() {
  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <ProgramasHero />
      <NosotrosPropuestaValorSection />
      <NosotrosTestimonioVideoSection />
      <ProgramasModeloIntervencionSection />
      {/* Aquí irán las demás secciones de Programas */}
      <Footer />
    </main>
  );
}
