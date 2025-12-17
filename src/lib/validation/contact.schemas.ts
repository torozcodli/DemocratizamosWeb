import { z } from 'zod';

export const contactEmailSchema = z.object({
  email: z.string().email('Por favor ingresa un correo electrónico válido'),
});

export type ContactEmailInput = z.infer<typeof contactEmailSchema>;

