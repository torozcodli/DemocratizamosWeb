'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { homeContent } from '@/content/home';
import { getGsap } from '@/lib/gsap/gsapClient';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

const SOLAR_ICONS: Record<number, string> = {
  0: '/solar/icons/Eductaion.svg',
  1: '/solar/icons/Collaboration.svg',
  2: '/solar/icons/Inclusion.svg',
  3: '/solar/icons/Employability.svg',
  4: '/solar/icons/Equity.svg',
  5: '/solar/icons/Innovation.svg',
};

type ValueItem = (typeof homeContent.values)[number];

type MobileCardItemProps = {
  id: string;
  item: ValueItem;
  iconSrc: string;
  isOpen: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean;
};

function MobileCardItem({
  id,
  item,
  iconSrc,
  isOpen,
  onToggle,
  prefersReducedMotion,
}: MobileCardItemProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const isFirstRun = useRef(true);

  const objetivo = typeof item.objetivo === 'string' ? item.objetivo : '';
  const impactoEsperado = typeof item.impactoEsperado === 'string' ? item.impactoEsperado : '';
  const hasContent = objetivo || impactoEsperado || (item.description ?? '');

  useEffect(() => {
    const panel = panelRef.current;
    const chevron = chevronRef.current;
    const root = rootRef.current;
    if (!panel || !chevron || !hasContent) return;

    if (prefersReducedMotion) {
      panel.style.height = isOpen ? 'auto' : '0px';
      panel.style.opacity = isOpen ? '1' : '0';
      panel.style.overflow = 'hidden';
      (chevron as HTMLElement).style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      return;
    }

    let mounted = true;
    getGsap().then((gsap) => {
      if (!mounted || !panel || !chevron || !root) return;
      ctxRef.current?.revert();
      ctxRef.current = null;

      const ctx = gsap.context(
        () => {
          if (isFirstRun.current) {
            gsap.set(panel, { height: isOpen ? 'auto' : 0, autoAlpha: isOpen ? 1 : 0 });
            gsap.set(chevron, { rotate: isOpen ? 180 : 0 });
            isFirstRun.current = false;
            return;
          }
          if (isOpen) {
            gsap.fromTo(
              panel,
              { height: 0, autoAlpha: 0 },
              { height: 'auto', autoAlpha: 1, duration: 0.35, ease: 'power2.out' }
            );
            gsap.to(chevron, { rotate: 180, duration: 0.25, ease: 'power2.out' });
          } else {
            gsap.to(panel, {
              height: 0,
              autoAlpha: 0,
              duration: 0.28,
              ease: 'power2.inOut',
            });
            gsap.to(chevron, { rotate: 0, duration: 0.2, ease: 'power2.out' });
          }
        },
        root
      );
      ctxRef.current = ctx;
    });
    return () => {
      mounted = false;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [isOpen, prefersReducedMotion, hasContent]);

  return (
    <div
      ref={rootRef}
      className="rounded-xl overflow-hidden border border-[#9DACFD]/40 bg-white/95 shadow-sm flex flex-col min-h-[clamp(260px,65vw,340px)]"
    >
      <button
        type="button"
        id={`solar-mobile-btn-${id}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={hasContent ? `solar-mobile-panel-${id}` : undefined}
        aria-label={`Ver objetivo e impacto: ${item.title}`}
        className="w-full flex-1 flex flex-col min-h-0 bg-[#0E0D2B] hover:bg-[#12113A] transition-colors text-left"
      >
        {/* Zona visual: SVG ocupa 60–75% del card, centrado */}
        <div className="flex-1 flex items-center justify-center min-h-0 w-full px-2 pt-4">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={iconSrc}
              alt=""
              aria-hidden
              width={280}
              height={280}
              className="h-auto w-[min(85%,280px)] max-w-full pointer-events-none select-none object-contain"
            />
          </div>
        </div>
        {/* Solo chevron abajo (los SVG ya traen el texto) */}
        <div className="flex-shrink-0 px-4 pb-4 pt-2 flex flex-col items-center">
          {hasContent ? (
            <span
              ref={chevronRef}
              className="inline-flex text-[#F0B07C]"
              aria-hidden
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          ) : null}
        </div>
      </button>
      {hasContent ? (
        <div
          id={`solar-mobile-panel-${id}`}
          role="region"
          aria-labelledby={`solar-mobile-btn-${id}`}
          ref={panelRef}
          className="overflow-hidden will-change-[height,opacity]"
          style={{ height: 0, opacity: 0 }}
        >
          <div className="px-4 py-4 bg-[#E7ECFF]/30 text-[#1E1A49] text-sm leading-relaxed space-y-3">
            {objetivo ? (
              <p>
                <span className="font-bold text-[#F0B07C]">Objetivo.</span>{' '}
                <span>{objetivo}</span>
              </p>
            ) : null}
            {impactoEsperado ? (
              <p>
                <span className="font-bold text-[#F0B07C]">Impacto esperado.</span>{' '}
                <span>{impactoEsperado}</span>
              </p>
            ) : null}
            {!objetivo && !impactoEsperado && item.description ? (
              <p>{item.description}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SolarSystemMobileList() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const toggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  // Inclusión (2) arriba como título (solo SVG, sin container); luego cards verticales
  const INCLUSION_INDEX = 2;
  const inclusionIconSrc = SOLAR_ICONS[INCLUSION_INDEX] ?? '/solar/icons/Inclusion.svg';
  const cardIndices = [0, 1, 3, 4, 5];
  const cards = cardIndices.map((index) => {
    const item = homeContent.values[index];
    return {
      id: `solar-mobile-${index}`,
      item,
      iconSrc: SOLAR_ICONS[index] ?? '/solar/icons/Inclusion.svg',
    };
  });

  return (
    <div className="w-full max-w-[420px] mx-auto px-4 flex flex-col items-center gap-6 py-6 md:py-0">
      {/* SVG de Inclusión digital: mucho más grande solo en móvil, como título de las siguientes cards */}
      <Image
        src={inclusionIconSrc}
        alt="Inclusión digital"
        width={400}
        height={400}
        className="h-auto w-[min(90vw,320px)] max-w-full pointer-events-none select-none"
      />
      {cards.map((card) => (
        <MobileCardItem
          key={card.id}
          id={card.id}
          item={card.item}
          iconSrc={card.iconSrc}
          isOpen={activeId === card.id}
          onToggle={() => toggle(card.id)}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}
