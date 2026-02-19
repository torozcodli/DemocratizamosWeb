import { NextResponse } from 'next/server';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { resolveProgram } from '@/lib/i18n/resolve';
import { getValidLocaleFromQuery } from '@/lib/i18n/content';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = getValidLocaleFromQuery(searchParams.get('locale'));
    const programs = await ProgramController.listPublishedPrograms();
    const resolved = programs
      .map((p) => {
        try {
          return resolveProgram(p as any, locale);
        } catch (err) {
          console.error('[API /programas] resolveProgram error for doc:', (p as any)?._id, err);
          return null;
        }
      })
      .filter(Boolean);
    // Solo contenido publicado; seguro cachear. Cualquier endpoint preview/draft debe usar no-store.
    return NextResponse.json(resolved, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('[API /programas] Error fetching programs:', {
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
        error: 'Error al obtener programas',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Revisa los logs del servidor'
      },
      { status: 500 }
    );
  }
}
