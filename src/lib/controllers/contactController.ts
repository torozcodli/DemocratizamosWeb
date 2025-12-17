import { contactEmailSchema, type ContactEmailInput } from '@/lib/validation/contact.schemas';
import { errorResponse, successResponse } from '@/lib/api/responses';
import type { StandardResponse } from '@/types/standardResponse';

// Stub para futuro backend
export async function submitContactEmail(
  input: ContactEmailInput
): Promise<StandardResponse> {
  // Validar
  const validation = contactEmailSchema.safeParse(input);
  if (!validation.success) {
    return errorResponse(
      'Datos inválidos',
      validation.error.issues[0]?.message
    );
  }

  // TODO: Implementar llamada a API/backend
  // Por ahora retornamos éxito simulado
  return successResponse('Gracias, te contactaremos en breve.');
}

