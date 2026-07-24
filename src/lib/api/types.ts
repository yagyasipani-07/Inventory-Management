export interface RequestConfig extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}
