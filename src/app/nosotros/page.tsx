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

