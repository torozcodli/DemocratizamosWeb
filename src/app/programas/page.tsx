import { Navbar } from '@/components/sections/Navbar';
import { ProgramasHero } from '@/components/sections/programas/ProgramasHero';
import { Footer } from '@/components/sections/Footer';

export default function ProgramasPage() {
  return (
    <main className="w-full overflow-x-clip">
      <Navbar />
      <ProgramasHero />
      {/* Aquí irán las demás secciones de Programas */}
      <Footer />
    </main>
  );
}
