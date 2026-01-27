import { Button } from '@/components/ui/Button';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { contactBtnClass } from '@/lib/styles/buttons';
import { homeContent } from '@/content/home';
import HeroIllustration from '@/components/landing/HeroIllustration';

export function Hero() {
  return (
    <section id="inicio" className="pt-6 sm:pt-8 md:pt-12 xl:pt-14 pb-6 sm:pb-8 md:pb-12 xl:pb-16 relative w-full overflow-x-clip">
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

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8 relative z-10">
        <div className="hero-section-container grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] md:gap-8 lg:gap-10 xl:gap-14 items-center relative min-h-[500px] md:min-h-[550px] xl:min-h-[700px]">
          {/* Lado izquierdo */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 xl:space-y-8 xl:-ml-18 z-10 order-1 md:order-1 lg:pr-10 xl:pr-14">
            <h1 className="hero-title font-inter font-extrabold text-[#1E1A49] text-[42px] sm:text-[50px] md:text-[52px] lg:text-[56px] xl:text-[72px] leading-[1.1] tracking-[-0.02em]">
              Transformamos
              <br className="hidden xl:block" />
              <span className="xl:whitespace-nowrap">vidas a través de</span>
              <br className="hidden xl:block" />
              <span className="xl:whitespace-nowrap">
                <span>la </span>
                <span className="tech-word text-[#6F74C9]">Tecnología.</span>
              </span>
            </h1>

            <p className="hero-description mt-3 sm:mt-4 max-w-[42ch] md:max-w-[44ch] lg:max-w-[48ch] text-left text-[18px] md:text-[18px] lg:text-[18px] xl:text-[22px] font-medium leading-relaxed text-[#1E1A49]/85 text-pretty">
              Llevando habilidades digitales a quienes más las necesitan, contribuyendo así a la inclusión digital y disminuyendo la desigualdad social.
            </p>

            <a href="https://wa.me/+5216145871758" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className={contactBtnClass + ' hero-cta-button -mt-1 text-[clamp(16px,4vw,20px)] md:text-lg xl:text-xl px-6 md:px-7 py-2 md:py-2.5'}>
                {homeContent.hero.cta}
              </Button>
            </a>
          </div>

          {/* Lado derecho - Ilustración compuesta */}
          <div className="relative w-full flex items-end justify-end md:static xl:absolute xl:bottom-0 xl:-right-16 xl:w-[58%] order-2 md:order-2">
            <HeroIllustration className="w-full max-w-[420px] md:max-w-[460px] lg:max-w-[520px] xl:max-w-[620px] mx-auto" />
          </div>

          {/* Banner WhatsApp pegado al borde derecho */}
          <div className="hero-whatsapp-banner absolute bottom-0 right-4 md:right-6 xl:right-0 z-50 order-3">
            <div className="xl:translate-x-[calc(100%-3rem)]">
              <WhatsAppBanner />
            </div>
          </div>
        </div>
        </div>
    </section>
  );
}
