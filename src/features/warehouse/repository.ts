import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Warehouse, WarehouseStock, StockSearchParams, InsertWarehouse, UpdateWarehouse } from "./types";
import { DatabaseError } from "@/utils/errors";

export class WarehouseRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getWarehouses(): Promise<Warehouse[]> {
    const { data, error } = await this.supabase
      .from("warehouses")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) throw new DatabaseError("Failed to fetch warehouses", error);
    return data || [];
  }

  async getWarehouseStock(params: StockSearchParams): Promise<{ data: any[]; count: number }> {
    let query = this.supabase
      .from("warehouse_stock")
      .select("*, products!inner(*), warehouses(*)", { count: "exact" })
      .is("products.deleted_at", null);

    if (params.warehouse_id) query = query.eq("warehouse_id", params.warehouse_id);
    if (params.product_id) query = query.eq("product_id", params.product_id);

    const page = params.page || 1;
    const limit = params.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("updated_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new DatabaseError("Failed to fetch stock", error);
    return { data: data || [], count: count || 0 };
  }

  async getStockByProductAndWarehouse(productId: string, warehouseId: string): Promise<WarehouseStock | null> {
    const { data, error } = await this.supabase
      .from("warehouse_stock")
      .select("*")
      .eq("product_id", productId)
      .eq("warehouse_id", warehouseId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError("Failed to fetch stock details", error);
    }
    return data;
  }
}
