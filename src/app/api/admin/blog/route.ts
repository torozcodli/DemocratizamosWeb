import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { createPostSchema } from '@/modules/posts/validation/post.validation';
import { isAdminEmail } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// GET: Lista todos los posts (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const posts = await PostController.listAllPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Error al obtener posts' }, { status: 500 });
  }
}

// POST: Crear nuevo post (admin)
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
    const validated = createPostSchema.parse(body);

    // Crear post
    const post = await PostController.createPost(validated, session);

    // Revalidar rutas para que aparezca inmediatamente
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);

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

    return NextResponse.json({ error: 'Error al crear post' }, { status: 500 });
  }
}
