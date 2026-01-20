'use client';

import Image from 'next/image';

export function HerramientasHero() {
  return (
    <section className="relative w-full bg-[#1E1A49] overflow-visible min-h-[420px] md:min-h-[520px] lg:min-h-[620px] py-12 md:py-16 lg:py-20">
      {/* Bloques decorativos - más separados y a media altura */}
      <div className="absolute left-4 lg:left-10 top-[45%] opacity-75 rotate-12 w-[80px] md:w-[110px] z-10">
        <Image
          src="/solar/icons/Blocksblue.svg"
          alt=""
          width={110}
          height={110}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
      <div className="absolute right-4 lg:right-10 top-[45%] opacity-75 -rotate-12 w-[80px] md:w-[110px] z-10">
        <Image
          src="/solar/icons/Blocksblue.svg"
          alt=""
          width={110}
          height={110}
          className="object-contain"
          style={{ width: 'auto', height: 'auto' }}
        />
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
