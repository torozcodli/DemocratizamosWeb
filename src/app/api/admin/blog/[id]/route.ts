import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { createPostSchema } from '@/modules/posts/validation/post.validation';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// PUT: Actualizar post (admin)
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
    const bodyToValidate = { ...body };
    if (bodyToValidate.imageUrl === '' || bodyToValidate.imageUrl === null || bodyToValidate.imageUrl === undefined) {
      delete bodyToValidate.imageUrl;
    }
    
    const validated = createPostSchema.partial().parse(bodyToValidate);

    // Actualizar post
    const post = await PostController.updatePost(id, validated, session);

    // Revalidar rutas
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json(post, { status: 200 });
  } catch (error: any) {
    console.error('Error updating post:', error);

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
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al actualizar post' }, { status: 500 });
  }
}

// DELETE: Eliminar post (admin)
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

    // Eliminar post
    await PostController.deletePost(id, session);

    // Revalidar rutas
    revalidatePath('/blog');

    return NextResponse.json({ message: 'Post eliminado exitosamente' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting post:', error);

    // Errores de autorización
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Error al eliminar post' }, { status: 500 });
  }
}
