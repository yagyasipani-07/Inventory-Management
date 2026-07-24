export const environmentConfig = {
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isProduction: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  isStaging: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;
