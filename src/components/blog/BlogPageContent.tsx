'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Session } from 'next-auth';
import { Container } from '@/components/ui/Container';
import { FeaturedBlogCard } from './FeaturedBlogCard';
import { BlogCard } from './BlogCard';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { PostController, PostSortOption } from '@/modules/posts/controllers/post.controller';
import { Plus } from 'lucide-react';

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

interface BlogPageContentProps {
  session: Session | null;
}

export function BlogPageContent({ session }: BlogPageContentProps) {
  const t = useTranslations('blog');
  const [posts, setPosts] = useState<Post[]>([]);
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<PostSortOption>('recent');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchLatestPost();
  }, [sort]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/blog?sort=${sort}`, {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        // Asegurar que _id y createdAt sean strings
        const adaptedData = data.map((p: any) => ({
          ...p,
          _id: p._id?.toString() || p._id,
          createdAt: p.createdAt?.toString() || p.createdAt,
        }));
        setPosts(adaptedData);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestPost = async () => {
    try {
      // Obtener todos los posts recientes y tomar el primero
      const response = await fetch('/api/blog?sort=recent', {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const latest = data[0];
          setLatestPost({
            ...latest,
            _id: latest._id?.toString() || latest._id,
            createdAt: latest.createdAt?.toString() || latest.createdAt,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching latest post:', error);
    }
  };


  // Filtrar posts para el grid (excluir el latest si existe)
  const gridPosts = latestPost 
    ? posts.filter(p => p._id !== latestPost._id)
    : posts;

  return (
    <div className="w-full">
      {/* Sección del último blog con fondo punteado */}
      <div 
        className="w-full py-14 md:py-16 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/FondoPunteado.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay sutil para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/10 pointer-events-none"></div>

        {/* Círculo gigante en esquina inferior derecha */}
        <div className="pointer-events-none absolute -bottom-72 -right-72 h-[960px] w-[960px] rounded-full bg-[#9DACFF]/60"></div>

        {/* WhatsApp Banner flotante */}
        <div className="absolute bottom-4 md:bottom-8 lg:bottom-12 right-0 md:right-0 lg:right-0 z-20" style={{ transform: 'translateX(15px)' }}>
          <WhatsAppBanner />
        </div>
        
        <Container className="relative max-w-7xl">
          {/* Título - Mantener estilo actual */}
          <h1 className="text-left text-[clamp(2.5rem,6vw,5rem)] font-tech font-extrabold tracking-tight text-[#1D194C] mb-8 lg:mb-12">
            {t('title')}
          </h1>

          {/* Hero - Último post */}
          {latestPost ? (
            <div className="mb-12 lg:mb-16">
              <FeaturedBlogCard post={latestPost} />
            </div>
          ) : (
            <div className="mb-12 lg:mb-16 text-center py-12 text-[#1D194C]/60">
              <p>{t('noPosts')}</p>
            </div>
          )}
        </Container>
      </div>

      {/* Resto del contenido (grid, dropdown, etc.) */}
      <div className="w-full py-12 sm:py-16 lg:py-20 bg-[#E7E9FF]">
        <Container>
          {/* Dropdown y Grid */}
          <div className="space-y-8">
            {/* Dropdown de ordenamiento */}
            <div className="flex justify-end">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as PostSortOption)}
                className="px-4 py-2 border border-[#1D194C]/20 rounded-lg bg-white text-[#1D194C] focus:outline-none focus:ring-2 focus:ring-[#6F74C9] focus:border-transparent"
              >
                <option value="recent">{t('sortRecent')}</option>
                <option value="recommended">{t('sortRecommended')}</option>
              </select>
            </div>

            {/* Grid de posts */}
            {isLoading ? (
              <div className="text-center py-12 text-[#1D194C]/60">
                <p>{t('loading')}</p>
              </div>
            ) : gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {gridPosts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-[#1D194C]/60">
                <p>{t('noPostsAvailable')}</p>
              </div>
            )}

            {session?.user?.isAdmin && (
              <div className="flex justify-center mt-8">
                <Link
                  href="/admin/blog"
                  className="w-12 h-12 rounded-full bg-[#FF6A00] text-white shadow-lg hover:shadow-xl hover:bg-[#FF7A1A] transition-all flex items-center justify-center"
                  aria-label={t('adminAria')}
                >
                  <Plus size={24} className="text-white" />
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}
