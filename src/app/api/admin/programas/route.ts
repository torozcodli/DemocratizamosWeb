import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { ProgramController } from '@/modules/programs/controllers/program.controller';
import { createProgramSchema } from '@/modules/programs/validation/program.validation';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// GET: Lista todos los programas (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const programs = await ProgramController.listAllPrograms();
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: 'Error al obtener programas' }, { status: 500 });
  }
}

// POST: Crear nuevo programa (admin)
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
    const validated = createProgramSchema.parse(body);

    // Crear programa
    const program = await ProgramController.createProgram(validated, session);

    // Revalidar rutas para que aparezca inmediatamente
    revalidatePath('/');
    revalidatePath('/programas');
    revalidatePath(`/programas/${program.slug}`);

    return NextResponse.json(program, { status: 201 });
  } catch (error: any) {
    console.error('Error creating program:', error);

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

    return NextResponse.json({ error: 'Error al crear programa' }, { status: 500 });
  }
}
