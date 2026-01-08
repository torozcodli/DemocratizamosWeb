import Image from 'next/image';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { BgPixelBlocks } from '@/components/ui/BgPixelBlocks';

export function NosotrosHero() {
  return (
    <section className="relative w-full overflow-x-clip min-h-[calc(100vh-80px)] flex items-center pb-[env(safe-area-inset-bottom)]">
      {/* Background gradiente oscuro */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #090828 0%, #1D194C 100%)',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 md:px-8">
        {/* Título "Nosotros." abajo izquierda */}
        <h1 className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 xl:bottom-6 left-4 sm:left-6 md:left-8 lg:left-10 xl:left-8 text-[clamp(40px,9vw,68px)] sm:text-[clamp(44px,10vw,72px)] md:text-[clamp(48px,6vw,70px)] lg:text-[clamp(50px,6.5vw,72px)] xl:text-[clamp(42px,5.2vw,68px)] font-tech tracking-[-0.02em] text-[#E1E6FD] z-20">
          Nosotros.
        </h1>

        {/* Composición central */}
        <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[800px] aspect-square flex items-center justify-center">
          {/* Círculo grande lavanda detrás */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[60%] md:w-[65%] lg:w-[70%] aspect-square rounded-full bg-[#9DACFF]/25 blur-[3px]"></div>
          </div>

          {/* Círculo naranja pequeño arriba derecha */}
          <div className="absolute top-[8%] right-[12%] w-[10%] md:w-[12%] lg:w-[15%] aspect-square rounded-full bg-gradient-to-br from-[#FF8948] to-[#FFD1BD] opacity-75"></div>

          {/* Pixel blocks decorativos */}
          <BgPixelBlocks className="absolute left-[10%] top-[20%] z-10 w-[80px] h-[40px] md:w-[100px] md:h-[50px] lg:w-[120px] lg:h-[60px] opacity-60 drop-shadow-sm pointer-events-none" />
          <BgPixelBlocks className="absolute right-[15%] bottom-[25%] z-10 w-[70px] h-[35px] md:w-[90px] md:h-[45px] lg:w-[110px] lg:h-[55px] opacity-50 drop-shadow-sm pointer-events-none" />

          {/* Chica centrada */}
          <div className="relative z-20 w-[50%] sm:w-[55%] md:w-[55%] lg:w-[60%] xl:w-[65%] aspect-[733/835]">
            <Image
              src="/solar/icons/Girl.svg"
              alt=""
              fill
              className="object-contain"
              priority
            />
            {/* Círculo en esquina inferior izquierda de la chica */}
            <div className="absolute bottom-0 left-0 w-[24%] md:w-[28%] lg:w-[30%] xl:w-[30%] aspect-square rounded-full bg-gradient-to-br from-[#6F74C9] to-[#9DACFF] opacity-100 z-30 nosotros-circle-blue"></div>
          </div>

          {/* Globito "¡Te contamos más de nosotros!" cerca del torso */}
          <div 
            className="absolute left-1/2 bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 xl:left-1/2 xl:top-[58%] xl:bottom-auto z-30 w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] xl:w-[200px] nosotros-tecontamos"
          >
            <Image
              src="/solar/icons/Tecontamos.svg"
              alt="¡Te contamos más de nosotros!"
              width={200}
              height={100}
              className="w-full h-auto object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* WhatsApp Banner abajo derecha */}
        <div 
          className="absolute bottom-[max(12px,env(safe-area-inset-bottom))] sm:bottom-[max(16px,env(safe-area-inset-bottom))] md:bottom-8 lg:bottom-12 xl:bottom-4 right-[max(12px,env(safe-area-inset-right))] sm:right-4 md:right-6 lg:right-8 xl:right-8 z-20 nosotros-whatsapp-banner"
        >
          <WhatsAppBanner />
        </div>
      </div>
    </section>
  );
}

