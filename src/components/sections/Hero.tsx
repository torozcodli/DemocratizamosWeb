import { Button } from '@/components/ui/Button';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { contactBtnClass } from '@/lib/styles/buttons';
import { homeContent } from '@/content/home';
import HeroIllustration from '@/components/landing/HeroIllustration';

export function Hero() {
  return (
    <section 
      id="inicio" 
      className="relative w-full overflow-x-clip pt-[calc(env(safe-area-inset-top)+76px)] sm:pt-[calc(env(safe-area-inset-top)+96px)] lg:pt-28 pb-6 sm:pb-8 md:pb-12 xl:pb-16"
    >
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
        {/* Mobile: columna (collage arriba, texto abajo) */}
        {/* md/tablet: mantiene columna pero con mejor spacing */}
        {/* lg+: grid de 2 columnas (texto izquierda, collage derecha) centrado verticalmente */}
        <div className="hero-section-container flex flex-col lg:grid lg:grid-cols-[1.15fr_0.85fr] gap-6 sm:gap-8 lg:gap-10 xl:gap-14 lg:items-center">
          {/* Contenedor de texto - NO overflow-hidden ni altura fija */}
          <div className="flex flex-col space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 min-w-0 lg:pr-10 xl:pr-14 order-2 lg:order-1">
            <h1 
              className="font-inter font-extrabold text-[#1E1A49] leading-[0.95] tracking-tight min-w-0"
              style={{
                fontSize: 'clamp(2.15rem, 8.2vw, 4.6rem)',
                textWrap: 'balance',
              }}
            >
              <span className="block max-w-[18ch] sm:max-w-[20ch] lg:max-w-[16ch]">
                Transformamos vidas a través de la{' '}
                <span className="text-[#6F74C9]">Tecnología.</span>
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 max-w-[42ch] md:max-w-[44ch] lg:max-w-[48ch] text-left text-[18px] md:text-[18px] lg:text-[18px] xl:text-[22px] font-medium leading-relaxed text-[#1E1A49]/85 text-pretty">
              Llevando habilidades digitales a quienes más las necesitan, contribuyendo así a la inclusión digital y disminuyendo la desigualdad social.
            </p>

            <a 
              href="https://wa.me/+5216145871758" 
              target="_blank" 
              rel="noopener noreferrer"
              className="self-start"
            >
              <Button variant="primary" className={contactBtnClass + ' hero-cta-button text-[clamp(16px,4vw,20px)] md:text-lg xl:text-xl px-6 md:px-7 py-2 md:py-2.5'}>
                {homeContent.hero.cta}
              </Button>
            </a>
          </div>

          <div className="flex justify-center lg:justify-end order-1 lg:order-2 min-w-0 hero-collage-wrapper">
            <HeroIllustration className="w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[520px]" />
          </div>
        </div>

        {/* Banner WhatsApp pegado al borde derecho */}
        <div className="hero-whatsapp-banner absolute bottom-0 right-4 md:right-6 xl:right-0 z-50">
          <div className="xl:translate-x-[calc(100%-3rem)]">
            <WhatsAppBanner />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-height: 450px) and (orientation: landscape) and (max-width: 767px) {
          section#inicio {
            padding-top: calc(env(safe-area-inset-top) + 60px) !important;
          }
          .hero-section-container {
            gap: 1rem !important;
          }
          .hero-collage-wrapper {
            max-width: 300px !important;
          }
          .hero-mobile-laptop {
            top: 14% !important;
          }
          .hero-mobile-man {
            width: 42% !important;
          }
        }
      `}} />
    </section>
  );
}
