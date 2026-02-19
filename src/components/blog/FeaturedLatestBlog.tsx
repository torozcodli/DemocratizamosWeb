import Link from 'next/link';
import Image from 'next/image';
import { Clock, Heart } from 'lucide-react';
import { getLocale } from 'next-intl/server';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { resolvePost } from '@/lib/i18n/resolve';

export async function FeaturedLatestBlog() {
  const locale = await getLocale();
  const latestPost = await PostController.getLatestPost();
  const resolved = latestPost ? resolvePost(latestPost as any, locale) : null;

  const formatDate = (dateString: Date | string) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (!resolved) {
    return (
      <section className="relative w-full bg-[#E7E9FF] py-16 overflow-hidden">
        {/* Círculo decorativo */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-[#6F74C9]/20 via-[#9DACFF]/15 to-transparent blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-[clamp(2.2rem,5vw,4.2rem)] font-tech font-extrabold tracking-tight text-[#1D194C] mb-12">
            Lo último de nuestro blog...
          </h1>
          
          {/* Placeholder cuando no hay posts */}
          <div className="bg-white/50 rounded-[32px] shadow-lg p-12 text-center">
            <p className="text-[#1D194C]/60 text-lg">Aún no hay publicaciones disponibles</p>
          </div>
        </div>
      </section>
    );
  }

  const postAdapted = {
    ...resolved,
    _id: (resolved as any)._id.toString(),
    createdAt: (resolved as any).createdAt?.toString?.() ?? '',
  };

  return (
    <section className="relative w-full bg-[#E7E9FF] py-16 overflow-hidden">
      {/* Círculo decorativo */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-[#6F74C9]/20 via-[#9DACFF]/15 to-transparent blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <h1 className="text-center text-[clamp(2.2rem,5vw,4.2rem)] font-tech font-extrabold tracking-tight text-[#1D194C] mb-12">
          Lo último de nuestro blog...
        </h1>

        {/* Card grande */}
        <Link href={`/blog/${postAdapted.slug}`} prefetch={false} className="group block">
          <article className="bg-white rounded-[32px] shadow-lg overflow-hidden flex flex-col md:flex-row">
            {/* Columna izquierda - Imagen */}
            <div className="md:w-1/2 bg-white/70 overflow-hidden">
              <div className="relative h-[260px] md:h-[360px] w-full">
                <Image
                  src={postAdapted.imageUrl}
                  alt={postAdapted.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={postAdapted.imageUrl.startsWith('/images/') || postAdapted.imageUrl.startsWith('/')}
                />
              </div>
            </div>

            {/* Columna derecha - Contenido Navy */}
            <div className="md:w-1/2 bg-[#1E1A49] text-white p-8 md:p-10 flex flex-col justify-center gap-4">
              {/* Meta fila arriba */}
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>{postAdapted.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={16} />
                  <span>{postAdapted.likes}</span>
                </div>
              </div>

              {/* Título */}
              <h2 className="text-4xl md:text-5xl font-bold text-[#E68956] group-hover:text-[#FF7A1A] transition-colors">
                {postAdapted.title}
              </h2>

              {/* Excerpt */}
              <p className="text-white/80 text-lg line-clamp-3">
                {postAdapted.excerpt}
              </p>

              {/* Divider */}
              <div className="border-t border-white/15 my-2"></div>

              {/* Author + fecha */}
              <div>
                <p className="text-white/80 text-sm">
                  Por <span className="font-semibold">{postAdapted.authorName}</span>
                </p>
                <p className="text-white/60 text-sm mt-1">
                  {formatDate(postAdapted.createdAt)}
                </p>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
}
