import { getTranslations } from 'next-intl/server';
import { buildBaseMetadata } from '@/lib/seo/metadata';
import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { HeroCirclesScrollEffect } from '@/components/sections/HeroCirclesScrollEffect.client';
import { InclusionDigitalSection } from '@/components/sections/InclusionDigitalSection';
import { Ribbon } from '@/components/ui/Ribbon';
import { AlliesSection } from '@/components/sections/AlliesSection';
import { LatestSection } from '@/components/sections/LatestSection';
import { Footer } from '@/components/sections/Footer';

export const metadata = buildBaseMetadata({
  title: 'Inicio',
  description: 'Transformamos vidas a través de la tecnología. Llevando habilidades digitales a quienes más las necesitan.',
  path: '/inicio',
});

export default async function InicioPage() {
  const t = await getTranslations('home.latest');
  const title = t('title');
  const items = t.raw('items') as Array<{ title: string; description: string }>;

  return (
    <main className="min-h-screen w-full p-0 m-0">
      <Navbar />
      <Hero />
      <About sectionId="inicio-sec2" />
      <HeroCirclesScrollEffect />
      <InclusionDigitalSection />
      <Ribbon />
      <AlliesSection />
      <LatestSection title={title} items={items} />
      <Footer />
    </main>
  );
}
