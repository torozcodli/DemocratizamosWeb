import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { BlogDetailContent } from '@/components/blog/BlogDetailContent';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await PostController.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await PostController.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Obtener posts relacionados
  const relatedPosts = await PostController.getRelatedPosts(slug, 3);

  // Convertir _id de ObjectId a string
  const postAdapted = {
    ...post,
    _id: post._id.toString(),
    createdAt: post.createdAt.toString(),
  };

  const relatedPostsAdapted = relatedPosts.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt.toString(),
  }));

  return (
    <main className="w-full overflow-x-clip bg-[#E7E9FF] min-h-screen">
      <Navbar />
      <BlogDetailContent post={postAdapted} relatedPosts={relatedPostsAdapted} />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
