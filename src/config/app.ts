import { env } from "./environment";

export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  environment: env.NEXT_PUBLIC_ENVIRONMENT,
  isProduction: env.NEXT_PUBLIC_ENVIRONMENT === "production",
  isDevelopment: env.NEXT_PUBLIC_ENVIRONMENT === "development",
  url: env.NEXT_PUBLIC_APP_URL,
  apiUrl: env.NEXT_PUBLIC_API_URL,
};
