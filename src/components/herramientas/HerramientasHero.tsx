'use client';

import Image from 'next/image';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';

export function HerramientasHero() {
  return (
    <section className="relative w-full bg-[#1E1A49] overflow-visible min-h-[420px] md:min-h-[520px] lg:min-h-[620px] py-12 md:py-16 lg:py-20">
      {/* Bloques decorativos - más separados y a media altura */}
      {/* Bloque izquierdo: más a la derecha */}
      <div className="absolute left-20 md:left-28 lg:left-36 top-[52%] md:top-[55%] opacity-75 rotate-12 w-[80px] md:w-[110px] z-10">
        <Image
          src="/solar/icons/Blocksblue.svg"
          alt=""
          width={110}
          height={110}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
      {/* Bloque derecho: más arriba y más a la izquierda */}
      <div className="absolute right-28 md:right-36 lg:right-40 top-[28%] md:top-[29%] opacity-75 -rotate-12 w-[80px] md:w-[110px] z-10">
        <Image
          src="/solar/icons/Blocksblue.svg"
          alt=""
          width={110}
          height={110}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      {/* Frame.svg - esquina izquierda arriba (más hacia el centro, con margen superior) */}
      <div className="absolute left-4 md:left-8 lg:left-12 top-4 md:top-6 lg:top-8 opacity-60 z-10 w-[200px] md:w-[280px] lg:w-[350px] scale-x-[-1]">
        <Image
          src="/solar/icons/Frame.svg"
          alt=""
          width={484}
          height={234}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      {/* Frame.svg - esquina derecha abajo (más hacia el centro, con margen inferior) */}
      <div className="absolute right-4 md:right-8 lg:right-12 bottom-4 md:bottom-6 lg:bottom-8 opacity-60 z-10 w-[200px] md:w-[280px] lg:w-[350px] rotate-180">
        <Image
          src="/solar/icons/Frame.svg"
          alt=""
          width={484}
          height={234}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>

      {/* WhatsApp Banner flotante */}
      <div className="absolute bottom-4 md:bottom-8 lg:bottom-12 right-0 md:right-0 lg:right-0 z-30" style={{ transform: 'translateX(15px)' }}>
        <WhatsAppBanner />
      </div>

      {/* Contenedor centrado con circle.svg - más grande y con más aire */}
      <div className="flex items-center justify-center relative z-20 max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="w-[280px] h-[280px] md:w-[420px] md:h-[420px] lg:w-[520px] lg:h-[520px] xl:w-[580px] xl:h-[580px] lg:-translate-y-[10px]">
          <Image
            src="/solar/icons/Circle.svg"
            alt=""
            width={580}
            height={580}
            className="w-full h-full object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
}
