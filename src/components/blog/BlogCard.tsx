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

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Link href={`/blog/${post.slug}`} prefetch={false} className="group block h-full">
      <article className="rounded-[32px] overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Sección imagen (arriba) */}
        <div className="relative w-full h-[170px] sm:h-[190px] md:h-[200px] overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={post.imageUrl.startsWith('/images/') || post.imageUrl.startsWith('/')}
          />
        </div>

        {/* Sección contenido (abajo) - Fondo lavanda que cambia en hover */}
        <div className="px-6 py-5 bg-[#9DACFD] transition-colors duration-300 group-hover:bg-[#484A88] flex-1 flex flex-col">
          {/* Meta row: fecha | readTime */}
          <div className="text-white/80 text-sm flex items-center gap-2">
            <span>{formatDate(post.createdAt)}</span>
            <span>|</span>
            <span>{post.readTime}</span>
          </div>

          {/* Título - Cambia a naranja en hover */}
          <h3 className="mt-2 text-white font-extrabold text-xl leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-[#E68956]">
            {post.title}
          </h3>

          {/* Autor row: avatar + nombre */}
          <div className="mt-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-white/40 overflow-hidden bg-white/20 flex items-center justify-center shrink-0">
              <span className="text-white font-semibold text-sm">
                {post.authorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-white/90 text-sm font-medium">
              {post.authorName}
            </p>
          </div>

          {/* Chip de likes */}
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-white/40 text-white/90 transition-colors duration-300 group-hover:border-white/60 group-hover:bg-white/10">
              <Heart size={14} className="text-white/90" />
              <span>{post.likes} me gusta</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
