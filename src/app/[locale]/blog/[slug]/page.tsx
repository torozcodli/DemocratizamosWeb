import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { BlogDetailContent } from '@/components/blog/BlogDetailContent';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await PostController.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : undefined;
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime;

  return buildBaseMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    ogImage: post.imageUrl,
    ogType: 'article',
    publishedTime,
    modifiedTime,
  });
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await PostController.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await PostController.getRelatedPosts(slug, 3);

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

  const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime;

  const articleSchema = articleJsonLd({
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    authorName: post.authorName,
    url: `/blog/${slug}`,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Inicio', url: '/inicio' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="w-full overflow-x-clip bg-[#E7E9FF] min-h-screen">
        <Navbar />
        <BlogDetailContent post={postAdapted} relatedPosts={relatedPostsAdapted} />
        <Footer />
        <WhatsAppButton />
      </main>
    </>
  );
}
