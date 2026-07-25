import { Database } from "@/types/database.types";
import { z } from "zod";
import { CustomerSchema, CreateCustomerSchema, UpdateCustomerSchema } from "./schema";

export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type InsertCustomer = Database["public"]["Tables"]["customers"]["Insert"];
export type UpdateCustomer = Database["public"]["Tables"]["customers"]["Update"];

export type ValidatedCustomer = z.infer<typeof CustomerSchema>;
export type ValidatedCreateCustomer = z.infer<typeof CreateCustomerSchema>;
export type ValidatedUpdateCustomer = z.infer<typeof UpdateCustomerSchema>;

export interface CustomerSearchParams {
  search?: string;
  page?: number;
  limit?: number;
}
