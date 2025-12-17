import type { StandardResponse } from '@/types/standardResponse';

export function successResponse<T>(
  message: string,
  data?: T
): StandardResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string, error?: string): StandardResponse {
  return {
    success: false,
    message,
    error,
  };
}

