import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

interface Post {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  content?: string[];
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
      <article className="w-full max-w-7xl mx-auto bg-[#1E1A49] rounded-[36px] shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 items-start md:items-center">
          {/* Columna izquierda - Contenido */}
          <div className="p-8 sm:p-10 md:p-12 flex flex-col justify-center gap-4 text-white min-w-0">
            {/* Meta fila arriba */}
            <div className="text-sm text-white/70">
              {formatDate(post.createdAt)} | {post.readTime}
            </div>

            {/* Título */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#E68956] group-hover:text-[#FF7A1A] transition-colors">
              {post.title}
            </h2>

            {/* Excerpt - Mostrar primer párrafo del contenido si está disponible, sino usar excerpt */}
            <div className="text-white/80 text-lg leading-relaxed">
              <p className="break-words whitespace-normal line-clamp-3 overflow-hidden text-ellipsis">
                {post.content && post.content.length > 0 
                  ? post.content[0] 
                  : post.excerpt}
              </p>
            </div>

            {/* Autor con avatar */}
            <div className="flex items-center gap-3 mt-2">
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

          {/* Columna derecha - Imagen en frame redondeado */}
          <div className="md:pr-10 md:py-10">
            <div className="relative h-[240px] sm:h-[280px] md:h-[380px] rounded-[28px] overflow-hidden bg-white/10">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 40vw"
                unoptimized={post.imageUrl.startsWith('/images/') || post.imageUrl.startsWith('/')}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
