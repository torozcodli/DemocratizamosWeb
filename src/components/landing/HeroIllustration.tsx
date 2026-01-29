import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

type HeroIllustrationProps = {
  className?: string;
};

export default function HeroIllustration({ className }: HeroIllustrationProps) {
  return (
    <>
      {/* Mobile only: backplate + circles + laptop + man */}
      <div className="sm:hidden w-full">
        <div className="relative mx-auto w-full max-w-[340px] aspect-[10/11] overflow-visible">
          <div className="absolute inset-[-4%] z-10 pointer-events-none">
            <img src="/hero/hero-backplate.svg" alt="" className="w-full h-full object-contain" />
          </div>

          <div
            className="absolute left-[-8%] bottom-[8%] w-[46%] aspect-square rounded-full z-20 pointer-events-none"
            style={{ background: 'linear-gradient(180deg, #FF8948 0%, #FFD1BD 100%)' }}
          />
          <div
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

      {/* Tablet + desktop */}
      <div className={cn('hidden sm:block relative w-full aspect-[4/5] sm:aspect-[16/17] lg:aspect-[4/5] overflow-visible', className)}>
        <div className="absolute left-[6%] top-[4%] w-[88%] h-auto z-30 pointer-events-none">
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
        <div className="absolute right-[2%] bottom-[0%] w-[45%] h-auto z-40 pointer-events-none">
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
    </>
  );
}
