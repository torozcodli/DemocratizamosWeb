import { Navbar } from '@/components/sections/Navbar';
import { NosotrosHero } from '@/components/nosotros/NosotrosHero';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen w-full overflow-x-clip">
      <Navbar />
      <NosotrosHero />
      {/* Aquí irán las demás secciones de la página Nosotros */}
    </main>
  );
}

