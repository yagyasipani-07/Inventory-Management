import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { WarehouseRepository } from "./repository";
import { StockSearchParams } from "./types";
import { AppError } from "@/utils/errors";

export class WarehouseService {
  private repository: WarehouseRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new WarehouseRepository(supabase);
  }

  async getWarehouses() {
    try {
      return await this.repository.getWarehouses();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStock(params: StockSearchParams) {
    try {
      return await this.repository.getWarehouseStock(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductStock(productId: string, warehouseId: string) {
    try {
      return await this.repository.getStockByProductAndWarehouse(productId, warehouseId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof AppError) return error;
    return new AppError("An unexpected error occurred in WarehouseService", "INTERNAL_ERROR", 500, error);
  }
}
