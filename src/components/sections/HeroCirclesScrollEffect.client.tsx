'use client';

import { useEffect, useRef } from 'react';
import { getGsap, refreshScrollTrigger } from '@/lib/gsap/gsapClient';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

/**
 * On /inicio: when Section 2 (#inicio-sec2) enters view, hero circles [data-hero-circle]
 * scale up; reverse when scrolling back. Runs after DOM/layout ready.
 */
export function HeroCirclesScrollEffect() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ctxRef = useRef<{ revert: () => void } | null>(null);
  const unmountedRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

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

        ctxRef.current?.revert();
        ctxRef.current = gsap.context(() => {
          gsap.to(circles, {
            scale: 1.12,
            duration: 0.6,
            ease: 'power2.out',
            transformOrigin: '50% 50%',
            scrollTrigger: {
              trigger: sec2,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 0.8,
              toggleActions: 'play none none reverse',
            },
          });
        });

        refreshScrollTrigger();
      };

      // Run after paint and retry so circles (HeroIllustration) are in the DOM
      const schedule = () => {
        if (unmountedRef.current) return;
        run();
        const t = setTimeout(() => {
          if (!unmountedRef.current) {
            refreshScrollTrigger();
            run();
          }
          timeoutsRef.current = timeoutsRef.current.filter((x) => x !== t);
        }, 400);
        timeoutsRef.current.push(t);
      };

      requestAnimationFrame(() => {
        requestAnimationFrame(schedule);
      });
    });

    return () => {
      unmountedRef.current = true;
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [prefersReducedMotion]);

  return null;
}
