export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
