import { NextResponse } from 'next/server';
import { ProgramController } from '@/modules/programs/controllers/program.controller';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const program = await ProgramController.getProgramBySlug(slug);

    if (!program) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    return NextResponse.json(program, { status: 200 });
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json({ error: 'Error al obtener programa' }, { status: 500 });
  }
}
