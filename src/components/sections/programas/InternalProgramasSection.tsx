'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { AddProgramButton } from '@/components/programas/AddProgramButton';

export type InternalProgramItem = {
  slug: string;
  title: string;
  shortDescription?: string | null;
  imageUrl?: string | null;
  externalWebsiteUrl?: string | null;
  status?: 'published' | 'draft' | null;
  info?: {
    date?: string | null;
    time?: string | null;
    location?: string | null;
    level?: string | null;
    duration?: string | null;
    instructor?: string | null;
  } | null;
};

type InternalProgramasSectionProps = {
  items: InternalProgramItem[];
  locale: string;
  isAdmin?: boolean;
};

function ProgramCard({
  item,
  ctaLabel,
  externalCtaLabel,
  statusOpenLabel,
  statusClosedLabel,
  className = '',
}: {
  item: InternalProgramItem;
  ctaLabel: string;
  externalCtaLabel: string;
  statusOpenLabel: string;
  statusClosedLabel: string;
  className?: string;
}) {
  const hasImage = !!item.imageUrl;
  const hasExternalLink = Boolean(item.externalWebsiteUrl?.trim());
  const infoLine = [item.info?.location, item.info?.level].filter(Boolean).join(' | ') || null;
  const isOpen = item.status === 'published';

  const ctaClassName =
    'w-fit inline-block rounded-full px-6 py-3 bg-[#E68956] text-white font-semibold hover:bg-[#D67A45] transition-colors';

  return (
    <div className={`flex h-full min-w-0 flex-col ${className}`}>
      <div className="shrink-0 rounded-3xl overflow-hidden border-2 border-[#7B87FF] shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <div className="h-12 bg-[#3B3B7A] flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
          </div>
          <div className="h-2 w-3/5 rounded-full bg-white/15 ml-auto" />
        </div>

        <div className="relative aspect-video w-full bg-gradient-to-br from-slate-200 to-slate-300">
          {hasImage ? (
            <Image
              src={item.imageUrl!}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 25vw"
              unoptimized={
                item.imageUrl!.startsWith('http://') ||
                item.imageUrl!.startsWith('https://') ||
                item.imageUrl!.startsWith('/')
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">{item.title}</p>
              </div>
            </div>
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#E68956]/35 via-transparent to-transparent pointer-events-none"
            aria-hidden
          />
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-3">
        <div className="shrink-0 flex items-start justify-between gap-2 min-h-[6.5rem]">
          <h3 className="text-[#1D194C] font-tech font-extrabold text-2xl leading-tight line-clamp-4 flex-1">
            {item.title}
          </h3>
          {item.status != null && (
            <span
              className={`flex-shrink-0 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isOpen
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isOpen ? statusOpenLabel : statusClosedLabel}
            </span>
          )}
        </div>

        {infoLine ? (
          <p className="min-h-[1.5rem] shrink-0 text-sm font-semibold text-[#1D194C]/60">
            {infoLine}
          </p>
        ) : (
          <div className="min-h-[1.5rem] shrink-0" />
        )}

        {item.shortDescription ? (
          <p className="min-h-[4.75rem] flex-1 text-[#1D194C]/70 leading-relaxed text-base line-clamp-3">
            {item.shortDescription}
          </p>
        ) : (
          <div className="min-h-[4.75rem] flex-1" />
        )}

        <div className="mt-auto shrink-0 pt-2">
          {hasExternalLink ? (
            <a
              href={item.externalWebsiteUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaClassName}
              aria-label={`${externalCtaLabel}: ${item.title}`}
            >
              {externalCtaLabel}
            </a>
          ) : (
            <Link
              href={`/programas/${item.slug}`}
              className={ctaClassName}
              aria-label={`${ctaLabel}: ${item.title}`}
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function InternalProgramasSection({ items, locale: _locale, isAdmin = false }: InternalProgramasSectionProps) {
  const t = useTranslations('programas.internos');
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const firstCard = container.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth;
    const gap = 32;
    container.scrollBy({ left: direction === 'left' ? -(cardWidth + gap) : cardWidth + gap, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white py-18 sm:py-20 lg:py-24 overflow-x-clip">
      <Container>
        <div className="flex items-center justify-center gap-4 mb-4 lg:mb-6">
          <h2 className="text-center text-4xl sm:text-5xl lg:text-6xl font-tech font-extrabold tracking-tight text-[#1D194C]">
            {t('title')}
          </h2>
          {isAdmin && (
            <AddProgramButton
              onClick={() => router.push('/admin/programas')}
              className="flex-shrink-0"
            />
          )}
        </div>
        <p className="text-center text-[#1D194C]/60 mb-12 lg:mb-16 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        {items.length === 0 ? (
          <p className="text-center py-12 text-[#1D194C]/60">{t('empty')}</p>
        ) : (
          <div className="relative px-12 sm:px-16 lg:px-20">
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-[#1D194C]/40 bg-transparent grid place-items-center hover:bg-[#E7E9FF] transition-colors"
              aria-label={t('previous')}
            >
              <ChevronLeft className="w-6 h-6 text-[#1D194C]" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full border border-[#1D194C]/40 bg-transparent grid place-items-center hover:bg-[#E7E9FF] transition-colors"
              aria-label={t('next')}
            >
              <ChevronRight className="w-6 h-6 text-[#1D194C]" />
            </button>

            <div
              ref={containerRef}
              className="flex items-stretch gap-8 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide min-h-[520px]"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {items.map((item) => (
                <ProgramCard
                  key={item.slug}
                  item={item}
                  ctaLabel={t('cta')}
                  externalCtaLabel={t('externalCta')}
                  statusOpenLabel={t('statusOpen')}
                  statusClosedLabel={t('statusClosed')}
                  className="program-internal-card snap-center shrink-0 w-[280px] sm:w-[320px] lg:w-[calc(25%-24px)] h-full min-h-[520px]"
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
