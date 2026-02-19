import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { BgPixelBlocks } from '@/components/ui/BgPixelBlocks';

export async function NosotrosHero() {
  const t = await getTranslations('nosotros.hero');
  return (
    <section className="relative w-full overflow-x-clip">
      {/* ========== MOBILE (base / sm): sin título "Nosotros", collage centrado ========== */}
      <div className="relative isolate overflow-hidden md:hidden" style={{ background: 'linear-gradient(180deg, #090828 0%, #1D194C 100%)' }}>
        <div className="mx-auto grid min-h-[calc(80vh-72px)] place-items-center px-4 pt-4 pb-6">
          <div
            className="relative isolate"
            style={{ width: 'clamp(260px, 78vw, 380px)', aspectRatio: '1 / 1.2' }}
          >
            {/* 2) Círculos naranjas — mismo gradiente que Inicio */}
            <div
              className="absolute right-[10%] top-[18%] z-[5] rounded-full"
              style={{
                width: 'clamp(60px, 18vw, 120px)',
                height: 'clamp(60px, 18vw, 120px)',
                background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)',
              }}
            />
            <div
              className="absolute bottom-[18%] left-[8%] z-[5] rounded-full"
              style={{
                width: 'clamp(70px, 20vw, 130px)',
                height: 'clamp(70px, 20vw, 130px)',
                background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)',
              }}
            />

            {/* 3) Pixeles decorativos */}
            <div className="absolute left-[8%] top-[22%] z-10 opacity-60">
              <BgPixelBlocks className="pointer-events-none h-[clamp(32px,10vw,48px)] w-[clamp(64px,20vw,96px)] drop-shadow-sm" />
            </div>
            <div className="absolute bottom-[24%] right-[10%] z-10 opacity-50">
              <BgPixelBlocks className="pointer-events-none h-[clamp(28px,8vw,42px)] w-[clamp(56px,16vw,84px)] drop-shadow-sm" />
            </div>

            {/* 4) Persona (Girl) — encima */}
            <div
              className="absolute left-1/2 top-[45%] z-20 w-[78%] -translate-x-1/2 -translate-y-1/2"
              style={{ aspectRatio: '733/835' }}
            >
              <Image
                src="/solar/icons/Girl.svg"
                alt=""
                width={733}
                height={835}
                className="h-auto w-full object-contain"
                priority
              />
            </div>

            {/* 5) Label "¡Te contamos más de nosotros!" (SVG) — más chico, 1cm izq, 2cm arriba */}
            <div
              className="absolute bottom-[calc(10%+2cm)] left-[calc(50%-1cm)] z-30 -translate-x-1/2"
              style={{ width: 'clamp(90px, 30vw, 160px)' }}
            >
              <Image
                src="/solar/icons/Tecontamos.svg"
                alt={t('teContamosAlt')}
                width={200}
                height={100}
                className="h-auto w-full object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Banner — móvil */}
        <div className="absolute bottom-[max(12px,env(safe-area-inset-bottom))] right-[max(12px,env(safe-area-inset-right))] z-20">
          <WhatsAppBanner />
        </div>
      </div>

      {/* ========== TABLET / DESKTOP (md+): diseño actual sin cambios ========== */}
      <div className="nosotros-hero-desktop relative hidden min-h-[calc(100vh-80px)] flex items-center overflow-x-clip pb-[env(safe-area-inset-bottom)] md:block">
        {/* Background gradiente oscuro */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, #090828 0%, #1D194C 100%)',
          }}
        />

        {/* Contenido */}
        <div className="relative z-10 flex h-full w-full items-center justify-center px-4 sm:px-6 md:px-8">
          {/* Título "Nosotros." abajo izquierda — solo tablet/desktop */}
          <h1 className="absolute bottom-4 left-4 text-[clamp(40px,9vw,68px)] font-tech tracking-[-0.02em] text-[#E1E6FD] z-20 sm:bottom-6 sm:left-6 sm:text-[clamp(44px,10vw,72px)] md:bottom-8 md:left-8 md:text-[clamp(48px,6vw,70px)] lg:bottom-10 lg:left-10 lg:text-[clamp(50px,6.5vw,72px)] xl:bottom-6 xl:left-8 xl:text-[clamp(42px,5.2vw,68px)]">
            {t('title')}
          </h1>

          {/* Composición central */}
          <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[340px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[800px]">
            {/* Círculo grande lavanda detrás */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="aspect-square w-[60%] rounded-full bg-[#9DACFF]/25 blur-[3px] md:w-[65%] lg:w-[70%]"></div>
            </div>

            {/* Círculo naranja pequeño arriba derecha */}
            <div className="absolute right-[12%] top-[8%] aspect-square w-[10%] rounded-full bg-gradient-to-br from-[#FF8948] to-[#FFD1BD] opacity-75 md:w-[12%] lg:w-[15%]"></div>

            {/* Pixel blocks decorativos */}
            <BgPixelBlocks className="absolute left-[10%] top-[20%] z-10 h-[40px] w-[80px] opacity-60 drop-shadow-sm pointer-events-none md:h-[50px] md:w-[100px] lg:h-[60px] lg:w-[120px]" />
            <BgPixelBlocks className="absolute right-[15%] bottom-[25%] z-10 h-[35px] w-[70px] opacity-50 drop-shadow-sm pointer-events-none md:h-[45px] md:w-[90px] lg:h-[55px] lg:w-[110px]" />

            {/* Chica centrada */}
            <div className="relative z-20 aspect-[733/835] w-[50%] sm:w-[55%] md:w-[55%] lg:w-[60%] xl:w-[65%]">
              <Image
                src="/solar/icons/Girl.svg"
                alt=""
                fill
                className="object-contain"
                priority
              />
              {/* Círculo en esquina inferior izquierda de la chica */}
              <div className="nosotros-circle-blue absolute bottom-0 left-0 z-30 aspect-square w-[24%] rounded-full bg-gradient-to-br from-[#6F74C9] to-[#9DACFF] opacity-100 md:w-[28%] lg:w-[30%] xl:w-[30%]"></div>
            </div>

            {/* Globito "¡Te contamos más de nosotros!" */}
            <div className="nosotros-tecontamos absolute bottom-4 left-1/2 z-30 w-[100px] sm:bottom-6 sm:w-[120px] md:bottom-8 md:w-[140px] lg:bottom-10 lg:w-[160px] xl:left-1/2 xl:top-[58%] xl:bottom-auto xl:w-[200px]">
              <Image
                src="/solar/icons/Tecontamos.svg"
                alt={t('teContamosAlt')}
                width={200}
                height={100}
                className="w-full h-auto object-contain drop-shadow-lg"
                priority
              />
            </div>
          </div>

          {/* WhatsApp Banner abajo derecha */}
          <div className="nosotros-whatsapp-banner absolute bottom-[max(12px,env(safe-area-inset-bottom))] right-[max(12px,env(safe-area-inset-right))] z-20 sm:bottom-[max(16px,env(safe-area-inset-bottom))] sm:right-4 md:bottom-8 md:right-6 lg:bottom-12 lg:right-8 xl:bottom-4 xl:right-8">
            <WhatsAppBanner />
          </div>
        </div>
      </div>
    </section>
  );
}
