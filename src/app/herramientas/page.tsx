import type { Metadata } from 'next';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { HerramientasHero } from '@/components/herramientas/HerramientasHero';
import { DiscountMarquee } from '@/components/herramientas/DiscountMarquee';
import { HerramientasPageContent } from '@/components/herramientas/HerramientasPageContent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Herramientas',
  description: 'Accede a herramientas digitales y recursos para impulsar tu crecimiento profesional y personal.',
  openGraph: {
    title: 'Herramientas',
    description: 'Accede a herramientas digitales y recursos para impulsar tu crecimiento profesional y personal.',
    url: '/herramientas',
    type: 'website',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Herramientas',
      },
    ],
  },
};

export default async function HerramientasPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="w-full overflow-x-clip bg-[#E7E9FF] min-h-screen">
      <Navbar />
      <HerramientasHero />
      <DiscountMarquee />
      <HerramientasPageContent session={session} />
      <Footer />
    </main>
  );
}
