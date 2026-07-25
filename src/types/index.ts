/**
 * This file will eventually export the auto-generated Supabase Database types.
 * For now, we provide a placeholder type to satisfy the TS compiler in our lib/supabase setup.
 * 
 * Command to generate types (once DB is running):
 * supabase gen types typescript --local > src/types/database.types.ts
 */

export interface Database {
  public: {
    Tables: {
      [key: string]: any; // Placeholder
    };
    Views: {
      [key: string]: any;
    };
    Functions: {
      [key: string]: any;
    };
    Enums: {
      [key: string]: any;
    };
  };
}

// Global utility types can also be exported here
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
