import { NextResponse } from 'next/server';
import { ProgramController } from '@/modules/programs/controllers/program.controller';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const programs = await ProgramController.listPublishedPrograms();
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: 'Error al obtener programas' }, { status: 500 });
  }
}
