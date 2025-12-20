'use client';

import { useRef } from 'react';

const allies = [
  { name: 'Fundación Coppel', file: 'fundacion-coppel.svg' },
  { name: 'Bridge for Billions', file: 'bridge-for-billions.svg' },
  { name: 'Desarrollo Económico', file: 'desarrollo-economico.svg' },
  { name: 'Tecnológico de Monterrey', file: 'tecnologico-de-monterrey.svg' },
  { name: 'Frente Norte', file: 'frente-norte.svg' },
  { name: 'ENCES', file: 'ences.svg' },
  { name: 'Secretaría Innovación y Desarrollo Económico', file: 'secretaria-innovacion-y-desarrollo-economico.svg' },
  { name: 'Instituto de Apoyo al Desarrollo Tecnológico', file: 'instituto-de-apoyo-al-desarrollo-tecnologico.svg' },
  { name: 'Chihuahua Capital', file: 'chihuahua-capital.svg' },
];

export function AlliesCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const firstCard = container.firstElementChild as HTMLElement;
    
    if (!firstCard) return;

    // Calcular el paso: ancho de la card + gap (32px = gap-8)
    const cardWidth = firstCard.offsetWidth;
    const gap = 32; // gap-8 = 2rem = 32px
    const step = cardWidth + gap;

    container.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative px-12 sm:px-16 lg:px-20">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-[#1E1A49] text-[#1E1A49] bg-transparent hover:bg-white/30 transition-colors flex items-center justify-center"
        aria-label="Anterior"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M15 18L9 12L15 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Carrusel */}
      <div
        ref={containerRef}
        className="overflow-x-auto flex gap-8 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {allies.map((ally, index) => (
          <div
            key={index}
            className="bg-white rounded-[32px] shadow-sm h-20 sm:h-24 lg:h-28 min-w-[200px] sm:min-w-[220px] lg:min-w-[240px] flex items-center justify-center px-8 snap-center flex-shrink-0"
          >
            <img
              src={`/solar/icons/${ally.file}`}
              alt={ally.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full border border-[#1E1A49] text-[#1E1A49] bg-transparent hover:bg-white/30 transition-colors flex items-center justify-center"
        aria-label="Siguiente"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
