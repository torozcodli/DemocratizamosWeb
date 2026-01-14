import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProgramaDetalleTemplate } from '@/components/programas/ProgramaDetalleTemplate';
import {
  getProgramaBySlug,
  getPreviousPrograma,
  getNextPrograma,
} from '@/data/programas';
import type { Metadata } from 'next';

interface ProgramaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProgramaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const programa = getProgramaBySlug(slug);

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
      images: [programa.imageSrc],
    },
  };
}

export default async function ProgramaPage({ params }: ProgramaPageProps) {
  const { slug } = await params;
  const programa = getProgramaBySlug(slug);

  if (!programa) {
    notFound();
  }

  // Obtener programas anterior y siguiente basado en el orden del arreglo
  const previousPrograma = getPreviousPrograma(slug);
  const nextPrograma = getNextPrograma(slug);

  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <ProgramaDetalleTemplate
        programa={programa}
        previousPrograma={previousPrograma}
        nextPrograma={nextPrograma}
      />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
