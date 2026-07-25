import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/config";
import type { Database } from "@/types";

/**
 * Creates an admin client using the service role key.
 * This client bypasses Row Level Security (RLS).
 * MUST ONLY be used on the server side securely.
 */
export const createAdminClient = () => {
  if (!supabaseConfig.serviceRoleKey) {
    throw new Error("Service role key is not defined. Cannot create Admin Client.");
  }

  return createSupabaseClient<Database>(
    supabaseConfig.url,
    supabaseConfig.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
