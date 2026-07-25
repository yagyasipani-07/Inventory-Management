import { Database } from "@/types/database.types";
import { z } from "zod";
import { ProductSchema, CreateProductSchema, UpdateProductSchema } from "./schema";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type InsertProduct = Database["public"]["Tables"]["products"]["Insert"];
export type UpdateProduct = Database["public"]["Tables"]["products"]["Update"];

export type ValidatedProduct = z.infer<typeof ProductSchema>;
export type ValidatedCreateProduct = z.infer<typeof CreateProductSchema>;
export type ValidatedUpdateProduct = z.infer<typeof UpdateProductSchema>;

export interface ProductSearchParams {
  search?: string;
  category?: string;
  brand?: string;
  active_status?: boolean;
  page?: number;
  limit?: number;
}
