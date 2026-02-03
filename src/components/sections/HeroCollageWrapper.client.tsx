'use client';

import React, { useState, useEffect } from 'react';

/**
 * Wrapper que en iPad horizontal (1024–1366px landscape, touch) aplica
 * transform para mover el collage a la derecha. Excluye iPhone (más angosto)
 * y desktop (any-pointer: fine). Incluye 1180x820, 1366x1024, etc.
 */
export function HeroCollageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [pushRight, setPushRight] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (max-width: 1370px) and (orientation: landscape) and (any-pointer: coarse)'
    );
    const handler = () => setPushRight(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <div
      className={[className, pushRight && 'ipad-h-landscape'].filter(Boolean).join(' ')}
      style={
        pushRight
          ? {
              transform: 'translateX(3cm) translateY(calc(5px + 0.4cm + 2.35cm)) scale(0.84)',
              transformOrigin: 'center center',
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
