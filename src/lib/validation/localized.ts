import { z } from 'zod';

/** es requerido; .trim() de Zod evita guardar espacios/HTML vacío. */
const esString = z.string().trim().min(1, 'El campo en español es requerido');
const enString = z.string().optional().transform((s) => (s != null && s.trim() !== '' ? s.trim() : undefined));

export const localizedStringSchema = z
  .object({
    es: esString,
    en: enString,
  })
  .transform((v) => ({ es: v.es, en: v.en ?? undefined }));

/** Elementos del array se trimean con .trim(); vacíos se filtran. Tras filtrar exige al menos un elemento. */
const trimmedNonEmptyArray = z
  .array(z.string().trim())
  .transform((arr) => arr.filter((s) => s.length > 0))
  .refine((arr) => arr.length >= 1, 'Al menos un elemento en español');

export const localizedArraySchema = z
  .object({
    es: trimmedNonEmptyArray,
    en: z.array(z.string().trim()).optional().transform((arr) => {
    const filtered = arr?.filter((s) => s.length > 0);
    return filtered && filtered.length > 0 ? filtered : undefined;
  }),
  })
  .transform((v) => ({ es: v.es, en: v.en ?? undefined }));

export type LocalizedStringInput = z.infer<typeof localizedStringSchema>;
export type LocalizedArrayInput = z.infer<typeof localizedArraySchema>;
