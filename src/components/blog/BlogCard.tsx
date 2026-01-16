'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock } from 'lucide-react';

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

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/blog/${post.slug}`} prefetch={false} className="group">
      <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        {/* Imagen */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={post.imageUrl.startsWith('/images/') || post.imageUrl.startsWith('/')}
          />
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-[#1D194C]/60 mb-3">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{post.likes}</span>
            </div>
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-[#1D194C] mb-3 line-clamp-2 group-hover:text-[#6F74C9] transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-[#1D194C]/70 text-sm mb-4 line-clamp-3 flex-1">
            {post.excerpt}
          </p>

          {/* Autor y fecha */}
          <div className="mt-auto pt-4 border-t border-[#1D194C]/10">
            <p className="text-xs text-[#1D194C]/60">
              Por <span className="font-semibold">{post.authorName}</span>
            </p>
            <p className="text-xs text-[#1D194C]/50 mt-1">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
