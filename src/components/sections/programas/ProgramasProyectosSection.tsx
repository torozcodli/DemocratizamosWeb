'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import type { Session } from 'next-auth';
import { Container } from '@/components/ui/Container';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { AddProgramButton } from '@/components/programas/AddProgramButton';
import type { DemocratizamosExperienceCard } from '@/modules/suma-impacto/types';
import { formatExperienceDateTime } from '@/modules/suma-impacto/formatters';

function ProyectoCard({
  item,
  className = '',
  ctaLabel,
  descriptionMinHeight,
  locale,
}: {
  item: DemocratizamosExperienceCard;
  className?: string;
  ctaLabel: string;
  descriptionMinHeight: number;
  locale: string;
}) {
  const [imageError, setImageError] = useState(!item.imageUrl);
  const [imageSrc, setImageSrc] = useState(item.imageUrl ?? '');
  const dateLabel = formatExperienceDateTime(item.startDate, item.endDate, locale);

  useEffect(() => {
    if (item.imageUrl) {
      setImageSrc(item.imageUrl.trim());
      setImageError(false);
    } else {
      setImageSrc('');
      setImageError(true);
    }
  }, [item.imageUrl]);

  const useUnoptimizedImage =
    imageSrc.startsWith('http://') ||
    imageSrc.startsWith('https://') ||
    imageSrc.startsWith('/images/') ||
    imageSrc.startsWith('/');

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
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 25vw"
              unoptimized={useUnoptimizedImage}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{item.title}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#E68956]/35 via-transparent to-transparent pointer-events-none" aria-hidden />
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-col gap-4">
        {item.organizationName && item.organizationName !== item.title && (
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1D194C]/50 shrink-0">
            {item.organizationName}
          </p>
        )}
        <h3 className="text-[#1D194C] font-tech font-extrabold text-2xl leading-tight shrink-0">
          {item.title}
        </h3>
        {(dateLabel || item.location || item.costLabel) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {(dateLabel || item.location) && (
              <span className="text-sm font-semibold text-[#1D194C]/60">
                {[dateLabel, item.location].filter(Boolean).join(' | ')}
              </span>
            )}
            {item.costLabel && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#7B87FF]/20 text-[#1D194C]">
                {item.costLabel}
              </span>
            )}
          </div>
        )}
        <p
          data-program-description
          className="text-[#1D194C]/70 leading-relaxed text-base"
          style={{ minHeight: descriptionMinHeight > 0 ? `${descriptionMinHeight}px` : undefined }}
        >
          {item.description}
        </p>

      </div>

      <div className="flex items-end pt-2">
        <a
          href={item.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit inline-block rounded-full px-6 py-3 bg-[#E68956] text-white font-semibold hover:bg-[#D67A45] transition-colors"
          aria-label={`${ctaLabel}: ${item.title}`}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

interface ProgramasProyectosSectionProps {
  items: DemocratizamosExperienceCard[];
  session?: Session | null;
  hasError?: boolean;
}

export function ProgramasProyectosSection({ items, session, hasError = false }: ProgramasProyectosSectionProps) {
  const t = useTranslations('programas.proyectos');
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [descriptionMinHeight, setDescriptionMinHeight] = useState(0);

  // Evitar duplicados visuales cuando hay pocos items.
  const itemsRender = items.length > 3 ? [...items, ...items, ...items] : items;

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
  }, [itemsRender.length, locale]);

  useEffect(() => {
    if (!containerRef.current || itemsRender.length === 0) return;

    const container = containerRef.current;
    const hasDuplicatedTrack = items.length > 3;

    const frame = requestAnimationFrame(() => {
      const cards = Array.from(container.querySelectorAll<HTMLElement>('.program-card'));
      if (cards.length === 0) return;

      if (hasDuplicatedTrack) {
        // Track triplicado: centrar una card ancla del bloque central.
        const middleBlockAnchorIndex = Math.min(
          items.length + Math.floor(items.length / 2),
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
  }, [itemsRender.length, items.length]);

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
          {itemsRender.length > 0 ? (
            <div
              ref={containerRef}
              className="flex items-stretch gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide min-h-[520px]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {itemsRender.map((item, index) => (
                <ProyectoCard
                  key={`${item.id}-${index}`}
                  item={item}
                  ctaLabel={t('reserveNow')}
                  descriptionMinHeight={descriptionMinHeight}
                  locale={locale}
                  className="program-card snap-center shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] h-full min-h-[520px]"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#1D194C]/60">
              <p>{hasError ? t('error') : t('empty')}</p>
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
