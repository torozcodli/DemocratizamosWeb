import { z } from 'zod';
import { localizedStringSchema, localizedArraySchema } from '@/lib/validation/localized';

const ProgramInfoSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  instructor: z.string().min(1, 'El instructor es requerido'),
  duration: z.string().min(1, 'La duración es requerida'),
  level: z.string().min(1, 'El nivel es requerido'),
  includes: z.string().min(1, 'El campo "incluye" es requerido'),
});

/** Content (array): trim por elemento; vacíos filtrados. Compat legacy string/array. */
const contentLocalizedOrLegacy = z
  .union([
    localizedArraySchema,
    z.array(z.string().trim().refine((s) => s.length > 0)).min(1),
    z.string().trim().min(1).transform((s) => ({ es: s.split('\n\n').map((p) => p.trim()).filter((p) => p.length > 0) })),
  ])
  .transform((v): { es: string[]; en?: string[] } => {
    if (typeof v === 'object' && v !== null && 'es' in v) return v as { es: string[]; en?: string[] };
    const arr = Array.isArray(v) ? v : [String(v)];
    return { es: arr.map((s) => String(s).trim()).filter((s) => s.length > 0) };
  });

export const createProgramSchema = z.object({
  title: z.union([localizedStringSchema, z.string().trim().min(3)]).transform((v) =>
    typeof v === 'string' ? { es: v, en: undefined } : v
  ),
  shortDescription: z.union([localizedStringSchema, z.string().trim().min(1)]).transform((v) =>
    typeof v === 'string' ? { es: v, en: undefined } : v
  ),
  content: contentLocalizedOrLegacy,
  imageUrl: z
    .string()
    .min(1, 'La URL de la imagen es requerida')
    .refine(
      (val) => {
        // Permitir URLs completas (http/https) o rutas relativas que empiecen con /
        return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/');
      },
      { message: 'Debe ser una URL válida o una ruta de imagen' }
    ),
  info: ProgramInfoSchema,
  order: z.number().int().positive().optional(),
  status: z.enum(['published', 'draft']).default('published'),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
