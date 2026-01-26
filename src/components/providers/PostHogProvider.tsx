'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Solo inicializar si las env vars están presentes
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!posthogKey || !posthogHost) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[PostHog] Missing environment variables. Analytics disabled.');
      }
      return;
    }

    // Inicializar PostHog solo si no está ya inicializado
    if (typeof window !== 'undefined') {
      // Verificar si ya está inicializado
      const isAlreadyLoaded = (posthog as any).__loaded;
      
      if (!isAlreadyLoaded) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          autocapture: false, // Deshabilitado - manejamos eventos manualmente
          capture_pageview: false, // Deshabilitado - manejamos pageviews manualmente
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[PostHog] Initialized successfully');
            }
          },
        });
      }
    }
  }, []);

  return (
    <>
      <PostHogPageView />
      {children}
    </>
  );
}

// Componente interno para capturar pageviews
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Solo capturar si PostHog está disponible e inicializado
    if (typeof window === 'undefined' || !posthog) {
      return;
    }

    // Verificar que PostHog esté inicializado
    const isReady = (posthog as any).__loaded;
    if (!isReady) {
      return;
    }

    // Construir URL completa
    const url = window.location.origin + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    // Capturar pageview manualmente
    posthog.capture('$pageview', {
      $current_url: url,
    });
  }, [pathname, searchParams]);

  return null;
}
