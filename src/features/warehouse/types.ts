import { Database } from "@/types/database.types";
import { z } from "zod";
import { WarehouseSchema, CreateWarehouseSchema, UpdateWarehouseSchema, StockMovementSchema } from "./schema";

export type Warehouse = Database["public"]["Tables"]["warehouses"]["Row"];
export type InsertWarehouse = Database["public"]["Tables"]["warehouses"]["Insert"];
export type UpdateWarehouse = Database["public"]["Tables"]["warehouses"]["Update"];

export type WarehouseStock = Database["public"]["Tables"]["warehouse_stock"]["Row"];
export type StockMovement = Database["public"]["Tables"]["stock_movements"]["Row"];

export type ValidatedWarehouse = z.infer<typeof WarehouseSchema>;
export type ValidatedCreateWarehouse = z.infer<typeof CreateWarehouseSchema>;
export type ValidatedUpdateWarehouse = z.infer<typeof UpdateWarehouseSchema>;

export interface StockSearchParams {
  warehouse_id?: string;
  product_id?: string;
  page?: number;
  limit?: number;
}
