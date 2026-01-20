import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { createToolSchema } from '@/modules/tools/validation/tool.validation';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// GET: Lista todas las herramientas (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const tools = await ToolController.listAllTools();
    return NextResponse.json(tools, { status: 200 });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Error al obtener herramientas' }, { status: 500 });
  }
}

// POST: Crear nueva herramienta (admin)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();

    // Validar con Zod
    const validated = createToolSchema.parse(body);

    // Crear herramienta
    const tool = await ToolController.createTool(validated, session);

    // Revalidar rutas para que aparezca inmediatamente
    revalidatePath('/herramientas');
    revalidatePath(`/herramientas/${tool.slug}`);

    return NextResponse.json(tool, { status: 201 });
  } catch (error: any) {
    console.error('Error creating tool:', error);

    // Errores de validación Zod
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    // Errores de autorización
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json({ error: 'Error al crear herramienta' }, { status: 500 });
  }
}
