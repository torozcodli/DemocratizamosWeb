import { NextResponse } from 'next/server';
import { ToolController } from '@/modules/tools/controllers/tool.controller';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await ToolController.getToolBySlug(slug);
    
    if (!tool) {
      return NextResponse.json({ error: 'Herramienta no encontrada' }, { status: 404 });
    }
    
    return NextResponse.json(tool, { status: 200 });
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
