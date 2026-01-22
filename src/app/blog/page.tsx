import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { BlogPageContent } from '@/components/blog/BlogPageContent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog / Publicaciones',
  description: 'Descubre artículos, noticias y recursos sobre tecnología, inclusión digital y transformación social.',
  openGraph: {
    title: 'Blog / Publicaciones',
    description: 'Descubre artículos, noticias y recursos sobre tecnología, inclusión digital y transformación social.',
    url: '/blog',
    type: 'website',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Blog / Publicaciones',
      },
    ],
  },
};

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
