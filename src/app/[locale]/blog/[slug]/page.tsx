import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { PostController } from '@/modules/posts/controllers/post.controller';
import { resolvePost } from '@/lib/i18n/resolve';
import { BlogDetailContent } from '@/components/blog/BlogDetailContent';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { slug, locale } = await params;
  const post = await PostController.getPostBySlug(slug);
  if (!post) {
    return { title: 'Post no encontrado' };
  }
  const resolved = resolvePost(post as any, locale);
  if (!resolved) {
    return { title: 'Post no encontrado' };
  }
  const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : undefined;
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime;
  return buildBaseMetadata({
    title: resolved.title,
    description: resolved.excerpt,
    path: `/blog/${slug}`,
    ogImage: post.imageUrl,
    ogType: 'article',
    publishedTime,
    modifiedTime,
  });
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug, locale } = await params;
  const post = await PostController.getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  const resolved = resolvePost(post as any, locale);
  if (!resolved) {
    notFound();
  }

  const relatedPosts = await PostController.getRelatedPosts(slug, 3);
  const relatedResolved = relatedPosts.map((p) => resolvePost(p as any, locale)).filter(Boolean);

  const postAdapted = {
    ...resolved,
    _id: (resolved as any)._id.toString(),
    createdAt: (resolved as any).createdAt?.toString?.() ?? '',
  };

  const relatedPostsAdapted = relatedResolved.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toString?.() ?? '',
  }));

  const publishedTime = post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString();
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime;

  const articleSchema = articleJsonLd({
    headline: resolved.title,
    description: resolved.excerpt,
    image: post.imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    authorName: post.authorName,
    url: `/blog/${slug}`,
  });

  const breadcrumbSchema = breadcrumbJsonLd([
    { name: 'Inicio', url: '/inicio' },
    { name: 'Blog', url: '/blog' },
    { name: resolved.title, url: `/blog/${slug}` },
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
