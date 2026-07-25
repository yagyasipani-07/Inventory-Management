export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string, statusCode: number, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "A database error occurred", details?: any) {
    super(message, "DATABASE_ERROR", 500, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, "AUTHENTICATION_ERROR", 401);
  }
}

export class PermissionError extends AppError {
  constructor(message: string = "You do not have permission to perform this action") {
    super(message, "PERMISSION_ERROR", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class StorageError extends AppError {
  constructor(message: string = "Storage operation failed", details?: any) {
    super(message, "STORAGE_ERROR", 500, details);
  }
}
