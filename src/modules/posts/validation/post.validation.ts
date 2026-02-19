import { z } from 'zod';
import { localizedStringSchema, localizedArraySchema } from '@/lib/validation/localized';

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

export const createPostSchema = z.object({
  title: z.union([localizedStringSchema, z.string().trim().min(3)]).transform((v) =>
    typeof v === 'string' ? { es: v, en: undefined } : v
  ),
  imageUrl: z
    .string()
    .min(1, 'La URL de la imagen es requerida')
    .refine(
      (val) => {
        return val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/');
      },
      { message: 'Debe ser una URL válida o una ruta de imagen' }
    ),
  readTime: z.string().min(1, 'El tiempo de lectura es requerido'),
  authorName: z.string().optional(),
  excerpt: z.union([localizedStringSchema, z.string().trim()]).optional().transform((v) => {
    if (v == null) return undefined;
    return typeof v === 'string' ? { es: v, en: undefined } : v;
  }),
  content: contentLocalizedOrLegacy,
  status: z.enum(['published', 'draft']).default('published'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

/**
 * Genera un excerpt del primer párrafo del contenido
 */
export function generateExcerpt(content: string[]): string {
  if (!content || content.length === 0) {
    return '';
  }
  
  const firstParagraph = content[0].trim();
  const maxLength = 220;
  
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  
  // Truncar en el último espacio antes del límite
  const truncated = firstParagraph.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
