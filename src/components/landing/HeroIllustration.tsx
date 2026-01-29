import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

type HeroIllustrationProps = {
  className?: string;
};

export default function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <div className="w-full">
      {/* Mobile only: backplate + circles + laptop + man */}
      <div className="sm:hidden w-full">
        <div className="relative mx-auto w-full max-w-[340px] aspect-[10/11] overflow-visible">
          <div className="absolute inset-[-4%] z-10 pointer-events-none">
            <img src="/hero/hero-backplate.svg" alt="" className="w-full h-full object-contain" />
          </div>

          <div
            data-hero-circle
            className="absolute left-[-8%] bottom-[8%] w-[46%] aspect-square rounded-full z-20 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)' }}
          />
          <div
            data-hero-circle
            className="absolute right-[10%] top-[8%] w-[32%] aspect-square rounded-full z-20 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)' }}
          />

          <div className="hero-mobile-laptop absolute left-[-4%] top-[14%] w-[108%] z-30 pointer-events-none">
            <Image
              src="/hero/hero-laptop.png"
              alt="Laptop con letra D"
              width={800}
              height={600}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 80vw, 420px"
              priority
            />
          </div>

          <div className="hero-mobile-man absolute right-0 w-[70%] z-40 pointer-events-none" style={{ bottom: '-0.3cm' }}>
            <Image
              src="/hero/hero-man.png"
              alt="Persona"
              width={400}
              height={600}
              className="w-full h-auto object-contain object-right-bottom"
              sizes="(max-width: 768px) 80vw, 420px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Tablet + desktop: como referencia — backplate z-10, círculos esquinas (más grande abajo), laptop centrada, señor abajo-derecha */}
      <div
        className={cn(
          'hidden sm:block relative w-full aspect-[4/5] sm:aspect-[16/17] overflow-visible',
          'lg:aspect-[16/10] xl:aspect-[16/9]',
          className
        )}
      >
        {/* 1. Backplate — z-10; desktop: un poco más a la derecha (+2px) */}
        <div className="absolute inset-0 z-10 pointer-events-none lg:inset-[-9%] xl:inset-[-11%] 2xl:inset-[-13%] lg:translate-x-[calc(9%+2px)] lg:translate-y-[7%] xl:translate-x-[calc(10%+2px)] xl:translate-y-[8%] 2xl:translate-x-[calc(11%+2px)] 2xl:translate-y-[9%]">
          <img
            src="/hero/hero-backplate.svg"
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>

        {/* 2. Círculos naranjas — z-20; animación scale al scroll (HeroCirclesScrollEffect) */}
        <div
          data-hero-circle
          className="absolute left-[-8%] bottom-[8%] w-[46%] aspect-square rounded-full z-20 pointer-events-none lg:left-[calc(3%+2cm)] lg:bottom-[-3cm] lg:w-[32%] xl:left-[calc(4%+2cm)] xl:bottom-[-3cm] xl:w-[30%] 2xl:left-[calc(4%+2cm)] 2xl:bottom-[-3cm] 2xl:w-[28%]"
          style={{ background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)' }}
        />
        <div
          data-hero-circle
          className="absolute right-[10%] top-[8%] w-[32%] aspect-square rounded-full z-20 pointer-events-none lg:right-[calc(17%+6cm)] lg:top-[6%] lg:w-[12%] xl:right-[calc(17%+6cm)] xl:top-[6%] xl:w-[14%] 2xl:right-[calc(17%+6cm)] 2xl:top-[6%] 2xl:w-[13%]"
          style={{ background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)' }}
        />

        {/* 3. Laptop — z-30; desktop: más a la derecha, más abajo, un poco más grande */}
        <div className="absolute left-[6%] top-[4%] w-[88%] h-auto z-30 pointer-events-none lg:left-[18%] lg:top-[18%] lg:w-[80%] xl:left-[16%] xl:top-[16%] xl:w-[82%] 2xl:left-[15%] 2xl:top-[15%] 2xl:w-[82%]">
          <Image
            src="/hero/hero-laptop.png"
            alt="Laptop con letra D"
            width={800}
            height={600}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 80vw, 520px"
            priority
          />
        </div>

        {/* 4. Hombre — z-40; desktop: un poco más arriba (+8px), pegado al borde */}
        <div className="absolute right-[2%] bottom-[0%] w-[45%] h-auto z-40 pointer-events-none lg:right-0 lg:bottom-[-28%] lg:translate-y-[-8px] lg:w-[48%] xl:bottom-[-32%] xl:translate-y-[-8px] xl:w-[46%] 2xl:bottom-[-36%] 2xl:translate-y-[-8px] 2xl:w-[44%]">
          <Image
            src="/hero/hero-man.png"
            alt="Persona"
            width={400}
            height={600}
            className="w-full h-auto object-contain object-right-bottom"
            sizes="(max-width: 768px) 80vw, 520px"
            priority
          />
        </div>
      </div>
    </div>
  );
}
