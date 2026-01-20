'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { BlogCard } from './BlogCard';

interface Post {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  excerpt: string;
  authorName: string;
  readTime: string;
  likes: number;
  content: string[];
  createdAt: string;
}

interface BlogDetailContentProps {
  post: Post;
  relatedPosts: Post[];
}

export function BlogDetailContent({ post, relatedPosts }: BlogDetailContentProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`/api/blog/${post.slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
      }
    } catch (error) {
      console.error('Error dando like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Image */}
      <section className="relative w-full">
        <div className="relative aspect-[21/9] w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized={post.imageUrl.startsWith('/images/') || post.imageUrl.startsWith('/')}
          />
          {/* Overlay degradado inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D194C]/60 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Línea naranja brillante entre imagen y contenido */}
      <div className="w-full h-1 bg-[#E68956]"></div>

      {/* Contenido */}
      <Container>
        <div className="py-8 sm:py-12 lg:py-16">
          {/* Botón Regresar */}
          <Link
            href="/blog"
            prefetch={false}
            className="inline-flex items-center gap-2 text-[#1D194C] hover:text-[#6F74C9] transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Regresar</span>
          </Link>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-tech font-extrabold text-[#1D194C] mb-6 text-center">
            {post.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#1D194C]/60 mb-8">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Autor */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-[#1D194C]/10 flex items-center justify-center">
              <span className="text-[#1D194C] font-semibold text-lg">
                {post.authorName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-[#1D194C]/60">Escrito por</p>
              <p className="font-semibold text-[#1D194C]">{post.authorName}</p>
            </div>
          </div>

          {/* Acciones (Likes) */}
          <div className="flex items-center justify-center gap-6 mb-12 pb-8 border-b border-[#1D194C]/40">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center gap-2 text-[#1D194C] hover:text-[#6F74C9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart size={20} className={isLiking ? 'animate-pulse' : ''} />
              <span className="font-medium">{likes}</span>
            </button>
          </div>

          {/* Contenido */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            {post.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-[#1D194C]/80 leading-relaxed mb-6 text-base sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Artículos relacionados */}
          {relatedPosts.length > 0 && (
            <section className="mt-16 pt-12 border-t border-[#1D194C]/40">
              <h2 className="text-2xl sm:text-3xl font-tech font-extrabold text-[#1D194C] mb-8">
                Artículos relacionados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost._id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
