'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

type HeroCompositeIllustrationProps = {
  className?: string;
  usePlaceholders?: boolean; // default: true
  assets?: {
    backplateSvg?: string; // default "/hero/hero-backplate.svg"
    pixelsSvg?: string;    // default "/hero/hero-pixels.svg"
    personImg?: string;    // default "/hero/hero-person.webp"
    laptopImg?: string;    // default "/hero/hero-laptop.webp"
  };
};

export default function HeroCompositeIllustration({
  className,
  usePlaceholders = true,
  assets = {},
}: HeroCompositeIllustrationProps) {
  const {
    backplateSvg = '/hero/hero-backplate.svg',
    pixelsSvg = '/hero/hero-pixels.svg',
    personImg = '/hero/hero-person.webp',
    laptopImg = '/hero/hero-laptop.webp',
  } = assets;

  return (
    <div
      className={cn(
        'relative aspect-square w-full',
        className
      )}
    >
      {/* Capa 1 (z-0): Backplate SVG */}
      <div className="absolute inset-0 m-auto w-[92%] h-auto pointer-events-none">
        <img
          src={backplateSvg}
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Capa 2 (z-10): Pixel blocks SVG */}
      <div className="absolute left-[18%] top-[56%] w-[18%] opacity-90 pointer-events-none z-10">
        <img
          src={pixelsSvg}
          alt=""
          className="w-full h-auto"
        />
      </div>

      {/* Capa 3 (z-20): Círculos decorativos */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute left-[15%] top-[30%] w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm" />
        <div className="absolute right-[25%] top-[20%] w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm" />
        <div className="absolute left-[30%] bottom-[25%] w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm" />
      </div>

      {/* Capa 4 (z-30): Laptop */}
      {usePlaceholders ? (
        <div className="absolute left-[-6%] top-[22%] w-[74%] pointer-events-none z-30">
          <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur p-8 flex items-center justify-center min-h-[200px]">
            <span className="text-white/60 text-sm font-medium">LAPTOP</span>
          </div>
        </div>
      ) : (
        <div className="absolute left-[-6%] top-[22%] w-[74%] pb-[56.25%] pointer-events-none z-30 relative">
          <Image
            src={laptopImg}
            alt=""
            fill
            className="object-contain object-left-top"
            sizes="(max-width: 768px) 80vw, 520px"
            priority
          />
        </div>
      )}

      {/* Capa 5 (z-50): Person */}
      {usePlaceholders ? (
        <div className="absolute right-[-2%] bottom-[-2%] w-[48%] pointer-events-none z-50">
          <div className="bg-white/10 border border-white/20 rounded-2xl backdrop-blur p-8 flex items-center justify-center min-h-[300px]">
            <span className="text-white/60 text-sm font-medium">PERSON</span>
          </div>
        </div>
      ) : (
        <div className="absolute right-[-2%] bottom-[-2%] w-[48%] pb-[133%] pointer-events-none z-50 relative">
          <Image
            src={personImg}
            alt=""
            fill
            className="object-contain object-right-bottom"
            sizes="(max-width: 768px) 80vw, 520px"
            priority
          />
        </div>
      )}
    </div>
  );
}

