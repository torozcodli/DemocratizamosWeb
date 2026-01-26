'use client';

import posthog from 'posthog-js';

/**
 * Check if PostHog is initialized and ready
 */
function isPostHogReady(): boolean {
  if (typeof window === 'undefined' || !posthog) {
    return false;
  }
  
  // Verificar si PostHog está inicializado
  // Usamos múltiples indicadores para mayor robustez
  return (
    (posthog as any).__loaded === true ||
    typeof (posthog as any).has_opted_in_capturing !== 'undefined' ||
    typeof posthog.capture === 'function'
  );
}

/**
 * Track a custom event in PostHog
 * @param event - Event name
 * @param properties - Optional event properties
 */
export function track(event: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') {
    return;
  }

  // Solo trackear si PostHog está inicializado
  if (!isPostHogReady()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Analytics] PostHog not initialized. Event "${event}" not tracked.`);
    }
    return;
  }

  try {
    posthog.capture(event, properties);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Analytics] Error tracking event "${event}":`, error);
    }
  }
}

/**
 * Identify a user in PostHog
 * @param userId - User identifier
 * @param properties - Optional user properties
 */
export function identify(userId: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!isPostHogReady()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[Analytics] PostHog not initialized. User "${userId}" not identified.`);
    }
    return;
  }

  try {
    posthog.identify(userId, properties);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Analytics] Error identifying user "${userId}":`, error);
    }
  }
}
