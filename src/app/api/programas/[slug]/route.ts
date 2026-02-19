import { NextResponse } from 'next/server';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { resolveProgram } from '@/lib/i18n/resolve';
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
    const program = await ProgramController.getProgramBySlug(slug);

    if (!program) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    const resolved = resolveProgram(program as any, locale);
    if (!resolved) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }
    // List/detail públicos (solo publicados en list). Si añadís preview/draft por auth, usar endpoint distinto con no-store.
    return NextResponse.json(resolved, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json({ error: 'Error al obtener programa' }, { status: 500 });
  }
}
