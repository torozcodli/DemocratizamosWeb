import { buildBaseMetadata } from '@/lib/seo/metadata';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { BlogPageContent } from '@/components/blog/BlogPageContent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata = buildBaseMetadata({
  title: 'Blog / Publicaciones',
  description: 'Descubre artículos, noticias y recursos sobre tecnología, inclusión digital y transformación social.',
  path: '/blog',
});

export default async function BlogPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="w-full overflow-x-clip bg-[#E7E9FF] min-h-screen">
      <Navbar />
      <BlogPageContent session={session} />
      <Footer />
    </main>
  );
}
