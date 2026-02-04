'use client';

import { useState, useEffect } from 'react';

/**
 * Inyecta estilos solo en iPad Pro vertical (portrait, ancho ~1024px) para que el señor
 * y el laptop del Hero sean más chicos. Rango amplio (1000–1400px) para que Safari coincida.
 */
export function HeroIpadProStyles() {
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1000px) and (max-width: 1400px) and (orientation: portrait)'
    );
    const handler = () => setMatch(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!match) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          #inicio .hero-section-container > .hero-collage-wrapper {
            transform: translate(-50%, -2rem) translateX(3cm) !important;
          }
          section#inicio .hero-collage-wrapper .hero-illustration-laptop {
            left: 0% !important;
            top: 2% !important;
            width: 88% !important;
          }
          section#inicio .hero-collage-wrapper .hero-illustration-man {
            width: 45% !important;
            max-width: 45% !important;
            right: 5% !important;
            bottom: -18% !important;
          }
          #inicio-sec2 .about-logo-container {
            transform: translateX(-5cm) !important;
          }
        `,
      }}
    />
  );
}
