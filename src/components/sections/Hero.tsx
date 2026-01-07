import { Button } from '@/components/ui/Button';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { homeContent } from '@/content/home';
import HeroIllustration from '@/components/landing/HeroIllustration';

export function Hero() {
  return (
    <section id="inicio" className="pt-8 md:pt-12 lg:pt-14 pb-8 md:pb-12 lg:pb-16 relative w-full overflow-x-clip">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle 400px at 20% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(circle 350px at 60% 40%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%),
            radial-gradient(circle 300px at 80% 70%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%),
            radial-gradient(circle 250px at 15% 75%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%),
            radial-gradient(circle 200px at 45% 15%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 75%),
            linear-gradient(180deg, #E1E6FD 0%, #D6DCF9 50%, #E1E6FD 100%)
          `,
        }}
      />

      <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 md:pl-8 md:pr-8 lg:pl-0 lg:pr-8 relative z-10">
        <div className="hero-section-container grid grid-cols-1 md:grid-cols-2 md:gap-10 lg:gap-14 items-center relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
          {/* Lado izquierdo */}
          <div className="space-y-6 md:space-y-6 lg:space-y-8 lg:-ml-18 z-10">
            <h1 className="hero-title font-inter font-extrabold text-[#1E1A49] text-[48px] sm:text-[56px] md:text-[56px] lg:text-[72px] leading-[1.1] tracking-[-0.02em]">
              Transformamos
              <br className="hidden md:block" />
              <span className="whitespace-nowrap">vidas a través de</span>
              <br className="hidden md:block" />
              <span className="whitespace-nowrap">
                <span>la </span>
                <span className="tech-word text-[#6F74C9]">Tecnología.</span>
              </span>
            </h1>

            <p className="hero-description mt-4 max-w-[52ch] text-left text-[22px] md:text-[20px] lg:text-[22px] font-medium leading-normal text-[#1E1A49]/85">
              Llevando habilidades digitales a quienes más
              <br className="hidden md:block" />
              las necesitan, contribuyendo así a la inclusión
              <br className="hidden md:block" />
              digital y disminuyendo la desigualdad social.
            </p>

            <a href="https://wa.me/+5216145871758" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="hero-cta-button -mt-1 text-xl px-7 py-2.5">
                {homeContent.hero.cta}
              </Button>
            </a>
          </div>

          {/* Lado derecho - Ilustración compuesta */}
          <div className="relative md:absolute md:bottom-0 md:-right-8 lg:-right-8 xl:-right-16 md:w-[58%] flex items-end justify-end">
            <HeroIllustration className="w-full max-w-[620px] md:max-w-[500px] lg:max-w-[620px] mx-auto" />
          </div>

          {/* Banner WhatsApp pegado al borde derecho */}
          <div className="hero-whatsapp-banner absolute bottom-0 right-4 md:right-6 lg:right-0 z-50">
            <div className="lg:translate-x-[calc(100%-3rem)]">
              <WhatsAppBanner />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
