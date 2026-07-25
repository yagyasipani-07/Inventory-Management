import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { SettingsRepository } from "./repository";
import { UpdateSettingSchema } from "./schema";
import { ValidatedUpdateSetting } from "./types";
import { AppError } from "@/utils/errors";

export class SettingsService {
  private repository: SettingsRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new SettingsRepository(supabase);
  }

  async getAllSettings() {
    try {
      return await this.repository.getAllSettings();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSetting(key: string) {
    try {
      const setting = await this.repository.getSettingByKey(key);
      if (!setting) {
        throw new AppError("Setting not found", "NOT_FOUND", 404);
      }
      return setting;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateSetting(key: string, data: ValidatedUpdateSetting) {
    try {
      const validatedData = UpdateSettingSchema.parse(data);
      return await this.repository.updateSetting(key, validatedData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof AppError) return error;
    if (error.name === "ZodError") {
      return new AppError("Validation failed", "VALIDATION_ERROR", 400, { errors: error.errors });
    }
    return new AppError("An unexpected error occurred in SettingsService", "INTERNAL_ERROR", 500, error);
  }
}
