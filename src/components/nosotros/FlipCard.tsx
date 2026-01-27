'use client';

import { useState } from 'react';
import { SealBadge } from './SealBadge';

interface FlipCardProps {
  sealText: string;
  sealSrc?: string; // logo del sello: por defecto Demologo, Visión puede usar vision.svg
  frontTitle: string;
  frontText: string;
  backText: string;
}

export function FlipCard({
  sealText,
  sealSrc,
  frontTitle,
  frontText,
  backText,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full">
      {/* Sello circular */}
      <SealBadge text={sealText} src={sealSrc} />

      {/* Card wrapper con perspective */}
      <div className="perspective-[1200px] w-full h-[480px] sm:h-[520px] md:h-[560px] lg:h-[580px]">
        <div
          className="relative w-full h-full transition-transform duration-[600ms] ease-in-out [transform-style:preserve-3d]"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FRONT - Card naranja */}
          <div className="absolute inset-0 [backface-visibility:hidden] rounded-[28px] bg-[#FF8948] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-between">
            <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center">
              <h3 className="text-[clamp(22px,2.6vw,34px)] font-tech font-extrabold tracking-tight text-[#1E1A49]">
                {frontTitle}
              </h3>
              
              <div className="w-20 h-[3px] bg-white rounded-full"></div>
              
              <p className="text-white text-[clamp(14px,1.6vw,18px)] leading-relaxed max-w-[90%]">
                {frontText}
              </p>
            </div>

            <button
              onClick={() => setIsFlipped(true)}
              className="rounded-full bg-[#1E1A49] text-white px-8 py-3 text-[clamp(16px,1.8vw,20px)] font-medium hover:bg-[#27225a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F74C9] focus-visible:ring-offset-2"
              aria-expanded={isFlipped}
            >
              Conoce más
            </button>
          </div>

          {/* BACK - Card lavanda */}
          <div
            className="absolute inset-0 [backface-visibility:hidden] rounded-[28px] bg-[#CED8F4] p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            {/* Botón cerrar X */}
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FF8948] flex items-center justify-center hover:bg-[#FF9A5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F74C9] focus-visible:ring-offset-2 z-10"
              aria-label="Cerrar"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="#1E1A49"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Texto largo */}
            <p className="text-[#1E1A49] text-[clamp(14px,1.6vw,18px)] leading-relaxed text-center max-w-[90%]">
              {backText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
