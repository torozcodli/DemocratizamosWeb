import 'server-only';

import { getSumaImpactoEnv } from './env';
import { sumaImpactoLiteResponseSchema } from './schema';
import type { SumaImpactoLiteResponse } from './types';

const FALLBACK: SumaImpactoLiteResponse = {
  success: false,
  total: 0,
  data: [],
};

function logDev(
  level: 'warn' | 'error',
  message: string,
  meta?: Record<string, string | number>
): void {
  if (process.env.NODE_ENV !== 'development') return;
  const logger = level === 'warn' ? console.warn : console.error;
  if (meta && Object.keys(meta).length > 0) {
    logger(`[SumaImpacto] ${message}`, meta);
  } else {
    logger(`[SumaImpacto] ${message}`);
  }
}

/**
 * Obtiene experiencias públicas lite desde Suma Impacto (solo servidor).
 * Usa ISR con revalidate configurable (SUMA_IMPACTO_API_CACHE_TTL_SECONDS, default 1800s).
 * Timeout configurable (SUMA_IMPACTO_API_TIMEOUT_MS, default 8000ms).
 * No expone la API key al cliente. Errores retornan respuesta vacía controlada.
 * Si faltan envs requeridos, lanza (fallo de configuración explícito).
 * El response de Suma se valida con Zod antes de pasar al adapter (Política A).
 */
export async function getSumaImpactoExperiences(): Promise<SumaImpactoLiteResponse> {
  const { baseUrl, experiencesApiKey, orgId, source, timeoutMs, cacheTtlSeconds } =
    getSumaImpactoEnv();

  const path = `/api/experiences/org/${encodeURIComponent(orgId)}/lite`;
  let url: URL;
  try {
    url = new URL(path, baseUrl);
  } catch {
    logDev('error', 'Invalid URL construction for experiences request');
    return { ...FALLBACK };
  }

  url.searchParams.set('source', source);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: cacheTtlSeconds },
      headers: {
        Accept: 'application/json',
        'x-api-key': experiencesApiKey,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      logDev('warn', 'Suma Impacto request timed out');
    } else {
      logDev('warn', 'Network error while fetching experiences');
    }
    return { ...FALLBACK };
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    logDev('warn', 'Experiences request failed', { status: response.status });
    return { ...FALLBACK };
  }

  let text: string;
  try {
    text = await response.text();
  } catch {
    logDev('warn', 'Failed to read response body');
    return { ...FALLBACK };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    logDev('error', 'Invalid JSON in experiences response');
    return { ...FALLBACK };
  }

  const validated = sumaImpactoLiteResponseSchema.safeParse(parsed);
  if (!validated.success) {
    logDev('error', 'Suma Impacto response did not match expected schema');
    return { ...FALLBACK };
  }

  return {
    success: true,
    total: validated.data.total,
    data: validated.data.data,
  };
}
