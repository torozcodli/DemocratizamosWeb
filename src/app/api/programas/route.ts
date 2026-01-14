import { NextResponse } from 'next/server';
import { ProgramController } from '@/modules/programs/controllers/program.controller';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const programs = await ProgramController.listPublishedPrograms();
    console.log(`[API /programas] Found ${programs.length} published programs`);
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[API /programas] Error fetching programs:', errorMessage, error);
    return NextResponse.json(
      { 
        error: 'Error al obtener programas',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
