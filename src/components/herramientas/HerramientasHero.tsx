'use client';

import Image from 'next/image';

export function HerramientasHero() {
  return (
    <section className="relative w-full bg-[#1E1A49] overflow-hidden">
      {/* Bloques decorativos */}
      <div className="absolute left-10 top-24 opacity-40 rotate-12 w-16 md:w-20 z-10">
        <Image
          src="/solar/icons/Blocksblue.svg"
          alt=""
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <div className="absolute right-10 top-24 opacity-40 -rotate-12 w-16 md:w-20 z-10">
        <Image
          src="/solar/icons/Blocksblue.svg"
          alt=""
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      {/* Contenedor centrado con circle.svg */}
      <div className="flex items-center justify-center h-[320px] md:h-[380px] relative z-20">
        <div className="w-[260px] sm:w-[320px] md:w-[380px]">
          <Image
            src="/solar/icons/Circle.svg"
            alt=""
            width={380}
            height={380}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
