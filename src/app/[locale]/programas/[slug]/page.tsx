import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProgramaDetalleTemplate } from '@/components/programas/ProgramaDetalleTemplate';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { resolveProgram } from '@/lib/i18n/resolve';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';

interface ProgramaPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProgramaPageProps) {
  const { slug, locale } = await params;
  const programa = await ProgramController.getProgramBySlug(slug);
  if (!programa) {
    return { title: 'Programa no encontrado' };
  }
  const resolved = resolveProgram(programa as any, locale);
  if (!resolved) {
    return { title: 'Programa no encontrado' };
  }
  return buildBaseMetadata({
    title: resolved.title,
    description: resolved.shortDescription,
    path: `/programas/${slug}`,
    ogImage: programa.imageUrl,
  });
}

export default async function ProgramaPage({ params }: ProgramaPageProps) {
  const { slug, locale } = await params;
  const programa = await ProgramController.getProgramBySlug(slug);
  if (!programa) {
    notFound();
  }
  const resolved = resolveProgram(programa as any, locale);
  if (!resolved) {
    notFound();
  }

  const previousPrograma = await ProgramController.getPreviousProgram(programa.order);
  const nextPrograma = await ProgramController.getNextProgram(programa.order);
  const prevResolved = previousPrograma ? resolveProgram(previousPrograma as any, locale) : null;
  const nextResolved = nextPrograma ? resolveProgram(nextPrograma as any, locale) : null;

  const externalUrl = typeof (resolved as any).externalWebsiteUrl === 'string'
    ? (resolved as any).externalWebsiteUrl as string
    : null;

  const programaAdapted = {
    slug: resolved.slug,
    title: resolved.title,
    shortDescription: resolved.shortDescription,
    imageSrc: resolved.imageUrl,
    content: resolved.content,
    info: resolved.info,
    ctaText: 'Reserva mi lugar',
    ctaHref: externalUrl || 'https://wa.me/526144105989',
  };

  const previousAdapted = prevResolved
    ? {
        slug: prevResolved.slug,
        title: prevResolved.title,
        shortDescription: prevResolved.shortDescription,
        imageSrc: prevResolved.imageUrl,
        content: prevResolved.content,
        info: prevResolved.info,
        ctaText: 'Reserva mi lugar',
        ctaHref: (typeof (prevResolved as any).externalWebsiteUrl === 'string'
          ? (prevResolved as any).externalWebsiteUrl
          : null) || 'https://wa.me/526144105989',
      }
    : null;

  const nextAdapted = nextResolved
    ? {
        slug: nextResolved.slug,
        title: nextResolved.title,
        shortDescription: nextResolved.shortDescription,
        imageSrc: nextResolved.imageUrl,
        content: nextResolved.content,
        info: nextResolved.info,
        ctaText: 'Reserva mi lugar',
        ctaHref: (typeof (nextResolved as any).externalWebsiteUrl === 'string'
          ? (nextResolved as any).externalWebsiteUrl
          : null) || 'https://wa.me/526144105989',
      }
    : null;

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Inicio', url: '/inicio' },
    { name: 'Programas', url: '/programas' },
    { name: resolved.title, url: `/programas/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="w-full overflow-x-clip">
        <Navbar />
        <ProgramaDetalleTemplate
          programa={programaAdapted}
          previousPrograma={previousAdapted}
          nextPrograma={nextAdapted}
        />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}
