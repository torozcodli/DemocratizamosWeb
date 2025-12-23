'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import { BgPixelBlocks } from '@/components/ui/BgPixelBlocks';

type HeroIllustrationProps = {
  className?: string;
};

export default function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[640px] mx-auto aspect-[804/853] min-h-[360px] overflow-visible',
        className
      )}
    >
      {/* Capa 1 (z-0): Backplate SVG */}
      <div className="absolute inset-0 m-auto w-[100%] lg:w-[98%] h-auto translate-x-[25%] pointer-events-none z-0">
        <img
          src="/hero/hero-backplate.svg"
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Capa 2 (z-10): Pixel blocks - reusar el mismo de sección 5 */}
      <BgPixelBlocks className="absolute left-[42%] top-[38%] lg:left-[18%] lg:top-[20%] z-10 w-[176px] h-[85px] opacity-70 drop-shadow-sm pointer-events-none" />
      <BgPixelBlocks className="absolute left-[46%] top-[62%] lg:left-[10%] lg:top-[65%] z-10 w-[176px] h-[85px] opacity-60 drop-shadow-sm pointer-events-none" />

      {/* Capa 3 (z-10): Círculos naranja (atrás) */}
      {/* circle-orange-bottom (bottom: smaller => lower) */}
      <div
        className="absolute left-[calc(4%-1cm)] bottom-[calc(12%-2cm)] lg:left-[calc(0%-1cm)] lg:bottom-[calc(14%-2cm)] w-[46%] lg:w-[42%] aspect-square rounded-full opacity-90 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)',
        }}
      />
      <div
        className="absolute left-[48%] top-[6%] lg:left-[44%] lg:top-[4%] w-[24%] lg:w-[22%] aspect-square rounded-full opacity-85 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)',
        }}
      />

      {/* Capa 4 (z-20): Círculos morado/azul translúcido (al centro) */}
      <div className="absolute left-[40%] top-[36%] lg:left-[40%] lg:top-[34%] w-[20%] aspect-square rounded-full bg-[#9DACFD]/45 z-20 pointer-events-none" />
      <div className="absolute left-[46%] top-[56%] lg:left-[46%] lg:top-[54%] w-[24%] aspect-square rounded-full bg-[#9DACFD]/35 z-20 pointer-events-none" />

      {/* Capa 5 (z-30): Laptop (con D incluida) */}
      <div className="absolute left-[-2%] top-[8%] md:left-[-4%] md:top-[10%] lg:left-[-6%] lg:top-[12%] w-[135%] md:w-[135%] lg:w-[130%] aspect-[4/3] relative z-30 pointer-events-none">
        <Image
          src="/hero/hero-laptop.png"
          alt=""
          fill
          className="object-contain object-left-top"
          sizes="(max-width: 768px) 80vw, 620px"
          priority
        />
      </div>

      {/* Capa 6 (z-40): Hombre - posicionamiento fijo independiente */}
      {/* man (bottom: bigger => higher) */}
      <div className="absolute right-[-54%] translate-x-[2px] bottom-[calc(30%+4.5cm-15px)] md:right-[-54%] md:translate-x-[2px] md:bottom-[calc(40%+6.5cm-15px)] lg:right-[-54%] lg:translate-x-[2px] lg:bottom-[calc(35%+6.5cm-15px)] w-[64%] md:w-[66%] lg:w-[70%] aspect-[3/4] relative z-40 pointer-events-none">
        <Image
          src="/hero/hero-man.png"
          alt=""
          fill
          className="object-contain object-right-bottom"
          sizes="(max-width: 768px) 80vw, 620px"
          priority
        />
      </div>
    </div>
  );
}
