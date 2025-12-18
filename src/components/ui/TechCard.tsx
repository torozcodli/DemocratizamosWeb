import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';
import { DecorativeLine } from './DecorativeLine';

interface TechCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function TechCard({ title, children, className }: TechCardProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Pestaña superior */}
      <div className="absolute -top-6 left-8 z-20">
        <div className="bg-[#5A5E8C] border-2 border-[#E1E6FD]/55 rounded-t-2xl px-6 py-2">
          <h3 className="tech-word text-white text-lg md:text-xl font-bold">
            {title}
          </h3>
        </div>
      </div>

      {/* Card principal */}
      <div className="relative bg-[#5A5E8C]/55 backdrop-blur-sm border-2 border-[#E1E6FD]/55 rounded-3xl pt-20 pb-10 px-8 md:px-10">
        {/* Línea decorativa: más arriba, más pequeña y más a la izquierda */}
        <div className="pointer-events-none absolute left-0 right-0 -top-5 md:-top-4 z-0">
          <DecorativeLine
            className="w-full -ml-[36px] scale-[0.70] md:scale-[0.75] origin-left"
            title="Decorative line"
          />
        </div>

        {/* Contenido */}
        <div className="relative z-10 mt-4 text-[#E7ECFF]/90 text-[18px] md:text-[20px] leading-8 md:leading-9">
          {children}
        </div>
      </div>
    </div>
  );
}
