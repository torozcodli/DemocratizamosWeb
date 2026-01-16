'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  authorName: string;
  readTime: string;
  likes: number;
  createdAt: string;
}

interface FeaturedBlogCardProps {
  post: Post;
}

export function FeaturedBlogCard({ post }: FeaturedBlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Link href={`/blog/${post.slug}`} prefetch={false} className="group block">
      <article className="bg-white rounded-[32px] shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Columna izquierda - Imagen */}
        <div className="md:w-1/2 bg-white/70 overflow-hidden">
          <div className="relative h-[260px] md:h-[360px] w-full">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized={post.imageUrl.startsWith('/images/') || post.imageUrl.startsWith('/')}
            />
          </div>
        </div>

        {/* Columna derecha - Contenido Navy */}
        <div className="md:w-1/2 bg-[#1E1A49] text-white p-8 md:p-10 flex flex-col justify-center gap-4">
          {/* Meta fila arriba */}
          <div className="text-sm text-white/70">
            {formatDate(post.createdAt)} | {post.readTime}
          </div>

          {/* Título */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#E68956] group-hover:text-[#FF7A1A] transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-white/80 text-lg line-clamp-3">
            {post.excerpt}
          </p>

          {/* Autor con avatar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-white font-semibold text-sm">
                {post.authorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white/80 text-sm">
              {post.authorName}
            </p>
          </div>

          {/* Likes */}
          <div className="mt-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-colors">
              <Heart size={16} className="text-white/80" />
              <span className="text-white/80 text-sm">{post.likes} me gusta</span>
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
