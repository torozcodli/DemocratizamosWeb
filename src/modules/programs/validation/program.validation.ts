import { z } from 'zod';

const ProgramInfoSchema = z.object({
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  location: z.string().min(1, 'La ubicación es requerida'),
  instructor: z.string().min(1, 'El instructor es requerido'),
  duration: z.string().min(1, 'La duración es requerida'),
  level: z.string().min(1, 'El nivel es requerido'),
  includes: z.string().min(1, 'El campo "incluye" es requerido'),
});

export const createProgramSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  shortDescription: z.string().min(1, 'La descripción corta es requerida'),
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
