import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { NosotrosHero } from '@/components/nosotros/NosotrosHero';
import { NosotrosQuienesSomos } from '@/components/nosotros/NosotrosQuienesSomos';
import { MissionVisionSection } from '@/components/nosotros/MissionVisionSection';

export default function NosotrosPage() {
  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <NosotrosHero />
      <NosotrosQuienesSomos />
      <MissionVisionSection />
      {/* Aquí irán las demás secciones de la página Nosotros */}
      <Footer />
    </main>
  );
}

