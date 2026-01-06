import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { InclusionDigitalSection } from '@/components/sections/InclusionDigitalSection';
import { Ribbon } from '@/components/ui/Ribbon';
import { AlliesSection } from '@/components/sections/AlliesSection';
import { LatestSection } from '@/components/sections/LatestSection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen w-full p-0 m-0">
      <Navbar />
      <Hero />
      <About />
      <InclusionDigitalSection />
      <Ribbon />
      <AlliesSection />
      <LatestSection />
      <Footer />
    </main>
  );
}

