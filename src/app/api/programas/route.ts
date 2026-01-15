import { NextResponse } from 'next/server';
import { ProgramController } from '@/modules/programs/controllers/program.controller';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const programs = await ProgramController.listPublishedPrograms();
    return NextResponse.json(programs, { status: 200 });
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
