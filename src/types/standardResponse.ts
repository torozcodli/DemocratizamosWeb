export interface StandardResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

