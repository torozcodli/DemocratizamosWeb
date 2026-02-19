import { z } from 'zod';
import { localizedStringSchema } from '@/lib/validation/localized';

export const createToolSchema = z.object({
  title: z.union([localizedStringSchema, z.string().trim().min(3)]).transform((v) =>
    typeof v === 'string' ? { es: v, en: undefined } : v
  ),
  description: z
    .union([
      localizedStringSchema,
      z.string().trim().min(10).max(200),
    ])
    .transform((v) => (typeof v === 'string' ? { es: v, en: undefined } : v)),
  content: z
    .union([localizedStringSchema, z.string().trim().min(20)])
    .transform((v) => (typeof v === 'string' ? { es: v, en: undefined } : v)),
  imageUrl: z
    .string()
    .min(1, 'La URL de la imagen es requerida')
    .refine(
      (val) => {
        return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/');
      },
      { message: 'Debe ser una URL válida o una ruta de imagen' }
    ),
  date: z.coerce.date().optional(),
  isPublished: z.boolean().default(true),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;

export const updateToolSchema = createToolSchema.partial();

export type UpdateToolInput = z.infer<typeof updateToolSchema>;
