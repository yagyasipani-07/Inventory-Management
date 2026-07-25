import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Setting, UpdateSetting } from "./types";
import { DatabaseError } from "@/utils/errors";

export class SettingsRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAllSettings(): Promise<Setting[]> {
    const { data, error } = await this.supabase
      .from("settings")
      .select("*")
      .order("key", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch settings", error);
    return data || [];
  }

  async getSettingByKey(key: string): Promise<Setting | null> {
    const { data, error } = await this.supabase
      .from("settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError("Failed to fetch setting", error);
    }
    return data;
  }

  async updateSetting(key: string, updates: UpdateSetting): Promise<Setting> {
    const { data, error } = await this.supabase
      .from("settings")
      .update(updates as never)
      .eq("key", key)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update setting", error);
    return data;
  }
}
