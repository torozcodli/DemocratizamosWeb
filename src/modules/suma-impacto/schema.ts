import 'server-only';

import { z } from 'zod';

/**
 * Schema Zod para un item lite de Suma Impacto.
 * Valida el contrato local consumido por Democratizados.
 * .passthrough() preserva campos extra que Suma agregue sin romper el schema.
 * Política A: si el shape estructural del response falla, el client devuelve fallback.
 */
export const sumaImpactoLiteItemSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    types: z.array(z.string()).optional(),
    description: z.string().optional(),
    startDate: z.string().nullable().optional(),
    endDate: z.string().nullable().optional(),
    closingDate: z.string().nullable().optional(),
    organization: z.string().optional(),
    organizationSlug: z.string().optional(),
    location: z.string().nullable().optional(),
    modality: z.string().nullable().optional(),
    imageUrl: z.string().nullable().optional(),
    redirectUrl: z.string().url().nullish(),
    tags: z.array(z.string()).default([]),
    publicUrl: z.string().url(),
    shortLinkUrl: z.string().nullable().optional(),
    cost: z.enum(['FREE', 'PAID', 'SUBSIDY']).nullable().optional(),
  })
  .passthrough();

/**
 * Schema Zod para el response completo del endpoint lite de Suma Impacto.
 * success: literal(true) — si Suma responde success: false, falla y genera fallback.
 * total: entero >= 0.
 * data: array de items validados individualmente.
 */
export const sumaImpactoLiteResponseSchema = z.object({
  success: z.literal(true),
  total: z.number().int().min(0),
  data: z.array(sumaImpactoLiteItemSchema),
});

export type SumaImpactoLiteItem = z.infer<typeof sumaImpactoLiteItemSchema>;
