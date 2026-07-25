import { z } from "zod";

export const WarehouseSchema = z.object({
  id: z.string().uuid(),
  warehouse_name: z.string().min(1, "Warehouse name is required"),
  code: z.string().min(1, "Warehouse code is required"),
  address: z.string().nullable(),
  active_status: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export const CreateWarehouseSchema = WarehouseSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial();

export const StockMovementSchema = z.object({
  id: z.string().uuid(),
  warehouse_id: z.string().uuid(),
  product_id: z.string().uuid(),
  previous_quantity: z.number(),
  quantity_change: z.number(),
  new_quantity: z.number(),
  movement_type: z.enum(["Opening Stock", "Dispatch", "Adjustment", "Return", "Import", "Manual Update"]),
  reference_id: z.string().uuid().nullable(),
  remarks: z.string().nullable(),
  created_at: z.string(),
});
