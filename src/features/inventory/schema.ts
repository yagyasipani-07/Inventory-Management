import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string().uuid(),
  product_code: z.string().min(1, "Product code is required"),
  product_name: z.string().min(1, "Product name is required"),
  category: z.string().nullable(),
  thickness: z.number().nullable(),
  length: z.number().nullable(),
  width: z.number().nullable(),
  unit: z.string().nullable(),
  brand: z.string().nullable(),
  description: z.string().nullable(),
  product_image_path: z.string().nullable(),
  active_status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const UpdateProductSchema = CreateProductSchema.partial();
