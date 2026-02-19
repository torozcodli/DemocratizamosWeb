import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { resolveTool } from '@/lib/i18n/resolve';
import { ToolDetailContent } from '@/components/herramientas/ToolDetailContent';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';

interface ToolPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { slug, locale } = await params;
  const tool = await ToolController.getToolBySlug(slug);
  if (!tool) {
    return { title: 'Herramienta no encontrada' };
  }
  const resolved = resolveTool(tool as any, locale);
  if (!resolved) {
    return { title: 'Herramienta no encontrada' };
  }
  return buildBaseMetadata({
    title: resolved.title,
    description: resolved.description,
    path: `/herramientas/${slug}`,
    ogImage: tool.imageUrl,
  });
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug, locale } = await params;
  const tool = await ToolController.getToolBySlug(slug);
  if (!tool) {
    notFound();
  }
  const resolved = resolveTool(tool as any, locale);
  if (!resolved) {
    notFound();
  }

  const relatedTools = await ToolController.getRelatedTools(slug, 6);
  const relatedResolved = relatedTools.map((t) => resolveTool(t as any, locale)).filter(Boolean);

  const toolAdapted = {
    ...resolved,
    _id: (resolved as any)._id.toString(),
    date: (resolved as any).date ? new Date((resolved as any).date).toISOString() : new Date().toISOString(),
    createdAt: (resolved as any).createdAt?.toString?.() ?? new Date().toString(),
    updatedAt: (resolved as any).updatedAt?.toString?.() ?? new Date().toString(),
  };

  const relatedToolsAdapted = relatedResolved.map((t: any) => ({
    ...t,
    _id: t._id.toString(),
    date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
    createdAt: t.createdAt?.toString?.() ?? new Date().toString(),
    updatedAt: t.updatedAt?.toString?.() ?? new Date().toString(),
  }));

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Inicio', url: '/inicio' },
    { name: 'Herramientas', url: '/herramientas' },
    { name: resolved.title, url: `/herramientas/${slug}` },
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
