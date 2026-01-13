import Image from 'next/image';
import { Container } from '@/components/ui/Container';

// YouTube video ID from: https://youtu.be/IJDPSk9VqxQ
const YOUTUBE_VIDEO_ID = 'IJDPSk9VqxQ';

export function NosotrosTestimonioVideoSection() {
  return (
    <section className="relative w-full overflow-x-clip bg-[#1D194C] py-14 sm:py-16 lg:py-20">
      <Container className="relative z-10">
        {/* Decoración pixel blocks (derecha, fondo) */}
        <div className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden md:block z-0">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={106}
            height={106}
            className="opacity-80"
            aria-hidden="true"
          />
        </div>

        {/* Frame tipo ventana de navegador */}
        <div className="relative w-full max-w-5xl mx-auto rounded-[28px] border border-white/25 shadow-[0_24px_70px_rgba(0,0,0,0.35)] overflow-hidden z-10">
          {/* Barra superior del frame (header estilo Mac) */}
          <div className="h-12 bg-white/10 flex items-center px-4 gap-2 border-b border-white/10">
            {/* 3 puntos estilo Mac */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/60"></div>
            </div>
            {/* Línea sutil horizontal opcional */}
            <div className="flex-1 h-px bg-white/5 ml-4"></div>
          </div>

          {/* Contenedor del video */}
          <div className="relative aspect-video w-full bg-black">
            {/* Badge / pill naranja flotante */}
            <div className="absolute left-4 sm:left-6 top-6 z-20 bg-[#E68956] text-white font-semibold rounded-full px-5 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)] max-w-[90%] text-sm sm:text-base">
              ¡Alguien como tú, contando su experiencia!
            </div>

            {/* Iframe de YouTube */}
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="Video testimonio"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </Container>

      {/* 
        NOTAS DE IMPLEMENTACIÓN:
        - Background: #1D194C (sólido)
        - Frame max-width: max-w-5xl
        - Badge position: left-4 sm:left-6, top-6, z-20
        - Pixel blocks position: right-8, top-1/2, z-0 (hidden en mobile)
        - Video aspect ratio: 16:9 (aspect-video)
      */}
    </section>
  );
}
