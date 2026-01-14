import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProgramaDetalleTemplate } from '@/components/programas/ProgramaDetalleTemplate';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProgramaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const programa = await ProgramController.getProgramBySlug(slug);

  if (!programa) {
    return {
      title: 'Programa no encontrado',
    };
  }

  return {
    title: programa.title,
    description: programa.shortDescription,
    openGraph: {
      title: programa.title,
      description: programa.shortDescription,
      images: [programa.imageUrl],
    },
  };
}

export default async function ProgramaPage({ params }: ProgramaPageProps) {
  const { slug } = await params;
  const programa = await ProgramController.getProgramBySlug(slug);

  if (!programa) {
    notFound();
  }

  // Obtener programas anterior y siguiente basado en order
  const previousPrograma = await ProgramController.getPreviousProgram(programa.order);
  const nextPrograma = await ProgramController.getNextProgram(programa.order);

  // Adaptar datos de MongoDB al formato esperado por el template
  const programaAdapted = {
    slug: programa.slug,
    title: programa.title,
    shortDescription: programa.shortDescription,
    imageSrc: programa.imageUrl,
    content: programa.content,
    info: programa.info,
    ctaText: 'Reserva mi lugar',
    ctaHref: 'https://wa.me/+5216145871758',
  };

  const previousAdapted = previousPrograma
    ? {
        slug: previousPrograma.slug,
        title: previousPrograma.title,
        shortDescription: previousPrograma.shortDescription,
        imageSrc: previousPrograma.imageUrl,
        content: previousPrograma.content,
        info: previousPrograma.info,
        ctaText: 'Reserva mi lugar',
        ctaHref: 'https://wa.me/+5216145871758',
      }
    : null;

  const nextAdapted = nextPrograma
    ? {
        slug: nextPrograma.slug,
        title: nextPrograma.title,
        shortDescription: nextPrograma.shortDescription,
        imageSrc: nextPrograma.imageUrl,
        content: nextPrograma.content,
        info: nextPrograma.info,
        ctaText: 'Reserva mi lugar',
        ctaHref: 'https://wa.me/+5216145871758',
      }
    : null;

  return (
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
  );
}
