'use client';

import { useEffect, useRef } from 'react';
import { getGsap, refreshScrollTrigger } from '@/lib/gsap/gsapClient';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

/**
 * Runs on /inicio only. When Section 2 (#inicio-sec2) enters view (top 80%),
 * the two hero circles [data-hero-circle] scale up slightly; reverse on scroll back.
 * No-op if prefers-reduced-motion or if circles/sec2 are missing.
 */
export function HeroCirclesScrollEffect() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const unmountedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    unmountedRef.current = false;

    getGsap().then((gsap) => {
      if (unmountedRef.current) return;

      const run = () => {
        if (unmountedRef.current) return;
        const circles = document.querySelectorAll<HTMLElement>('[data-hero-circle]');
        const sec2 = document.querySelector<HTMLElement>('#inicio-sec2');
        if (!circles.length || !sec2) return;

        ctxRef.current = gsap.context(() => {
          gsap.to(circles, {
            scale: 1.12,
            duration: 0.6,
            ease: 'power2.out',
            transformOrigin: '50% 50%',
            scrollTrigger: {
              trigger: sec2,
              start: 'top bottom',
              toggleActions: 'play none none reverse',
            },
          });
        });

        refreshScrollTrigger();
      };

      requestAnimationFrame(() => {
        if (unmountedRef.current) return;
        run();
        timeoutRef.current = setTimeout(() => {
          if (!unmountedRef.current) refreshScrollTrigger();
          timeoutRef.current = null;
        }, 300);
      });
    });

    return () => {
      unmountedRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [prefersReducedMotion]);

  return null;
}
