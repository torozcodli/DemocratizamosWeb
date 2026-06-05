import { buildBaseMetadata } from '@/lib/seo/metadata';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/sections/Navbar';
import { ProgramasHero } from '@/components/sections/programas/ProgramasHero';
import { NosotrosPropuestaValorSection } from '@/components/nosotros/NosotrosPropuestaValorSection';
import { NosotrosTestimonioVideoSection } from '@/components/nosotros/NosotrosTestimonioVideoSection';
import { ProgramasModeloIntervencionSection } from '@/components/sections/programas/ProgramasModeloIntervencionSection';
import { ProgramasProyectosSection } from '@/components/sections/programas/ProgramasProyectosSection';
import { Footer } from '@/components/sections/Footer';
import { getSumaImpactoExperiences } from '@/modules/suma-impacto/client';
import { adaptSumaExperiencesToCards } from '@/modules/suma-impacto/adapter';
import type { DemocratizamosExperienceCard } from '@/modules/suma-impacto/types';

export const metadata = buildBaseMetadata({
  title: 'Programas',
  description: 'Descubre nuestros programas de capacitación, inclusión digital y transformación social para comunidades.',
  path: '/programas',
});

async function getProgramasExperienceCardsSafe(): Promise<{
  items: DemocratizamosExperienceCard[];
  hasError: boolean;
}> {
  try {
    const sumaResponse = await getSumaImpactoExperiences();
    if (!sumaResponse.success) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[programas] Suma Impacto returned a failure response');
      }
      return { items: [], hasError: true };
    }
    return { items: adaptSumaExperiencesToCards(sumaResponse.data), hasError: false };
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[programas] Failed to load Suma Impacto experiences', {
        name: error instanceof Error ? error.name : 'UnknownError',
        message: error instanceof Error ? error.message : String(error),
      });
    } else {
      console.error('[programas] Failed to load Suma Impacto experiences');
    }
    return { items: [], hasError: true };
  }
}

export default async function ProgramasPage() {
  const [session, { items: experienceCards, hasError: experiencesHasError }] = await Promise.all([
    getServerSession(authOptions),
    getProgramasExperienceCardsSafe(),
  ]);

  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <ProgramasHero />
      <NosotrosPropuestaValorSection />
      <NosotrosTestimonioVideoSection />
      <ProgramasProyectosSection items={experienceCards} hasError={experiencesHasError} session={session} />
      <ProgramasModeloIntervencionSection />
      <Footer />
    </main>
  );
}
