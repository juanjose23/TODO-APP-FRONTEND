import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    interface ErrorResponse {
      errors?: Record<string, string[]>;
      message?: string;
      error?: string;
    }
    
    const data = axiosError.response?.data as ErrorResponse | undefined;
    
    if (data) {
      if (data.errors) {
        const firstErrorKey = Object.keys(data.errors)[0];
        if (firstErrorKey && data.errors[firstErrorKey].length > 0) {
          return data.errors[firstErrorKey][0];
        }
      }
      if (data.message) {
        return data.message;
      }
      if (data.error) {
         return data.error;
      }
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}

function isAxiosError(error: unknown): error is AxiosError {
  return !!error && typeof error === 'object' && (('isAxiosError' in error) || ('response' in error));
}
