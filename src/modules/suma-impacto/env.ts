import 'server-only';

import { z } from 'zod';

const KNOWN_API_KEY_PLACEHOLDERS = [
  'replace-with-secure-32-plus-char-key',
  'change-me',
  'your-api-key',
  'dev_demoinn_api_key_123',
];

function optionalIntEnvVar(opts: { name: string; defaultValue: number; min: number; max: number }) {
  return z.preprocess(
    (raw) => {
      if (raw === undefined || raw === null || (typeof raw === 'string' && raw.trim() === '')) {
        return opts.defaultValue;
      }
      const n = parseInt(String(raw), 10);
      return Number.isNaN(n) ? raw : n;
    },
    z
      .number()
      .int()
      .min(opts.min, `${opts.name} must be >= ${opts.min}`)
      .max(opts.max, `${opts.name} must be <= ${opts.max}`)
  );
}

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
    .min(32, 'SUMA_IMPACTO_EXPERIENCES_API_KEY must be at least 32 characters')
    .refine(
      (s) => !KNOWN_API_KEY_PLACEHOLDERS.includes(s.toLowerCase().trim()),
      'SUMA_IMPACTO_EXPERIENCES_API_KEY must not be a placeholder value'
    ),
  SUMA_IMPACTO_DEMOINN_ORG_ID: z
    .string()
    .regex(
      /^[a-f0-9]{24}$/i,
      'SUMA_IMPACTO_DEMOINN_ORG_ID must be a valid 24-character hex MongoDB ObjectId'
    ),
  SUMA_IMPACTO_EXPERIENCES_SOURCE: z.preprocess((val) => {
    if (val === undefined || val === null) return 'demoinn';
    if (typeof val !== 'string') return 'demoinn';
    const t = val.trim();
    return t.length > 0 ? t : 'demoinn';
  }, z.string().min(1)),
  SUMA_IMPACTO_API_TIMEOUT_MS: optionalIntEnvVar({
    name: 'SUMA_IMPACTO_API_TIMEOUT_MS',
    defaultValue: 8000,
    min: 1000,
    max: 30000,
  }),
  SUMA_IMPACTO_API_CACHE_TTL_SECONDS: optionalIntEnvVar({
    name: 'SUMA_IMPACTO_API_CACHE_TTL_SECONDS',
    defaultValue: 1800,
    min: 60,
    max: 3600,
  }),
});

export type SumaImpactoServerEnv = {
  baseUrl: string;
  experiencesApiKey: string;
  orgId: string;
  source: string;
  timeoutMs: number;
  cacheTtlSeconds: number;
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
    SUMA_IMPACTO_API_TIMEOUT_MS: process.env.SUMA_IMPACTO_API_TIMEOUT_MS,
    SUMA_IMPACTO_API_CACHE_TTL_SECONDS: process.env.SUMA_IMPACTO_API_CACHE_TTL_SECONDS,
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
    timeoutMs: r.SUMA_IMPACTO_API_TIMEOUT_MS,
    cacheTtlSeconds: r.SUMA_IMPACTO_API_CACHE_TTL_SECONDS,
  };
  return cached;
}
