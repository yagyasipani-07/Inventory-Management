import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { ChallanRepository } from "./repository";
import { CreateChallanSchema } from "./schema";
import { ValidatedCreateChallan, ChallanSearchParams } from "./types";
import { AppError } from "@/utils/errors";

export class ChallanService {
  private repository: ChallanRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new ChallanRepository(supabase);
  }

  async getChallans(params: ChallanSearchParams) {
    try {
      return await this.repository.getChallans(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getChallan(id: string) {
    try {
      const challan = await this.repository.getChallanById(id);
      if (!challan) {
        throw new AppError("Challan not found", "NOT_FOUND", 404);
      }
      return challan;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDraftChallan(data: ValidatedCreateChallan, userId?: string) {
    try {
      const validatedData = CreateChallanSchema.parse(data);
      return await this.repository.createDraftChallan(validatedData, userId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof AppError) return error;
    if (error.name === "ZodError") {
      return new AppError("Validation failed", "VALIDATION_ERROR", 400, { errors: error.errors });
    }
    return new AppError("An unexpected error occurred in ChallanService", "INTERNAL_ERROR", 500, error);
  }
}
