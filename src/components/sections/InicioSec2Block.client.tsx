'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type GsapContextRevert = () => void;

/**
 * Columna derecha de la sección 2 en /inicio: heading, logo y línea.
 * Efecto de scroll: logo se revela al bajar, línea se dibuja hacia la izquierda;
 * ambos al máximo cuando ya estás en la sección.
 */
export function InicioSec2Block() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<{ revert: GsapContextRevert } | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [mounted, setMounted] = useState(false);

  // Ocultar logo y línea hasta que el efecto esté montado (evita flash en SSR/hidratación)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !mounted) return;

    const logo = logoRef.current;
    const line = lineRef.current;
    const root =
      document.getElementById('inicio-sec2') ?? containerRef.current?.closest('section');
    if (!root || !logo || !line) return;

    const run = () => {
      const triggerEl = containerRef.current ?? root;
      if (!logo || !line || !root.isConnected || !triggerEl) return;

      // Quitar clase que oculta el logo; solo GSAP controla visibilidad
      logo.classList.remove('inicio-sec2-logo-init');

      // Estado inicial: logo invisible y pequeño; línea en 0
      gsap.set(logo, {
        opacity: 0,
        visibility: 'hidden',
        y: 40,
        scale: 0.75,
        transformOrigin: '50% 50%',
      });
      gsap.set(line, {
        scaleX: 0,
        transformOrigin: '100% 50%',
      });

      ctxRef.current = gsap.context(
        () => {
          // Trigger en el bloque (logo+línea): animación cuando bajas y el bloque entra en pantalla
          // start: cuando el borde superior del bloque llega al 75% del viewport (hay que bajar más)
          // end: cuando llega al 20% — así el recorrido es claro y se ve todo
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerEl,
              start: 'top 75%',
              end: 'top 20%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          tl.fromTo(
            logo,
            {
              opacity: 0,
              visibility: 'hidden',
              y: 40,
              scale: 0.75,
              transformOrigin: '50% 50%',
            },
            {
              opacity: 1,
              visibility: 'visible',
              y: 0,
              scale: 1,
              ease: 'power2.out',
              duration: 1,
            },
            0
          );
          tl.fromTo(
            line,
            { scaleX: 0, transformOrigin: '100% 50%' },
            { scaleX: 1, ease: 'power2.out', duration: 1 },
            0.1
          );
          ScrollTrigger.refresh();
          timeoutsRef.current.push(setTimeout(() => ScrollTrigger.refresh(), 400));
          timeoutsRef.current.push(setTimeout(() => ScrollTrigger.refresh(), 1000));
        },
        root
      );
    };

    // Ejecutar tras layout/hidratación para que ScrollTrigger mida bien
    const t1 = setTimeout(run, 250);
    timeoutsRef.current.push(t1);

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.length = 0;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
  }, [prefersReducedMotion, mounted]);

  return (
    <div
      ref={containerRef}
      className="order-2 md:order-2 space-y-8 relative overflow-visible"
    >
      <h2 className="text-center md:text-center xl:text-right text-[44px] md:text-[48px] lg:text-[56px] xl:text-[72px] font-bold leading-[1.1] tracking-[-0.02em]">
        <span className="text-[#E7ECFF]">Creemos en el </span>
        <span className="tech-word text-[#B9C0FF]">poder</span>
        <span className="text-[#E7ECFF]"> de la </span>
        <span className="tech-word text-[#F0B07C]">tecnología</span>
        <span className="text-[#E7ECFF]"> para todos.</span>
      </h2>

      <div className="relative flex justify-center md:justify-center xl:justify-end items-center -mt-12 overflow-visible">
        <div className="relative h-36 w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 z-10 about-logo-container">
          <div
            ref={logoRef}
            data-sec2-logo
            className="absolute inset-0 flex items-center justify-center will-change-transform inicio-sec2-logo-init"
          >
            <Image
              src="/solar/icons/Demoinnlogo.svg"
              alt="Demoinn Logo"
              width={176}
              height={176}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="relative hidden xl:block -mt-18">
        <div
          className="absolute right-0 h-[2px] top-1/2 -translate-y-1/2 w-[70%] max-w-[500px]"
          style={{ right: '-13rem' }}
        >
          <svg
            className="absolute -top-[10px] left-0 flex-shrink-0 z-10"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="11" cy="11" r="10.25" stroke="#9DACFD" strokeWidth="1.5" strokeMiterlimit="10" />
            <circle cx="11" cy="11" r="3.5" fill="#C7D2FF" />
          </svg>
          <div
            ref={lineRef}
            data-sec2-line
            className="absolute left-[22px] right-0 top-0 h-[2px] bg-[#9DACFD] will-change-transform"
            style={{ transformOrigin: '100% 50%' }}
          />
        </div>
      </div>
    </div>
  );
}
