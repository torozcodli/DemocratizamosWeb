import 'server-only';

import { z } from 'zod';

const rawEnvSchema = z.object({
  SUMA_IMPACTO_BASE_URL: z
    .string()
    .min(1, 'SUMA_IMPACTO_BASE_URL is required')
    .transform((s) => s.trim().replace(/\/+$/, ''))
    .refine(
      (s) => {
        try {
          const u = new URL(s);
          return u.protocol === 'http:' || u.protocol === 'https:';
        } catch {
          return false;
        }
      },
      { message: 'SUMA_IMPACTO_BASE_URL must be a valid http(s) URL' }
    ),
  SUMA_IMPACTO_EXPERIENCES_API_KEY: z
    .string()
    .min(1, 'SUMA_IMPACTO_EXPERIENCES_API_KEY is required'),
  SUMA_IMPACTO_DEMOINN_ORG_ID: z.string().min(1, 'SUMA_IMPACTO_DEMOINN_ORG_ID is required'),
  SUMA_IMPACTO_EXPERIENCES_SOURCE: z.preprocess((val) => {
    if (val === undefined || val === null) return 'demoinn';
    if (typeof val !== 'string') return 'demoinn';
    const t = val.trim();
    return t.length > 0 ? t : 'demoinn';
  }, z.string().min(1)),
});

export type SumaImpactoServerEnv = {
  baseUrl: string;
  experiencesApiKey: string;
  orgId: string;
  source: string;
};

let cached: SumaImpactoServerEnv | null = null;

/**
 * Valida y devuelve variables de entorno para Suma Impacto (solo servidor).
 * No registrar valores secretos. Falla de forma explícita si falta configuración requerida.
 */
export function getSumaImpactoEnv(): SumaImpactoServerEnv {
  if (cached) return cached;

  const parsed = rawEnvSchema.safeParse({
    SUMA_IMPACTO_BASE_URL: process.env.SUMA_IMPACTO_BASE_URL,
    SUMA_IMPACTO_EXPERIENCES_API_KEY: process.env.SUMA_IMPACTO_EXPERIENCES_API_KEY,
    SUMA_IMPACTO_DEMOINN_ORG_ID: process.env.SUMA_IMPACTO_DEMOINN_ORG_ID,
    SUMA_IMPACTO_EXPERIENCES_SOURCE: process.env.SUMA_IMPACTO_EXPERIENCES_SOURCE,
  });

  if (!parsed.success) {
    const fields = parsed.error.issues.map((i) => i.path.join('.') || 'root').join(', ');
    throw new Error(`Invalid or missing Suma Impacto environment variables: ${fields}`);
  }

  const r = parsed.data;
  cached = {
    baseUrl: r.SUMA_IMPACTO_BASE_URL,
    experiencesApiKey: r.SUMA_IMPACTO_EXPERIENCES_API_KEY,
    orgId: r.SUMA_IMPACTO_DEMOINN_ORG_ID,
    source: r.SUMA_IMPACTO_EXPERIENCES_SOURCE,
  };
  return cached;
}
