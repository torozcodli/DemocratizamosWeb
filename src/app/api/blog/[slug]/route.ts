import { NextResponse } from 'next/server';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { resolvePost } from '@/lib/i18n/resolve';
import { getValidLocaleFromQuery } from '@/lib/i18n/content';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = getValidLocaleFromQuery(searchParams.get('locale'));
    const post = await PostController.getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      );
    }

    const resolved = resolvePost(post as any, locale);
    if (!resolved) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }
    // Detalle por slug (solo published en controller). Preview/draft: endpoint con no-store.
    return NextResponse.json(resolved, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Error al obtener el post' },
      { status: 500 }
    );
  }
}
