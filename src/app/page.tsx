import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Values } from '@/components/sections/Values';
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
    <main>
      <Navbar />
      <Hero />
      <About />
      <Values />
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

