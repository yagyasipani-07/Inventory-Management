export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000, // 10 seconds
  retrySettings: {
    maxRetries: 3,
    retryDelay: 1000,
  },
} as const;
