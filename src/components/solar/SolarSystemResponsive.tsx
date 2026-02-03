'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SolarSystemArt, BASE_W, BASE_H } from './SolarSystemArt';

const MIN_SCALE = 0.58;
const MAX_SCALE = 1.12;

export function SolarSystemResponsive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const { width: w, height: h } = el.getBoundingClientRect();
      if (w <= 0 || h <= 0) return;
      const rawScale = Math.min(w / BASE_W, h / BASE_H);
      const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, rawScale));
      setScale(clamped);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [BASE_W, BASE_H]);

  return (
    <div
      ref={containerRef}
      className="relative w-full grid place-items-center overflow-hidden py-10 md:py-12 lg:py-14 min-h-[740px] md:min-h-[900px] lg:min-h-[1000px] 2xl:min-h-[1120px]"
    >
      <div
        className="solar-scaled-wrapper absolute left-1/2 top-1/2 pointer-events-auto"
        style={{
          width: BASE_W,
          height: BASE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center',
          willChange: 'transform',
        }}
      >
        <SolarSystemArt />
      </div>
    </div>
  );
}
