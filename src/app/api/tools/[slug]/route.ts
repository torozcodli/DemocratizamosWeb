import { NextResponse } from 'next/server';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { resolveTool } from '@/lib/i18n/resolve';
import { getValidLocaleFromQuery } from '@/lib/i18n/content';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = getValidLocaleFromQuery(searchParams.get('locale'));
    const tool = await ToolController.getToolBySlug(slug);

    if (!tool) {
      return NextResponse.json({ error: 'Herramienta no encontrada' }, { status: 404 });
    }

    const resolved = resolveTool(tool as any, locale);
    if (!resolved) {
      return NextResponse.json({ error: 'Herramienta no encontrada' }, { status: 404 });
    }
    // Detalle por slug (isPublished en controller). Preview: endpoint con no-store.
    return NextResponse.json(resolved, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[API /tools/[slug]] Error fetching tool:', {
      message: errorMessage,
      error
    });
    
    return NextResponse.json(
      { error: 'Error al obtener herramienta' },
      { status: 500 }
    );
  }
}
