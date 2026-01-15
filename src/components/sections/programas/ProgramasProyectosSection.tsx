'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Container } from '@/components/ui/Container';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { AddProgramButton } from '@/components/programas/AddProgramButton';

interface Programa {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
}

// Componente helper para la card
function ProyectoCard({ programa, className = '' }: { programa: Programa; className?: string }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(programa.imageUrl);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

  // Normalizar la ruta de la imagen
  useEffect(() => {
    if (programa.imageUrl) {
      let normalizedPath = programa.imageUrl;
      
      // Si la ruta no empieza con http/https o /, agregar /
      if (!normalizedPath.startsWith('http://') && 
          !normalizedPath.startsWith('https://') && 
          !normalizedPath.startsWith('/')) {
        normalizedPath = `/${normalizedPath}`;
      }
      
      setImageSrc(normalizedPath);
      setImageError(false);
      setHasTriedFallback(false);
    }
  }, [programa.imageUrl]);

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
        <div className="relative aspect-video w-full bg-gradient-to-br from-slate-200 to-slate-300">
          {!imageError ? (
            <Image
              src={imageSrc}
              alt={programa.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 25vw"
              unoptimized={imageSrc.startsWith('/images/') || imageSrc.startsWith('/')}
              onError={() => {
                // Intentar fallback: si la imagen está en /images/programas/, intentar /images/
                if (imageSrc.startsWith('/images/programas/') && !imageSrc.startsWith('http') && !hasTriedFallback) {
                  const fileName = imageSrc.split('/').pop();
                  const fallbackPath = `/images/${fileName}`;
                  setImageSrc(fallbackPath);
                  setHasTriedFallback(true);
                  setImageError(false);
                } else {
                  setImageError(true);
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{programa.title}</p>
              </div>
            </div>
          )}
          {/* Degradado naranja abajo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#E68956]/35 via-transparent to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Contenido debajo de la card */}
      <div className="mt-6 space-y-4">
        {/* Título */}
        <h3 className="text-[#1D194C] font-tech font-extrabold text-2xl leading-tight">
          {programa.title}
        </h3>

        {/* Descripción */}
        <p className="text-[#1D194C]/70 leading-relaxed text-base">
          {programa.shortDescription}
        </p>

        {/* Botón */}
        <Link
          href={`/programas/${programa.slug}`}
          prefetch={false}
          className="inline-block rounded-full px-6 py-3 bg-[#E68956] text-white font-semibold hover:bg-[#D67A45] transition-colors"
          aria-label={`Más información sobre ${programa.title}`}
        >
          Más información
        </Link>
      </div>
    </div>
  );
}

export function ProgramasProyectosSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [programs, setPrograms] = useState<Programa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch('/api/programas', {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrograms(Array.isArray(data) ? data : []);
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Error ${response.status}: ${response.statusText}` };
        }
        
        const errorMessage = errorData.error || errorData.details || `Error ${response.status}: ${response.statusText}`;
        setError(errorMessage);
        console.error('[ProgramasProyectosSection] Error response:', response.status, errorData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar programas';
      setError(errorMessage);
      console.error('[ProgramasProyectosSection] Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Duplicar programas para crear efecto de carrusel infinito
  const programasDuplicados = [...programs, ...programs, ...programs];

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

          {/* Carrusel */}
          {isLoading ? (
            <div className="text-center py-12 text-[#1D194C]/60">
              <p>Cargando programas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p className="font-semibold mb-2">Error al cargar programas</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchPrograms}
                className="mt-4 px-4 py-2 bg-[#E68956] text-white rounded-full hover:bg-[#D67A45] transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : programasDuplicados.length > 0 ? (
            <div
              ref={containerRef}
              className="flex gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {programasDuplicados.map((programa, index) => (
                <ProyectoCard
                  key={`${programa._id}-${index}`}
                  programa={programa}
                  className="snap-center shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] flex flex-col"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#1D194C]/60">
              <p>No hay programas disponibles</p>
            </div>
          )}
        </div>

        {/* Botón + para admin (debajo del carrusel) */}
        {session?.user?.isAdmin && (
          <div className="flex justify-center mt-8">
            <AddProgramButton onClick={() => router.push('/admin/programas')} />
          </div>
        )}
      </Container>
    </section>
  );
}
