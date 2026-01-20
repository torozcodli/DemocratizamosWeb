import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { HerramientasHero } from '@/components/herramientas/HerramientasHero';
import { DiscountMarquee } from '@/components/herramientas/DiscountMarquee';
import { HerramientasPageContent } from '@/components/herramientas/HerramientasPageContent';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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
