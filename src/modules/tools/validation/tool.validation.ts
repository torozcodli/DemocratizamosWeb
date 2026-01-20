import { z } from 'zod';

export const createToolSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(200, 'La descripción no puede exceder 200 caracteres'),
  content: z.string().min(20, 'El contenido debe tener al menos 20 caracteres'),
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
