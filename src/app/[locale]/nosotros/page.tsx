import { buildBaseMetadata } from '@/lib/seo/metadata';
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

export const metadata = buildBaseMetadata({
  title: 'Nosotros',
  description: 'Conoce nuestra misión, visión, valores y el equipo que trabaja para democratizar la innovación y reducir la brecha digital.',
  path: '/nosotros',
});

export default async function NosotrosPage() {
  return (
    <main id="nosotros-page" className="w-full overflow-x-clip">
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
