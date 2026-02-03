import { Button } from '@/components/ui/Button';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { contactBtnClass } from '@/lib/styles/buttons';
import { homeContent } from '@/content/home';
import HeroIllustration from '@/components/landing/HeroIllustration';

export function Hero() {
  return (
    <section 
      id="inicio" 
      className="relative w-full overflow-x-clip pt-[calc(env(safe-area-inset-top)+76px)] sm:pt-[calc(env(safe-area-inset-top)+96px)] ipadP:py-12 lg:pt-[calc(7rem-1px)] pb-6 sm:pb-8 md:pb-12 lg:pb-[calc(8rem-1cm+26px)] xl:pb-[calc(10rem-1cm+26px)] 2xl:pb-[calc(12rem-1cm+26px)]"
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

      <div className="max-w-7xl lg:max-w-[1500px] xl:max-w-[1700px] 2xl:max-w-[1920px] mx-auto w-full px-4 sm:px-6 ipadP:px-6 md:px-10 xl:px-8 relative z-10">
        {/* Mobile: stacked. ipadP: stacked + centrado. ipadL: 2 columnas. lg+ (desktop): 2 columnas como siempre */}
        <div className="hero-section-container grid grid-cols-1 gap-6 sm:gap-8 ipadP:grid-cols-1 ipadP:gap-8 ipadP:place-items-center ipadL:grid-cols-2 ipadL:items-center ipadL:gap-12 lg:grid lg:grid-cols-[1fr_minmax(820px,1fr)] lg:items-center lg:gap-12 xl:gap-16">
          {/* Columna texto — iPad: centrado; desktop: izquierda */}
          <div className="flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 min-w-0 pl-2 sm:pl-4 lg:pl-6 lg:pr-4 xl:pl-8 xl:pr-6 lg:pb-6 lg:pt-[2cm] order-2 ipadL:order-1 lg:order-1 ipadP:max-w-[620px] ipadP:mx-auto ipadP:items-center ipadP:text-center ipadL:items-center ipadL:text-center lg:items-start lg:text-left lg:w-full z-10">
            <div className="max-w-[520px] ipadP:max-w-[620px]">
              <h1
                className="font-inter font-extrabold text-[#1E1A49] leading-[1.05] tracking-tight min-w-0 text-[clamp(2.15rem,8.2vw,4.6rem)] ipadP:text-[clamp(44px,5vw,64px)] ipadP:leading-[0.95] ipadL:text-[clamp(44px,5vw,64px)] ipadL:leading-[0.95]"
              >
                <span className="block">
                  Transformamos
                  <br />
                  <span className="whitespace-nowrap">vidas a través de</span>
                  <br />
                  la <span className="font-tech-alt font-bold text-[#807AC9]">Tecnología.</span>
                </span>
              </h1>
            </div>

            <p className="mt-1 sm:mt-2 max-w-[65ch] ipadP:max-w-[560px] ipadP:text-[clamp(16px,2vw,18px)] lg:max-w-none text-left text-[18px] md:text-[18px] lg:text-[18px] xl:text-[22px] font-medium leading-snug text-[#5C5C77]">
              Llevando habilidades digitales a quienes más las necesitan,
              <br />
              contribuyendo así a la inclusión digital y disminuyendo la
              <br />
              desigualdad social.
            </p>

            <a 
              href="https://wa.me/+5216145871758" 
              target="_blank" 
              rel="noopener noreferrer"
              className="self-start ipadP:self-center ipadL:self-center lg:self-start"
            >
              <Button variant="primary" className={contactBtnClass + ' hero-cta-button text-[clamp(16px,4vw,20px)] md:text-lg xl:text-xl px-6 md:px-7 py-2 md:py-2.5'}>
                {homeContent.hero.cta}
              </Button>
            </a>
          </div>

          <div className="relative flex justify-center ipadP:justify-center ipadL:justify-center ipadL:items-center lg:flex lg:justify-end lg:items-center lg:ml-auto order-1 ipadL:order-2 lg:order-2 w-full min-w-0 hero-collage-wrapper w-full mx-auto ipadP:max-w-[960px] ipadL:max-w-[520px] lg:overflow-visible lg:min-w-[820px] xl:min-w-[860px] 2xl:min-w-[920px] lg:-translate-x-16 lg:translate-y-[3px] xl:-translate-x-[4.5rem] xl:translate-y-[3px] 2xl:-translate-x-20 2xl:translate-y-[3px] z-0">
            <HeroIllustration className="w-full max-w-[360px] sm:max-w-[420px] ipadP:max-w-[960px] ipadL:max-w-[520px] lg:max-w-none lg:w-full xl:max-w-none 2xl:max-w-none" />
          </div>
        </div>

        {/* Banner WhatsApp: anclado al borde derecho; 2cm abajo y 2cm a la izquierda */}
        <div className="hero-whatsapp-banner absolute bottom-0 right-4 md:right-6 xl:right-0 2xl:right-0 z-50 translate-y-[3cm] -translate-x-[5cm]">
          <div className="xl:translate-x-[calc(100%-3.5rem)]">
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
        /* iPad vertical: centrar todo el Hero, collage centrado, backplate/laptop/señor más grandes */
        @media (min-width: 768px) and (max-width: 1366px) and (orientation: portrait) {
          #inicio .hero-section-container {
            display: grid !important;
            grid-template-columns: 1fr !important;
            justify-items: center !important;
            align-items: start !important;
            gap: 2rem !important;
          }
          /* Collage centrado: ancho definido + margin auto para que quede al centro como el texto */
          #inicio .hero-section-container > .hero-collage-wrapper {
            order: 1 !important;
            width: min(90vw, 960px) !important;
            max-width: 960px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: flex !important;
            justify-content: center !important;
          }
          #inicio .hero-section-container > div:not(.hero-collage-wrapper) {
            order: 2 !important;
            max-width: 620px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            text-align: center !important;
            align-items: center !important;
          }
          #inicio .hero-section-container > div:not(.hero-collage-wrapper) a {
            align-self: center !important;
          }
          /* Contenedor de la ilustración centrado dentro del wrapper */
          #inicio .hero-section-container .hero-collage-wrapper > div {
            max-width: 100% !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          /* Backplate más grande en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-backplate {
            inset: -20% !important;
            transform: none !important;
          }
          /* Laptop más grande en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-laptop {
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
          }
          /* Señor más grande en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-man {
            width: 70% !important;
            right: 0 !important;
            bottom: -8% !important;
          }
        }
      `}} />
    </section>
  );
}
