import Image from 'next/image';
import type { Programa } from '@/data/programas';

interface ProgramaHeroProps {
  programa: Programa;
}

export function ProgramaHero({ programa }: ProgramaHeroProps) {
  return (
    <section className="relative w-full pb-8 sm:pb-12">
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-video w-full">
          <Image
            src={programa.imageSrc}
            alt={programa.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Overlay degradado inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1D194C]/60 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
