import { NextResponse } from 'next/server';
import { PostController, PostSortOption } from '@/modules/posts/controllers/post.controller';
import { resolvePost } from '@/lib/i18n/resolve';
import { getValidLocaleFromQuery } from '@/lib/i18n/content';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get('sort') as PostSortOption) || 'recent';
    const locale = getValidLocaleFromQuery(searchParams.get('locale'));

    const posts = await PostController.listPublishedPosts(sort);
    const resolved = posts.map((p) => resolvePost(p as any, locale)).filter(Boolean);
    // Solo posts publicados; seguro cachear. Preview/draft: endpoint separado con no-store.
    return NextResponse.json(resolved, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
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
