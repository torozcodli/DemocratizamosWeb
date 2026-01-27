'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { homeContent } from '@/content/home';
import { getGsap } from '@/lib/gsap/gsapClient';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

const ICON_BY_TITLE: Record<string, string> = {
  'Educación y alfabetización digital': '/solar/icons/Eductaion.svg',
  'Colaboración y ecosistema': '/solar/icons/Collaboration.svg',
  'Inclusión digital y acceso equitativo': '/solar/icons/Inclusion.svg',
  'Empleabilidad y emprendimiento': '/solar/icons/Employability.svg',
  'Equidad y participación': '/solar/icons/Equity.svg',
  'Innovación con propósito social': '/solar/icons/Innovation.svg',
};

function normalizeId(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

type CardItemProps = {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  isOpen: boolean;
  onToggle: () => void;
  prefersReducedMotion: boolean;
};

function SolarCardItem({
  id,
  title,
  description,
  iconSrc,
  isOpen,
  onToggle,
  prefersReducedMotion,
}: CardItemProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const panel = panelRef.current;
    const chevron = chevronRef.current;
    const root = rootRef.current;
    if (!panel || !chevron) return;

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
  }, [isOpen, prefersReducedMotion]);

  return (
    <div
      ref={rootRef}
      data-solar-card
      className="rounded-xl overflow-hidden border border-[#9DACFD]/40 bg-white/95 shadow-sm"
    >
      <button
        type="button"
        id={`btn-${id}`}
        onClick={() => onToggle()}
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        className="w-full flex items-center gap-3 px-4 py-4 text-left bg-[#0E0D2B] hover:bg-[#12113A] transition-colors"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1E1A49] flex items-center justify-center">
          <Image
            src={iconSrc}
            alt=""
            aria-hidden
            width={24}
            height={24}
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="flex-1 text-[#E7ECFF] font-semibold text-base md:text-lg">
          {title}
        </span>
        <span
          ref={chevronRef}
          data-solar-chevron
          className="flex-shrink-0 inline-flex cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          role="img"
          aria-hidden
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#F0B07C]"
            aria-hidden
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`btn-${id}`}
        data-solar-panel
        ref={panelRef}
        className="overflow-hidden will-change-[height,opacity]"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="px-4 py-4 bg-[#E7ECFF]/30 text-[#1E1A49] text-sm md:text-base leading-relaxed">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export function SolarSystemCards() {
  const [openId, setOpenId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const cards = homeContent.values.map((v) => ({
    id: normalizeId(v.title),
    title: v.title,
    description: v.description,
    iconSrc: ICON_BY_TITLE[v.title] ?? '/solar/icons/Inclusion.svg',
  }));

  return (
    <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
      {cards.map((card) => (
        <SolarCardItem
          key={card.id}
          id={card.id}
          title={card.title}
          description={card.description}
          iconSrc={card.iconSrc}
          isOpen={openId === card.id}
          onToggle={() => toggle(card.id)}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}
