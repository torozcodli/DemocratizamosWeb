import { buildBaseMetadata } from '@/lib/seo/metadata';
import { Container } from '@/components/ui/Container';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';

export const metadata = buildBaseMetadata({
  title: 'Aviso de Privacidad',
  description: 'Aviso de Privacidad para beneficiarios de programas.',
  path: '/aviso-de-privacidad',
  ogType: 'article',
});

export default function AvisoPrivacidadPage() {
  return (
    <main className="min-h-screen w-full p-0 m-0">
      <Navbar />
      <div className="w-full relative overflow-hidden bg-gradient-to-br from-[#E7E9FF] via-[#F5F6FF] to-[#E1E6FD]">
      <div className="absolute top-[-100px] right-[-150px] w-[600px] h-[600px] bg-gradient-to-br from-[#6F74C9]/20 to-[#484A88]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[700px] h-[700px] bg-gradient-to-tr from-[#E1CEF2]/30 to-[#AAB3FF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#484A88]/15 to-[#6F74C9]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-gradient-to-bl from-[#E79A5A]/10 to-[#E68956]/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10 pt-36 sm:pt-40 lg:pt-44 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm p-6 sm:p-8 md:p-12 lg:p-16">
          <div className="mb-8 sm:mb-12">
            <p className="text-sm sm:text-base text-[#1D194C]/70 mb-4">
              Última actualización: <strong>19 de Septiembre de 2025</strong>
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-tech font-extrabold text-[#1D194C] uppercase tracking-tight">
              AVISO DE PRIVACIDAD BENEFICIARIOS DE PROGRAMAS
            </h1>
          </div>

          <nav className="mb-8 sm:mb-12 p-4 sm:p-6 bg-[#E7E9FF]/50 rounded-xl border border-[#6F74C9]/20">
            <h3 className="text-sm font-semibold text-[#1D194C] mb-3 uppercase tracking-wide">Índice</h3>
            <ul className="space-y-2 text-sm sm:text-base">
              <li><a href="#responsable" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">1. Responsable de datos personales</a></li>
              <li><a href="#finalidades-primarias" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">2. Finalidades primarias</a></li>
              <li><a href="#finalidades-secundarias" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">3. Finalidades secundarias</a></li>
              <li><a href="#transferencias" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">4. Transferencias de datos</a></li>
              <li><a href="#limitar-uso" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">5. Limitar el uso o divulgación</a></li>
              <li><a href="#derechos-arco" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">6. Derechos ARCO</a></li>
              <li><a href="#cambios" className="text-[#484A88] hover:text-[#1D194C] hover:underline transition-colors">7. Cambios en el aviso</a></li>
            </ul>
          </nav>

          <div className="prose prose-slate max-w-none space-y-8 sm:space-y-10 text-[#1D194C]/80 text-sm sm:text-base">
            <div className="space-y-4">
              <p><strong>Democratizamos la Innovación, A.C.</strong> es una organización civil fundada en 2024 en el estado de Chihuahua, con la misión de impulsar la autonomía de las personas mediante el desarrollo de habilidades digitales, el emprendimiento y la innovación tecnológica.</p>
              <p>En cumplimiento y apego a lo establecido en la <strong>Ley Federal de Protección de Datos Personales en Posesión de Particulares</strong> y su Reglamento damos a conocer los siguientes puntos.</p>
            </div>
            <section id="responsable" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">1. RESPONSABLE DE DATOS PERSONALES</h2>
              <p>Para la protección de datos personales de titulares <strong>Democratizamos la Innovación, A.C</strong> es responsable del uso y manejo de estos, teniendo como domicilio: Hacienda de la luz, 2036, Haciendas del Valle II, Chihuahua, Chihuahua, 31217.</p>
            </section>
            <section id="finalidades-primarias" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">2. FINALIDADES PRIMARIAS</h2>
              <p>Sus datos personales serán utilizados para las finalidades necesarias para el desarrollo y cumplimiento de los objetivos del programa que implementa <strong>Democratizamos la Innovación A.C.</strong></p>
            </section>
            <section id="finalidades-secundarias" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">3. FINALIDADES SECUNDARIAS</h2>
              <p><strong>Democratizamos la Innovación, A.C.</strong> hace de su conocimiento que los datos podrán ser usados para finalidades secundarias. Para manifestar negativa: <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] font-semibold underline">administracion@democratizamoslainnovacion.org</a>.</p>
            </section>
            <section id="transferencias" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">4. TRANSFERENCIAS DE DATOS</h2>
              <p>Los datos personales solicitados podrán ser transferidos a entidades públicas y privadas a efecto de hacer posible la prestación del servicio solicitado y/o cumplir obligaciones legales aplicables.</p>
            </section>
            <section id="limitar-uso" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">5. LIMITAR EL USO O DIVULGACIÓN DE SUS DATOS</h2>
              <p>Para limitar el uso y divulgación: <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] font-semibold underline">administracion@democratizamoslainnovacion.org</a></p>
            </section>
            <section id="derechos-arco" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">6. DERECHOS ARCO</h2>
              <p>Usted tiene derecho a Acceso, Rectificación, Cancelación y Oposición. Solicitudes en nuestras oficinas o a <a href="mailto:administracion@democratizamoslainnovacion.org" className="text-[#484A88] hover:text-[#1D194C] underline">administracion@democratizamoslainnovacion.org</a>. Tel: <a href="tel:6141418003" className="text-[#484A88] hover:text-[#1D194C] underline">6141418003</a>.</p>
            </section>
            <section id="cambios" className="scroll-mt-8">
              <h2 className="text-2xl sm:text-3xl font-tech font-bold text-[#1D194C] mb-4 sm:mb-6">7. CAMBIOS EN EL AVISO DE PRIVACIDAD</h2>
              <p>El presente aviso puede sufrir modificaciones. Se exhibirá en nuestras instalaciones y se publicará en <a href="https://www.democratizamoslainnovación.org" target="_blank" rel="noopener noreferrer" className="text-[#484A88] hover:text-[#1D194C] underline">www.democratizamoslainnovación.org</a>.</p>
            </section>
          </div>
        </div>
      </Container>
      </div>
      <Footer />
    </main>
  );
}
