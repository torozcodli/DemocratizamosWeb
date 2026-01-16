import { NextResponse } from 'next/server';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log('[Like API] Incrementing likes for slug:', slug);
    
    const post = await PostController.incrementLikes(slug);
    console.log('[Like API] Likes incremented successfully:', post.likes);

    // Revalidar la página del post
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/blog');

    return NextResponse.json({ likes: post.likes }, { status: 200 });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    let slug = 'unknown';
    try {
      const paramsResolved = await params;
      slug = paramsResolved.slug;
    } catch {
      // Ignore
    }
    
    console.error('[Like API] Error incrementing likes:', {
      message: errorMessage,
      stack: errorStack,
      error,
      slug,
    });

    if (errorMessage === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    return NextResponse.json(
      { 
        error: 'Error al dar like',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Revisa los logs del servidor'
      },
      { status: 500 }
    );
  }
}
