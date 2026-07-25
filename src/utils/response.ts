import { AppError } from "./errors";

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
    timestamp: string;
  };
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export const createSuccessResponse = <T>(
  data: T,
  message?: string,
  pagination?: SuccessResponse<T>["pagination"]
): SuccessResponse<T> => {
  return {
    success: true,
    data,
    message,
    ...(pagination && { pagination }),
  };
};

export const createErrorResponse = (error: unknown): ErrorResponse => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Handle standard errors or unknown errors
  const message = error instanceof Error ? error.message : "An unexpected error occurred";
  return {
    success: false,
    error: {
      message,
      code: "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
    },
  };
};
