import { NextResponse } from 'next/server';
import { ToolController } from '@/modules/tools/controllers/tool.controller';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tools = await ToolController.listPublishedTools();
    return NextResponse.json(tools, { status: 200 });
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
