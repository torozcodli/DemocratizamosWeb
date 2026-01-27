'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';
import { getGsap } from '@/lib/gsap/gsapClient';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

const latestItems = [
  {
    title: 'Capacitación en Ciberseguridad',
    description:
      'Taller intensivo para fortalecer las habilidades digitales seguras en sectores vulnerables. Se abordaron prácticas básicas de protección de datos y navegación responsable.',
    image: '/images/CapacitacionCiber.jpg',
  },
  {
    title: 'Feria de Tecnología Social',
    description:
      'Una jornada para compartir herramientas tecnológicas aplicadas a problemas comunitarios. Participaron jóvenes de zonas rurales con proyectos innovadores en accesibilidad digital.',
    image: '/images/Feriade.jpg',
  },
  {
    title: 'Taller de Innovación Digital',
    description:
      'Una iniciativa para impulsar habilidades tecnológicas, creatividad e inclusión digital entre jóvenes y emprendedores. Este taller forma parte del programa de profesionalización para comunidades vulnerables.',
    image: '/images/TallerdeInnovacion.jpeg',
  },
];

export function LatestSection() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (reduced) {
      const overlays = root.querySelectorAll('[data-orange-overlay]');
      overlays.forEach((el) => {
        const e = el as HTMLElement;
        e.style.transformOrigin = 'bottom';
        e.style.transform = 'scaleY(1)';
        e.style.opacity = '1';
      });
      return;
    }

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    getGsap().then((gsap) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        // (1) Overlays por card
        const cards = gsap.utils.toArray<HTMLElement>('[data-lmn-card]', root);
        cards.forEach((card) => {
          const overlay = card.querySelector<HTMLElement>('[data-orange-overlay]');
          if (!overlay) return;
          gsap.set(overlay, { transformOrigin: '50% 100%', scaleY: 0 });
          gsap.to(overlay, {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 45%',
              scrub: true,
            },
          });
        });

        // (2) Parallax círculos fondo
        const circles = gsap.utils.toArray<HTMLElement>('[data-parallax-circle]', root);
        circles.forEach((el) => {
          const speed = parseFloat(el.getAttribute('data-speed') ?? '0.3');
          const distance = -140 * speed;
          gsap.to(el, {
            y: distance,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      }, root);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <section
      id="inicio-lomasnuevo"
      data-lomasnuevo-section
      ref={ref}
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden"
    >
      {/* Capa base: Color lavanda/púrpura claro */}
      <div className="absolute inset-0 z-0 bg-[#B5BBEF]" />

      {/* Wrapper para decoraciones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Círculo 1: bottom-left (grande, parcialmente cortado) - más morado */}
        <div
          data-parallax-circle
          data-speed="0.2"
          className="absolute bottom-0 left-0 z-[1] opacity-60 will-change-transform"
          style={{ filter: 'blur(1px)' }}
        >
          <svg
            width="1000"
            height="1000"
            viewBox="0 0 464 464"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[300px] sm:w-[400px] md:w-[600px] lg:w-[800px] lg:w-[1000px] -translate-x-1/3 translate-y-1/3"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_circle1_latest)">
              <path
                opacity="0.6"
                d="M231.995 463.98C360.117 463.98 463.98 360.116 463.98 231.995C463.98 103.873 360.117 0.00973511 231.995 0.00973511C103.873 0.00973511 0.00976562 103.873 0.00976562 231.995C0.00976562 360.116 103.873 463.98 231.995 463.98Z"
                fill="#8B7DFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_circle1_latest">
                <rect width="464" height="464" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Círculo 2: right, más arriba (pequeño) - más morado */}
        <div
          data-parallax-circle
          data-speed="0.35"
          className="absolute right-[5%] top-[10%] z-[1] opacity-55 will-change-transform"
          style={{ filter: 'blur(1px)' }}
        >
          <svg
            width="500"
            height="500"
            viewBox="0 0 464 464"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[150px] sm:w-[200px] md:w-[280px] lg:w-[350px] lg:w-[450px] translate-x-1/4"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_circle2_latest)">
              <path
                opacity="0.6"
                d="M231.995 463.98C360.117 463.98 463.98 360.116 463.98 231.995C463.98 103.873 360.117 0.00973511 231.995 0.00973511C103.873 0.00973511 0.00976562 103.873 0.00976562 231.995C0.00976562 360.116 103.873 463.98 231.995 463.98Z"
                fill="#8B7DFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_circle2_latest">
                <rect width="464" height="464" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Cuadritos naranjas 1: izquierda */}
        <div className="absolute left-[17%] top-0 z-[2] opacity-90 pointer-events-none">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={80}
            height={80}
            className="w-16 md:w-20 lg:w-24"
            aria-hidden="true"
          />
        </div>

        {/* Cuadritos naranjas 2: centro arriba (entre cards) */}
        <div className="absolute left-[32%] top-[50%] z-[2] opacity-90 pointer-events-none">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={80}
            height={80}
            className="w-16 md:w-20 lg:w-24"
            aria-hidden="true"
          />
        </div>

        {/* Cuadritos naranjas 3: derecha */}
        <div className="absolute right-[15%] top-[21%] z-[2] opacity-90 pointer-events-none">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={80}
            height={80}
            className="w-16 md:w-20 lg:w-24"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Contenido */}
      <Container className="relative z-10">
        {/* Título */}
        <h2 className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] mb-16 md:mb-20">
          <span
            className="text-[#1E1A49] font-black tracking-tight font-tech-alt"
            style={{ fontWeight: 900, WebkitTextStroke: '1px #1E1A49', letterSpacing: '-0.02em' }}
          >
            Lo más nuevo.
          </span>
        </h2>

        {/* Cards - 2 arriba + 1 abajo en tablet */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-14 lg:gap-20 max-w-[88rem] mx-auto px-4 sm:px-0">
          {latestItems.map((item, index) => (
            <div
              key={index}
              data-lmn-card
              className={cn(
                "rounded-[42px] overflow-hidden shadow-lg bg-white flex flex-col",
                index === 2 && "md:col-span-2 md:max-w-[600px] md:mx-auto xl:col-span-1 xl:max-w-none"
              )}
            >
              {/* Parte superior: Imagen con overlay */}
              <div className="relative h-[175px] lg:h-[195px] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 400px"
                />
                {/* Overlay degradado navy (debajo) */}
                <div
                  className="absolute inset-0 z-[1] rounded-t-[42px] pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(30, 26, 73, 0.1) 30%, rgba(30, 26, 73, 0.6) 100%)',
                  }}
                />
                {/* Overlay naranja: encima del navy, se revela con scroll (GSAP scaleY) */}
                <div
                  data-orange-overlay
                  className="pointer-events-none absolute inset-0 z-[2] origin-bottom will-change-transform scale-y-0 rounded-t-[42px]"
                  style={{
                    background: 'linear-gradient(to top, rgba(251,146,60,0.75) 0%, rgba(251,146,60,0.4) 35%, rgba(251,146,60,0.12) 65%, transparent 100%)',
                  }}
                />
              </div>

              {/* Parte inferior: Panel navy */}
              <div className="bg-[#1E1A49] px-8 sm:px-10 py-6 sm:py-8 flex-1 flex flex-col">
                {/* Título */}
                <h3 className="text-[28px] sm:text-[32px] text-white text-center font-avenir font-bold" style={{ fontWeight: 700 }}>{item.title}</h3>

                {/* Línea divisora */}
                <div className="mx-auto mt-4 h-[2px] w-16 bg-white/70 rounded-full" />

                {/* Descripción */}
                <p className="mt-6 text-lg leading-relaxed text-white/80 text-left font-avenir" style={{ fontWeight: 400 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

