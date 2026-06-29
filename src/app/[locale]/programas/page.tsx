import { buildBaseMetadata } from '@/lib/seo/metadata';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Navbar } from '@/components/sections/Navbar';
import { ProgramasHero } from '@/components/sections/programas/ProgramasHero';
import { NosotrosPropuestaValorSection } from '@/components/nosotros/NosotrosPropuestaValorSection';
import { NosotrosTestimonioVideoSection } from '@/components/nosotros/NosotrosTestimonioVideoSection';
import { ProgramasModeloIntervencionSection } from '@/components/sections/programas/ProgramasModeloIntervencionSection';
import { ProgramasProyectosSection } from '@/components/sections/programas/ProgramasProyectosSection';
import {
  InternalProgramasSection,
  type InternalProgramItem,
} from '@/components/sections/programas/InternalProgramasSection';
import { Footer } from '@/components/sections/Footer';
import { prepareSumaExperienceCardsForDisplay } from '@/modules/suma-impacto/adapter';
import { getSumaImpactoExperiences } from '@/modules/suma-impacto/client';
import { getSumaImpactoEnv } from '@/modules/suma-impacto/env';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { resolveProgram } from '@/lib/i18n/resolve';
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
    const { baseUrl } = getSumaImpactoEnv();
    return {
      items: prepareSumaExperienceCardsForDisplay(sumaResponse.data, { sumaBaseUrl: baseUrl }),
      hasError: false,
    };
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

async function getInternalProgramsSafe(locale: string): Promise<InternalProgramItem[]> {
  try {
    const docs = await ProgramController.listCarouselPrograms();
    return docs
      .map((doc) => resolveProgram(doc, locale))
      .filter((p): p is NonNullable<typeof p> => p !== null && !!p.slug && !!p.title)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        shortDescription: p.shortDescription ?? null,
        imageUrl: (p as any).imageUrl ?? null,
        externalWebsiteUrl: typeof (p as any).externalWebsiteUrl === 'string' ? (p as any).externalWebsiteUrl : null,
        status: ((p as any).status === 'published' || (p as any).status === 'draft')
          ? (p as any).status as 'published' | 'draft'
          : null,
        info: p.info
          ? {
              date: p.info.date ?? null,
              time: p.info.time ?? null,
              location: p.info.location ?? null,
              level: p.info.level ?? null,
              duration: p.info.duration ?? null,
              instructor: p.info.instructor ?? null,
            }
          : null,
      }));
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[programas] Failed to load internal programs');
    }
    return [];
  }
}

interface ProgramasPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProgramasPage({ params }: ProgramasPageProps) {
  const { locale } = await params;

  const [session, { items: experienceCards, hasError: experiencesHasError }, internalPrograms] =
    await Promise.all([
      getServerSession(authOptions),
      getProgramasExperienceCardsSafe(),
      getInternalProgramsSafe(locale),
    ]);

  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <ProgramasHero />
      <NosotrosPropuestaValorSection />
      <NosotrosTestimonioVideoSection />
      <InternalProgramasSection items={internalPrograms} locale={locale} isAdmin={session?.user?.isAdmin ?? false} />
      <ProgramasProyectosSection items={experienceCards} hasError={experiencesHasError} />
      <ProgramasModeloIntervencionSection />
      <Footer />
    </main>
  );
}
