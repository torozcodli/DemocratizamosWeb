import Image from 'next/image';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { BgPixelBlocks } from '@/components/ui/BgPixelBlocks';

export function NosotrosHero() {
  return (
    <section className="relative w-full overflow-x-clip min-h-[calc(100vh-80px)] flex items-center">
      {/* Background gradiente oscuro */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(180deg, #090828 0%, #1D194C 100%)',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {/* Título "Nosotros." abajo izquierda */}
        <h1 className="absolute bottom-2 md:bottom-4 lg:bottom-6 left-2 sm:left-4 md:left-6 lg:left-8 text-[clamp(48px,6vw,80px)] md:text-[clamp(52px,6.5vw,80px)] font-tech tracking-[-0.02em] text-[#E1E6FD] z-20">
          Nosotros.
        </h1>

        {/* Composición central */}
        <div className="relative w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px] aspect-square flex items-center justify-center">
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
          <div className="relative z-20 w-[50%] sm:w-[55%] md:w-[60%] lg:w-[65%] aspect-[733/835]">
            <Image
              src="/solar/icons/Girl.svg"
              alt=""
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Globito "¡Te contamos más de nosotros!" cerca del torso */}
          <div className="absolute left-[50%] top-[58%] md:top-[56%] lg:top-[54%] -translate-x-1/2 -translate-y-1/2 z-30 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
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
        <div className="absolute bottom-4 md:bottom-8 lg:bottom-12 right-2 sm:right-4 md:right-6 lg:right-8 z-20">
          <WhatsAppBanner />
        </div>
      </div>
    </section>
  );
}

