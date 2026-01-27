'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

interface StatCardProps {
  value: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  size?: 'small' | 'normal' | 'large';
  /** Si es true, el número anima de 0 al valor al entrar en vista al hacer scroll */
  animateOnScroll?: boolean;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function StatCard({
  value,
  label,
  imageSrc,
  imageAlt,
  size = 'normal',
  animateOnScroll = false,
}: StatCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayNum, setDisplayNum] = useState<number | null>(null);
  const hasAnimated = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const prefix = value.startsWith('+') ? '+' : value.startsWith('-') ? '-' : '';
  const targetNum = parseInt(value.replace(/\D/g, ''), 10) || 0;
  const displayValue =
    !animateOnScroll
      ? value
      : displayNum === null
        ? prefix + '0'
        : prefix + String(displayNum);

  useEffect(() => {
    if (!animateOnScroll || targetNum === 0 || prefersReducedMotion) {
      if (animateOnScroll && targetNum > 0 && prefersReducedMotion) {
        setDisplayNum(targetNum);
      }
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const duration = 1800;
        const startTime = performance.now();

        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuart(progress);
          const current = Math.floor(eased * targetNum);
          setDisplayNum(current);
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            setDisplayNum(targetNum);
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateOnScroll, targetNum, prefersReducedMotion]);

  const imageMinHeight =
    size === 'large'
      ? 'min-h-[400px] sm:min-h-[450px]'
      : size === 'small'
        ? 'min-h-[300px] sm:min-h-[350px]'
        : 'min-h-[350px] sm:min-h-[400px]';

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-[36px] shadow-lg bg-white w-full max-w-[450px] mx-auto flex flex-col"
    >
      {/* Top Section: Navy Block */}
      <div
        className="px-8 pt-10 pb-8 flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #0D0E2F 0%, #25214F 100%)',
        }}
      >
        <div className="text-6xl sm:text-7xl lg:text-8xl font-tech text-white leading-none tracking-tight">
          {displayValue}
        </div>
        <div className="mt-6 text-xl sm:text-2xl font-inter font-light text-white/90">
          {label}
        </div>
      </div>

      {/* Bottom Section: Image with Overlay */}
      <div className={`relative flex-1 ${imageMinHeight}`}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.08) 15%, transparent 30%)',
          }}
        />
      </div>
    </div>
  );
}
