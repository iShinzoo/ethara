import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface ApiErrorResponse {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    const details = error.response?.data?.details;

    return new ApiError(status, message, details);
  }

  if (error instanceof Error) {
    return new ApiError(500, error.message);
  }

  return new ApiError(500, 'An unexpected error occurred');
};

export const showErrorToast = (error: unknown) => {
  const apiError = handleApiError(error);
  
  if (apiError.status === 401) {
    toast.error('Session expired. Please login again.');
  } else if (apiError.status === 403) {
    toast.error('You do not have permission to perform this action.');
  } else if (apiError.status === 404) {
    toast.error('Resource not found.');
  } else if (apiError.status >= 500) {
    toast.error('Server error. Please try again later.');
  } else {
    toast.error(apiError.message);
  }
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};
