import { z } from "zod";

export const ChallanItemSchema = z.object({
  id: z.string().uuid().optional(),
  product_id: z.string().uuid(),
  quantity: z.number().positive("Quantity must be greater than 0"),
});

export const ChallanSchema = z.object({
  id: z.string().uuid(),
  challan_number: z.string().min(1, "Challan number is required"),
  customer_id: z.string().uuid("Customer is required"),
  dispatch_date: z.string().nullable(),
  status: z.enum(["Draft", "Approved", "Dispatched", "Cancelled"]),
  notes: z.string().nullable(),
  created_by_id: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const CreateChallanSchema = z.object({
  customer_id: z.string().uuid("Customer is required"),
  notes: z.string().nullable().optional(),
  items: z.array(ChallanItemSchema).min(1, "At least one item is required"),
});

export const UpdateChallanSchema = CreateChallanSchema.partial().extend({
  status: z.enum(["Draft", "Approved", "Dispatched", "Cancelled"]).optional(),
  dispatch_date: z.string().nullable().optional()
});
