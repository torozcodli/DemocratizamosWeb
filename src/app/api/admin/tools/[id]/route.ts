import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { ToolController } from '@/modules/tools/controllers/tool.controller';
import { updateToolSchema } from '@/modules/tools/validation/tool.validation';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// PUT: Actualizar herramienta (admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Si imageUrl viene vacío o null, lo eliminamos del body para que no se actualice
    const bodyToValidate = { ...body };
    if (bodyToValidate.imageUrl === '' || bodyToValidate.imageUrl === null || bodyToValidate.imageUrl === undefined) {
      delete bodyToValidate.imageUrl;
    }

    // Validar con Zod (campos opcionales)
    const validated = updateToolSchema.parse(bodyToValidate);

    // Actualizar herramienta
    const tool = await ToolController.updateTool(id, validated, session);

    // Revalidar rutas
    revalidatePath('/herramientas');
    revalidatePath(`/herramientas/${tool.slug}`);

    return NextResponse.json(tool, { status: 200 });
  } catch (error: any) {
    console.error('Error updating tool:', error);

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

    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Herramienta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al actualizar herramienta' }, { status: 500 });
  }
}

// DELETE: Eliminar herramienta (admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;

    // Eliminar herramienta
    await ToolController.deleteTool(id, session);

    // Revalidar rutas
    revalidatePath('/herramientas');

    return NextResponse.json({ message: 'Herramienta eliminada' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting tool:', error);

    // Errores de autorización
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Herramienta no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar herramienta' }, { status: 500 });
  }
}
