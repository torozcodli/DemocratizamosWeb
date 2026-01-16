import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
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
  content: z
    .union([
      z.array(z.string()).min(1, 'Debe haber al menos un párrafo'),
      z.string().min(1, 'El contenido es requerido'),
    ])
    .transform((val) => {
      // Normalizar a array de strings
      if (typeof val === 'string') {
        // Separar por dobles saltos de línea
        return val.split('\n\n').filter((p) => p.trim().length > 0);
      }
      return val;
    }),
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
