import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { createProgramSchema } from '@/modules/programs/validation/program.validation';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// PUT: Actualizar programa (admin)
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

    // Validar con Zod (parcial)
    const validated = createProgramSchema.partial().parse(body);

    // Actualizar programa
    const program = await ProgramController.updateProgram(id, validated, session);

    // Revalidar rutas
    revalidatePath('/');
    revalidatePath('/programas');
    revalidatePath(`/programas/${program.slug}`);

    return NextResponse.json(program, { status: 200 });
  } catch (error: any) {
    console.error('Error updating program:', error);

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
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al actualizar programa' }, { status: 500 });
  }
}

// DELETE: Eliminar programa (admin)
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

    // Eliminar programa
    await ProgramController.deleteProgram(id, session);

    // Revalidar rutas
    revalidatePath('/');
    revalidatePath('/programas');

    return NextResponse.json({ message: 'Programa eliminado exitosamente' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting program:', error);

    // Errores de autorización
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar programa' }, { status: 500 });
  }
}
