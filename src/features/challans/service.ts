import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { ChallanRepository } from "./repository";
import { CreateChallanSchema } from "./schema";
import { ValidatedCreateChallan, ValidatedUpdateChallan, ChallanSearchParams } from "./types";
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
      return await this.repository.getChallanById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createDraftChallan(data: unknown) {
    try {
      const validated = CreateChallanSchema.parse(data) as ValidatedCreateChallan;
      return await this.repository.createDraftChallan(validated);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteChallan(id: string) {
    try {
      await this.repository.softDeleteChallan(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChallanStatus(id: string, status: string, dispatchDate?: string | null) {
    try {
      return await this.repository.updateChallanStatus(id, status, dispatchDate);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChallanDispatchInfo(
    id: string,
    data: {
      dispatch_date?: string | null;
      notes?: string | null;
      status?: string;
      transport?: string;
      transport_name?: string;
      vehicle_number?: string;
      warehouse_id?: string;
    }
  ) {
    try {
      return await this.repository.updateChallanDispatchInfo(id, data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateChallan(id: string, data: ValidatedUpdateChallan) {
    try {
      return await this.repository.updateChallan(id, data);
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
