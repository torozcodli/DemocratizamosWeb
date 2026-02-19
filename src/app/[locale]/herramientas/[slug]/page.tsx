import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { ToolDetailContent } from '@/components/herramientas/ToolDetailContent';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';

interface ToolPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await ToolController.getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Herramienta no encontrada',
    };
  }

  return buildBaseMetadata({
    title: tool.title,
    description: tool.description,
    path: `/herramientas/${slug}`,
    ogImage: tool.imageUrl,
  });
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await ToolController.getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = await ToolController.getRelatedTools(slug, 6);

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

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Inicio', url: '/inicio' },
    { name: 'Herramientas', url: '/herramientas' },
    { name: tool.title, url: `/herramientas/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="w-full overflow-x-clip bg-[#E7E9FF] min-h-screen">
        <Navbar />
        <ToolDetailContent tool={toolAdapted} relatedTools={relatedToolsAdapted} />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}
