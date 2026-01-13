'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const proyectos = [
  {
    title: 'Inclusión digital',
    description: 'Transformamos vidas a través de la tecnología en Chihuahua.',
    image: '/images/Proyecto_InclusionDigital.jpg',
  },
  {
    title: 'Desigualdad Reducida',
    description: 'Aprovechamos tecnología para disminuir la desigualdad en recursos.',
    image: '/images/500.jpg',
  },
  {
    title: 'Transformación Social',
    description: 'Impulsamos proyectos que mejoran la calidad de vida comunitaria.',
    image: '/images/CapacitacionCiber.jpg',
  },
  {
    title: 'Tecnología accesible',
    description: 'Facilitamos el acceso a herramientas digitales para todos.',
    image: '/images/Proyecto_TecnologiaAccesible.jpg',
  },
];

// Componente helper para la card
function ProyectoCard({ proyecto, className = '' }: { proyecto: typeof proyectos[0]; className?: string }) {
  return (
    <div className={className}>
      {/* Frame tipo ventana */}
      <div className="rounded-3xl overflow-hidden border-2 border-[#7B87FF] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        {/* Barra superior tipo navegador */}
        <div className="h-12 bg-[#3B3B7A] flex items-center px-4 gap-2">
          {/* 3 puntitos a la izquierda */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/70"></div>
          </div>
          {/* Barra sutil a la derecha */}
          <div className="h-2 w-3/5 rounded-full bg-white/15 ml-auto"></div>
        </div>

        {/* Área de imagen */}
        <div className="relative aspect-video w-full">
          <Image
            src={proyecto.image}
            alt={proyecto.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 25vw"
          />
          {/* Degradado naranja abajo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#E68956]/35 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Contenido debajo de la card */}
      <div className="mt-6 space-y-4">
        {/* Título */}
        <h3 className="text-[#1D194C] font-tech font-extrabold text-2xl leading-tight">
          {proyecto.title}
        </h3>

        {/* Descripción */}
        <p className="text-[#1D194C]/70 leading-relaxed text-base">
          {proyecto.description}
        </p>

        {/* Botón */}
        <button
          onClick={() => {}}
          className="rounded-full px-6 py-3 bg-[#E68956] text-white font-semibold hover:bg-[#D67A45] transition-colors"
        >
          Más información
        </button>
      </div>
    </div>
  );
}

export function ProgramasProyectosSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Duplicar proyectos para crear efecto de carrusel infinito
  const proyectosDuplicados = [...proyectos, ...proyectos, ...proyectos];

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const firstCard = container.firstElementChild as HTMLElement;

    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 32; // gap-8 = 2rem = 32px
    const step = (cardWidth + gap) * 1; // Mover 1.5 cards a la vez

    container.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full bg-[#E7E9FF] py-18 sm:py-20 lg:py-24 overflow-x-clip">
      <Container>
        {/* Título */}
        <h2 className="text-center text-4xl sm:text-5xl lg:text-6xl font-tech font-extrabold tracking-tight text-[#1D194C] mb-12 lg:mb-16">
          Proyectos.
        </h2>

        {/* Contenedor relativo para las flechas */}
        <div className="relative px-12 sm:px-16 lg:px-20">
          {/* Flechas laterales */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-[#1D194C]/40 bg-transparent grid place-items-center hover:bg-white/20 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-[#1D194C]" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-[#1D194C]/40 bg-transparent grid place-items-center hover:bg-white/20 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 text-[#1D194C]" />
          </button>

          {/* Carrusel (infinito con los 4 proyectos) */}
          <div
            ref={containerRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {proyectosDuplicados.map((proyecto, index) => (
              <ProyectoCard
                key={`${proyecto.title}-${index}`}
                proyecto={proyecto}
                className="snap-center shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] flex flex-col"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
