import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { CustomerRepository } from "./repository";
import { CreateCustomerSchema, UpdateCustomerSchema } from "./schema";
import { ValidatedCreateCustomer, ValidatedUpdateCustomer, CustomerSearchParams } from "./types";
import { AppError } from "@/utils/errors";

export class CustomerService {
  private repository: CustomerRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new CustomerRepository(supabase);
  }

  async getCustomers(params: CustomerSearchParams) {
    try {
      return await this.repository.getCustomers(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCustomer(id: string) {
    try {
      const customer = await this.repository.getCustomerById(id);
      if (!customer) {
        throw new AppError("Customer not found", "NOT_FOUND", 404);
      }
      return customer;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCustomer(data: ValidatedCreateCustomer) {
    try {
      const validatedData = CreateCustomerSchema.parse(data);
      return await this.repository.createCustomer(validatedData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateCustomer(id: string, data: ValidatedUpdateCustomer) {
    try {
      const validatedData = UpdateCustomerSchema.parse(data);
      return await this.repository.updateCustomer(id, validatedData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteCustomer(id: string) {
    try {
      await this.repository.softDeleteCustomer(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof AppError) return error;
    if (error.name === "ZodError") {
      return new AppError("Validation failed", "VALIDATION_ERROR", 400, { errors: error.errors });
    }
    return new AppError("An unexpected error occurred in CustomerService", "INTERNAL_ERROR", 500, error);
  }
}
