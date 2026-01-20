import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { ToolDetailContent } from '@/components/herramientas/ToolDetailContent';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await ToolController.getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Herramienta no encontrada',
    };
  }

  return {
    title: tool.title,
    description: tool.description,
    openGraph: {
      title: tool.title,
      description: tool.description,
      images: [tool.imageUrl],
    },
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await ToolController.getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Obtener herramientas relacionadas
  const relatedTools = await ToolController.getRelatedTools(slug, 6);

  // Convertir _id de ObjectId a string y fechas
  const toolAdapted = {
    ...tool,
    _id: tool._id.toString(),
    date: tool.date ? new Date(tool.date).toISOString() : new Date().toISOString(),
    createdAt: tool.createdAt ? new Date(tool.createdAt).toString() : new Date().toString(),
    updatedAt: tool.updatedAt ? new Date(tool.updatedAt).toString() : new Date().toString(),
  };

  const relatedToolsAdapted = relatedTools.map((t) => ({
    ...t,
    _id: t._id.toString(),
    date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
    createdAt: t.createdAt ? new Date(t.createdAt).toString() : new Date().toString(),
    updatedAt: t.updatedAt ? new Date(t.updatedAt).toString() : new Date().toString(),
  }));

  return (
    <main className="w-full overflow-x-clip bg-[#E7E9FF] min-h-screen">
      <Navbar />
      <ToolDetailContent tool={toolAdapted} relatedTools={relatedToolsAdapted} />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
