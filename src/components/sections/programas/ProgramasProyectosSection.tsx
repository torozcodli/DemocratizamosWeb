'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import type { Session } from 'next-auth';
import { Container } from '@/components/ui/Container';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { AddProgramButton } from '@/components/programas/AddProgramButton';
import { resolveProgramMoreInfoDestination } from '@/modules/programs/helpers/program-more-info';

interface Programa {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
  externalWebsiteUrl?: string;
  order?: number;
}

function ProyectoCard({
  programa,
  className = '',
  verMasLabel,
  descriptionMinHeight,
}: {
  programa: Programa;
  className?: string;
  verMasLabel: string;
  descriptionMinHeight: number;
}) {
  const moreInfoDestination = resolveProgramMoreInfoDestination(programa);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(programa.imageUrl);
  const [hasTriedFallback, setHasTriedFallback] = useState(false);

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
    <div className={`grid h-full min-w-0 grid-rows-[auto_1fr_auto] ${className}`}>
      <div className="rounded-3xl overflow-hidden border-2 border-[#7B87FF] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="h-12 bg-[#3B3B7A] flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/70"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/70"></div>
          </div>
          <div className="h-2 w-3/5 rounded-full bg-white/15 ml-auto"></div>
        </div>

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
          <div className="absolute inset-0 bg-gradient-to-t from-[#E68956]/35 via-transparent to-transparent pointer-events-none" aria-hidden />
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-col gap-4">
        <h3 className="text-[#1D194C] font-tech font-extrabold text-2xl leading-tight shrink-0">
          {programa.title}
        </h3>
        <p
          data-program-description
          className="text-[#1D194C]/70 leading-relaxed text-base"
          style={{ minHeight: descriptionMinHeight > 0 ? `${descriptionMinHeight}px` : undefined }}
        >
          {programa.shortDescription}
        </p>
      </div>

      <div className="flex items-end pt-2">
        <Link
          href={moreInfoDestination.href}
          prefetch={moreInfoDestination.isExternal ? undefined : false}
          target={moreInfoDestination.isExternal ? '_blank' : undefined}
          rel={moreInfoDestination.isExternal ? 'noopener noreferrer' : undefined}
          className="w-fit inline-block rounded-full px-6 py-3 bg-[#E68956] text-white font-semibold hover:bg-[#D67A45] transition-colors"
          aria-label={`${verMasLabel}: ${programa.title}`}
        >
          {verMasLabel}
        </Link>
      </div>
    </div>
  );
}

interface ProgramasProyectosSectionProps {
  session?: Session | null;
}

export function ProgramasProyectosSection({ session }: ProgramasProyectosSectionProps) {
  const t = useTranslations('programas.proyectos');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [programs, setPrograms] = useState<Programa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [descriptionMinHeight, setDescriptionMinHeight] = useState(0);

  useEffect(() => {
    fetchPrograms();
  }, [locale]);

  const fetchPrograms = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(`/api/programas?locale=${locale}`, {
        cache: 'no-store',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          // Regla visual del carrusel:
          // nuevos a la izquierda, viejos a la derecha.
          const sorted = [...data].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
          setPrograms(sorted);
        } else {
          setPrograms([]);
        }
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
      const errorMessage = error instanceof Error ? error.message : t('errorTitle');
      setError(errorMessage);
      console.error('[ProgramasProyectosSection] Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Evitar duplicados visuales cuando hay pocos programas.
  const programasRender = programs.length > 3 ? [...programs, ...programs, ...programs] : programs;

  useEffect(() => {
    const recalculateDescriptionHeight = () => {
      if (!containerRef.current) return;
      const descriptions = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>('[data-program-description]')
      );
      if (descriptions.length === 0) {
        setDescriptionMinHeight(0);
        return;
      }
      const maxHeight = Math.max(...descriptions.map((node) => node.scrollHeight));
      setDescriptionMinHeight(maxHeight);
    };

    const frame = requestAnimationFrame(recalculateDescriptionHeight);
    window.addEventListener('resize', recalculateDescriptionHeight);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', recalculateDescriptionHeight);
    };
  }, [programasRender.length, locale, isLoading, error]);

  useEffect(() => {
    if (!containerRef.current || isLoading || programasRender.length === 0) return;

    const container = containerRef.current;
    const hasDuplicatedTrack = programs.length > 3;

    const frame = requestAnimationFrame(() => {
      const cards = Array.from(container.querySelectorAll<HTMLElement>('.program-card'));
      if (cards.length === 0) return;

      if (hasDuplicatedTrack) {
        // Track triplicado: centrar una card ancla del bloque central.
        const middleBlockAnchorIndex = Math.min(
          programs.length + Math.floor(programs.length / 2),
          cards.length - 1
        );
        const anchor = cards[middleBlockAnchorIndex];
        if (anchor) {
          const desired =
            anchor.offsetLeft - container.offsetLeft - (container.clientWidth - anchor.clientWidth) / 2;
          const max = Math.max(0, container.scrollWidth - container.clientWidth);
          container.scrollLeft = Math.min(Math.max(0, desired), max);
        }
      } else {
        // Con pocos elementos: centrar visualmente el grupo/card ancla.
        const anchor = cards[Math.floor(cards.length / 2)];
        if (anchor) {
          const desired =
            anchor.offsetLeft - container.offsetLeft - (container.clientWidth - anchor.clientWidth) / 2;
          const max = Math.max(0, container.scrollWidth - container.clientWidth);
          container.scrollLeft = Math.min(Math.max(0, desired), max);
        }
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isLoading, programasRender.length, programs.length]);

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
          {t('sectionTitle')}
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
              <p>{t('loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p className="font-semibold mb-2">{t('errorTitle')}</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchPrograms}
                className="mt-4 px-4 py-2 bg-[#E68956] text-white rounded-full hover:bg-[#D67A45] transition-colors"
              >
                {t('retry')}
              </button>
            </div>
          ) : programasRender.length > 0 ? (
            <div
              ref={containerRef}
              className="flex items-stretch gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide min-h-[520px]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {programasRender.map((programa, index) => (
                <ProyectoCard
                  key={`${programa._id}-${index}`}
                  programa={programa}
                  verMasLabel={t('verMas')}
                  descriptionMinHeight={descriptionMinHeight}
                  className="program-card snap-center shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] h-full min-h-[520px]"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#1D194C]/60">
              <p>{t('empty')}</p>
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
