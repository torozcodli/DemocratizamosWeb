import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { contactBtnClass } from '@/lib/styles/buttons';
import HeroIllustration from '@/components/landing/HeroIllustration';
import { HeroCollageWrapper } from '@/components/sections/HeroCollageWrapper.client';
import { HeroIpadProStyles } from '@/components/sections/HeroIpadProStyles.client';

export async function Hero() {
  const t = await getTranslations('home.hero');
  return (
    <section 
      id="inicio" 
      className="relative w-full overflow-x-clip pt-[calc(env(safe-area-inset-top)+44px)] sm:pt-[calc(env(safe-area-inset-top)+56px)] ipadP:py-6 lg:pt-[calc(6.75rem+2px)] pb-4 sm:pb-5 md:pb-8 lg:pb-[calc(8.5rem-1cm+26px)] xl:pb-[calc(10rem-1cm+26px)] 2xl:pb-[calc(11.5rem-1cm+26px)]"
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
        <div className="hero-section-container grid grid-cols-1 gap-4 sm:gap-5 ipadP:grid-cols-1 ipadP:gap-6 ipadP:place-items-center ipadL:grid-cols-2 ipadL:items-center ipadL:gap-8 lg:grid lg:grid-cols-[1fr_minmax(820px,1fr)] lg:items-center lg:gap-[4.5rem] xl:gap-[5rem] 2xl:gap-[5.5rem]">
          {/* Columna texto — iPad: centrado; desktop: izquierda */}
          <div className="relative z-20 flex flex-col space-y-3 sm:space-y-4 lg:space-y-5 xl:space-y-5 min-w-0 pl-2 sm:pl-4 lg:pl-6 lg:pr-4 xl:pl-8 xl:pr-6 lg:pb-6 lg:pt-[1.85cm] order-2 ipadL:order-1 lg:order-1 ipadP:max-w-[620px] ipadP:mx-auto ipadP:items-center ipadP:text-center ipadL:items-center ipadL:text-center lg:items-start lg:text-left lg:w-full">
            <div className="max-w-[520px] ipadP:max-w-[620px]">
              <h1
                className="font-inter font-extrabold text-[#1E1A49] leading-[1.05] tracking-tight min-w-0 text-[clamp(2.15rem,8.2vw,4.6rem)] ipadP:text-[clamp(44px,5vw,64px)] ipadP:leading-[0.95] ipadL:text-[clamp(44px,5vw,64px)] ipadL:leading-[0.95]"
              >
                <span className="block">
                  {t('title1')}
                  <br />
                  <span className="whitespace-nowrap">{t('title2')}</span>
                  <br />
                  {t('title3')} <span className="font-tech-alt font-bold text-[#807AC9]">{t('titleTech')}</span>
                </span>
              </h1>
            </div>

            <p className="mt-0.5 sm:mt-1 max-w-[65ch] ipadP:max-w-[560px] ipadP:text-[clamp(16px,2vw,18px)] lg:max-w-none text-left text-[18px] md:text-[18px] lg:text-[18px] xl:text-[22px] font-medium leading-snug text-[#5C5C77]">
              {t('description1')}
              <br />
              {t('description2')}
              <br />
              {t('description3')}
            </p>

            <a 
              href="https://wa.me/+5216145871758" 
              target="_blank" 
              rel="noopener noreferrer"
              className="self-start ipadP:self-center ipadL:self-center lg:self-start"
            >
              <Button variant="primary" className={contactBtnClass + ' hero-cta-button text-[clamp(16px,4vw,20px)] md:text-lg xl:text-xl px-6 md:px-7 py-2 md:py-2.5'}>
                {t('cta')}
              </Button>
            </a>
          </div>

          <HeroCollageWrapper className="relative z-10 flex w-full justify-center mx-auto ipadP:justify-center ipadL:justify-center ipadL:items-center ipadNH:max-w-[460px] ipadNH:ml-auto ipadNH:justify-self-end lg:flex lg:justify-end lg:items-center lg:ml-auto order-1 ipadL:order-2 lg:order-2 min-w-0 hero-collage-wrapper lg:overflow-visible lg:min-w-[820px] xl:min-w-[860px] 2xl:min-w-[920px] lg:-translate-x-16 lg:translate-y-[6px] xl:-translate-x-[4.5rem] xl:translate-y-[6px] 2xl:-translate-x-20 2xl:translate-y-[6px]">
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] ipadP:max-w-[440px] ipadL:max-w-[320px] ipadNH:max-w-[380px] mx-auto lg:max-w-none">
              <HeroIllustration className="w-full max-w-full lg:max-w-none lg:w-full xl:max-w-none 2xl:max-w-none" />
            </div>
          </HeroCollageWrapper>
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
        /* iPad vertical: collage completo centrado arriba del texto, laptop más grande */
        @media (min-width: 768px) and (max-width: 1366px) and (orientation: portrait) {
          #inicio .hero-section-container {
            display: grid !important;
            grid-template-columns: 1fr !important;
            justify-items: center !important;
            align-items: start !important;
            gap: 2.5rem !important;
          }
          /* Collage centrado arriba del texto, un poco a la izquierda para quedar en el centro visual */
          #inicio .hero-section-container > .hero-collage-wrapper {
            order: 1 !important;
            width: min(70vw, 440px) !important;
            max-width: 440px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            align-self: center !important;
            justify-self: center !important;
            position: relative !important;
            left: calc(50% - 144px) !important;
            transform: translate(-50%, -2rem) !important;
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
          /* Ilustración centrada dentro del wrapper */
          #inicio .hero-section-container .hero-collage-wrapper > div {
            max-width: 100% !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            display: block !important;
          }
          /* Backplate un poco más chico en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-backplate {
            inset: -8% !important;
            transform: none !important;
          }
          /* Laptop un poco más abajo dentro del collage en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-laptop {
            left: -7% !important;
            top: 4% !important;
            width: 114% !important;
          }
          /* Señor más grande en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-man {
            width: 70% !important;
            right: 0 !important;
            bottom: -8% !important;
          }
          /* Círculo chiquito más arriba en iPad vertical */
          #inicio .hero-collage-wrapper .hero-illustration-circle-top {
            top: 0% !important;
          }
        }
        /* iPad Pro 12.9" (portrait ~1024px): laptop y señor más chicos; 1024–1180 para que aplique con zoom/UI del navegador */
        @media (min-width: 1024px) and (max-width: 1180px) and (orientation: portrait) {
          #inicio .hero-collage-wrapper .hero-illustration-laptop {
            left: 0% !important;
            top: 2% !important;
            width: 95% !important;
          }
          #inicio .hero-collage-wrapper .hero-illustration-man {
            width: 42% !important;
            right: 0 !important;
            bottom: -18% !important;
          }
        }
        /* Ocultar banner WhatsApp en iPad (portrait y landscape) */
        @media (min-width: 768px) and (max-width: 1366px) {
          #inicio .hero-whatsapp-banner {
            display: none !important;
          }
        }
      `}} />
      <HeroIpadProStyles />
    </section>
  );
}
