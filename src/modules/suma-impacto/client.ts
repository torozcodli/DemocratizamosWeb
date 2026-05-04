import 'server-only';

import { getSumaImpactoEnv } from './env';
import type { SumaImpactoLiteExperience, SumaImpactoLiteResponse } from './types';

const FALLBACK: SumaImpactoLiteResponse = {
  success: false,
  total: 0,
  data: [],
};

const REVALIDATE_SECONDS = 1800;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeBody(body: unknown): SumaImpactoLiteResponse {
  if (!isRecord(body)) {
    return { ...FALLBACK };
  }

  const success = body.success === true;
  const totalRaw = body.total;
  const total =
    typeof totalRaw === 'number' && Number.isFinite(totalRaw) ? Math.max(0, Math.floor(totalRaw)) : 0;
  const rawData = body.data;

  if (!Array.isArray(rawData)) {
    return { ...FALLBACK };
  }

  if (!success) {
    return { ...FALLBACK };
  }

  const data = rawData.filter(isRecord) as SumaImpactoLiteExperience[];

  return {
    success: true,
    total,
    data,
  };
}

function logDev(message: string, meta?: Record<string, string | number>): void {
  if (process.env.NODE_ENV !== 'development') return;
  if (meta && Object.keys(meta).length > 0) {
    console.error(`[SumaImpacto] ${message}`, meta);
  } else {
    console.error(`[SumaImpacto] ${message}`);
  }
}

/**
 * Obtiene experiencias públicas lite desde Suma Impacto (solo servidor).
 * Usa ISR con revalidate 1800s. No expone la API key al cliente.
 * Errores de red/HTTP/JSON devuelven respuesta vacía controlada.
 * Si faltan envs requeridos, lanza (fallo de configuración explícito).
 */
export async function getSumaImpactoExperiences(): Promise<SumaImpactoLiteResponse> {
  const { baseUrl, experiencesApiKey, orgId, source } = getSumaImpactoEnv();

  const path = `/api/experiences/org/${encodeURIComponent(orgId)}/lite`;
  let url: URL;
  try {
    url = new URL(path, baseUrl);
  } catch {
    logDev('Invalid URL construction for experiences request');
    return { ...FALLBACK };
  }

  url.searchParams.set('api_key', experiencesApiKey);
  url.searchParams.set('source', source);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: 'application/json' },
    });
  } catch {
    logDev('Network error while fetching experiences');
    return { ...FALLBACK };
  }

  if (!response.ok) {
    logDev('Experiences request failed', { status: response.status });
    return { ...FALLBACK };
  }

  let text: string;
  try {
    text = await response.text();
  } catch {
    logDev('Failed to read response body');
    return { ...FALLBACK };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    logDev('Invalid JSON in experiences response');
    return { ...FALLBACK };
  }

  return normalizeBody(parsed);
}
