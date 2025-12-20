import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { InclusionDigitalSection } from '@/components/sections/InclusionDigitalSection';
import { Ribbon } from '@/components/ui/Ribbon';
import { AlliesSection } from '@/components/sections/AlliesSection';
import { Stats } from '@/components/sections/Stats';
import { Allies } from '@/components/sections/Allies';
import { News } from '@/components/sections/News';
import { Programs } from '@/components/sections/Programs';
import { Blog } from '@/components/sections/Blog';
import { Tools } from '@/components/sections/Tools';
import { Academy } from '@/components/sections/Academy';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';
export default function Home() {
  return (
    <main className="p-0 m-0">
      <Navbar />
      <Hero />
      <About />
      <InclusionDigitalSection />
      <Ribbon />
      <AlliesSection />
      <Stats />
      <Allies />
      <News />
      <Programs />
      <Blog />
      <Tools />
      <Academy />
      <Contact />
      <Footer />
    </main>
  );
}

