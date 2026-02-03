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
      {/* Pestaña superior: inline-flex para que el label no choque con el borde */}
      <div className="absolute -top-6 left-6 sm:left-8 z-20">
        <div className="inline-flex items-center bg-[#5A5E8C] border-2 border-[#E1E6FD]/55 rounded-t-2xl px-4 py-2 sm:px-6 sm:py-2">
          <h3 className="tech-word text-white text-lg md:text-xl font-bold">
            {title}
          </h3>
        </div>
      </div>

      {/* Card principal: overflow-hidden solo en móvil para que nada invada; md+ intacto */}
      <div className="relative bg-[#5A5E8C]/55 backdrop-blur-sm border-2 border-[#E1E6FD]/55 rounded-3xl pt-14 pb-8 px-6 sm:px-8 md:px-10 md:pt-20 md:pb-10 overflow-hidden md:overflow-visible">
        {/* Línea decorativa: oculta en móvil y en iPad vertical; visible desde tablet y desktop */}
        <div className="tech-card-decorative-line pointer-events-none absolute left-0 right-0 -top-5 md:-top-4 z-0 hidden md:block ipadP:hidden">
          <DecorativeLine
            className="w-full -ml-[36px] scale-[0.70] md:scale-[0.75] origin-left"
            title="Decorative line"
          />
        </div>

        {/* Contenido: menos margen arriba en móvil para quitar espacio vacío */}
        <div className="relative z-10 mt-2 md:mt-4 text-[#E7ECFF]/90 text-[18px] md:text-[20px] leading-8 md:leading-9">
          {children}
        </div>
      </div>
    </div>
  );
}
