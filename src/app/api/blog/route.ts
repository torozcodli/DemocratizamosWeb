import { NextResponse } from 'next/server';
import { PostController, PostSortOption } from '@/modules/posts/controllers/post.controller';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get('sort') as PostSortOption) || 'recent';
    
    const posts = await PostController.listPublishedPosts(sort);
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('[API /blog] Error fetching posts:', {
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
        error: 'Error al obtener posts',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Revisa los logs del servidor'
      },
      { status: 500 }
    );
  }
}
