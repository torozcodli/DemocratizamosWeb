import { NextResponse } from 'next/server';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { resolveTool } from '@/lib/i18n/resolve';
import { getValidLocaleFromQuery } from '@/lib/i18n/content';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = getValidLocaleFromQuery(searchParams.get('locale'));
    const tools = await ToolController.listPublishedTools();
    const resolved = tools.map((t) => resolveTool(t as any, locale)).filter(Boolean);
    // Solo herramientas publicadas; seguro cachear.
    return NextResponse.json(resolved, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('[API /tools] Error fetching tools:', {
      message: errorMessage,
      stack: errorStack,
      error,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
    return NextResponse.json(
      { 
        error: 'Error al obtener herramientas',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Revisa los logs del servidor'
      },
      { status: 500 }
    );
  }
}
