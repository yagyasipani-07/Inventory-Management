import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default("Paras Plywoods ERP"),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(["development", "staging", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().startsWith("/"),
  
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  NEXT_PUBLIC_STORAGE_BUCKET: z.string().default("paras-plywoods-bucket"),
  NEXT_PUBLIC_AUTH_ENABLED: z.enum(["true", "false"]).default("false").transform((v) => v === "true"),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_AUTH_ENABLED: process.env.NEXT_PUBLIC_AUTH_ENABLED,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.format());
    if (typeof window === 'undefined') {
      throw new Error("Invalid environment variables");
    }
    return {} as z.infer<typeof envSchema>; 
  }
  return parsed.data;
};

export const env = parseEnv();
