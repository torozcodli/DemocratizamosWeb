'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type GsapContextRevert = () => void;

/**
 * Dentro de About cuando sectionId === 'inicio-sec2'. Al hacer scroll:
 * - Logo: aparece con fade + y/scale (scrub).
 * - Línea: se revela de derecha a izquierda (scaleX 0→1).
 */
export function InicioSec2ScrollEffect() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ctxRef = useRef<{ revert: GsapContextRevert } | null>(null);
  const unmountedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    unmountedRef.current = false;

    const run = (): boolean => {
      if (unmountedRef.current || ctxRef.current) return true;
      const root = document.getElementById('inicio-sec2');
      const logo = root?.querySelector<HTMLElement>('[data-sec2-logo]');
      const line = root?.querySelector<HTMLElement>('[data-sec2-line]');
      if (!root || !logo || !line) return false;

      gsap.set(logo, {
        autoAlpha: 0,
        y: 14,
        scale: 0.92,
        transformOrigin: '50% 50%',
      });
      gsap.set(line, {
        scaleX: 0,
        transformOrigin: '100% 50%',
      });

      ctxRef.current = gsap.context(
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root,
                start: 'top bottom',
                end: 'top 45%',
                scrub: true,
              },
            })
            .to(logo, { autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out', duration: 1 }, 0)
            .to(line, { scaleX: 1, ease: 'none', duration: 1 }, 0.15);
        },
        root
      );

      ScrollTrigger.refresh();
      return true;
    };

    const schedule = () => {
      if (unmountedRef.current) return;
      if (run()) return;
      timeoutRef.current = setTimeout(schedule, 350);
    };
    timeoutRef.current = setTimeout(schedule, 150);

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
