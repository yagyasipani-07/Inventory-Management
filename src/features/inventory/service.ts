import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { InventoryRepository } from "./repository";
import { CreateProductSchema, UpdateProductSchema } from "./schema";
import { ValidatedCreateProduct, ValidatedUpdateProduct, ProductSearchParams } from "./types";
import { AppError } from "@/utils/errors";

export class InventoryService {
  private repository: InventoryRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new InventoryRepository(supabase);
  }

  async getProducts(params: ProductSearchParams) {
    try {
      return await this.repository.getProducts(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProduct(id: string) {
    try {
      const product = await this.repository.getProductById(id);
      if (!product) {
        throw new AppError("Product not found", "NOT_FOUND", 404);
      }
      return product;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createProduct(data: ValidatedCreateProduct) {
    try {
      const validatedData = CreateProductSchema.parse(data);
      return await this.repository.createProduct(validatedData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProduct(id: string, data: ValidatedUpdateProduct) {
    try {
      const validatedData = UpdateProductSchema.parse(data);
      return await this.repository.updateProduct(id, validatedData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteProduct(id: string) {
    try {
      await this.repository.softDeleteProduct(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductStocks(productIds: string[]) {
    try {
      return await this.repository.getProductStocks(productIds);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductMovements(productId: string) {
    try {
      return await this.repository.getProductMovements(productId);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async adjustStock(
    productId: string,
    type: "increase" | "decrease",
    amount: number,
    reason: string,
    purchaseBillNumber?: string
  ) {
    try {
      await this.repository.adjustStock(productId, type, amount, reason, purchaseBillNumber);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateReorderLevel(productId: string, reorderLevel: number) {
    try {
      await this.repository.updateReorderLevel(productId, reorderLevel);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof AppError) return error;
    if (error.name === "ZodError") {
      return new AppError("Validation failed", "VALIDATION_ERROR", 400, { errors: error.errors });
    }
    return new AppError("An unexpected error occurred in InventoryService", "INTERNAL_ERROR", 500, error);
  }
}
