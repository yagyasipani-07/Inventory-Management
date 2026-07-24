export class ApiError extends Error {
  public readonly status?: number;
  public readonly details?: any;
  public readonly code?: string;

  constructor(message: string, status?: number, details?: any, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.code = code;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0, null, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, null, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}
