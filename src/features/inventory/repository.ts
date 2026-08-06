import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Product, InsertProduct, UpdateProduct, ProductSearchParams } from "./types";
import { escapeSupabaseLike } from "@/src/lib/utils";
import { DatabaseError } from "@/utils/errors";

export class InventoryRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getProducts(params: ProductSearchParams): Promise<{ data: Product[]; count: number }> {
    if (params.purchase_bill_number) {
      const { data: moveData } = await this.supabase
        .from("stock_movements")
        .select("product_id")
        .eq("purchase_bill_number", params.purchase_bill_number);
        
      if (!moveData || moveData.length === 0) {
        return { data: [], count: 0 };
      }
      
      const productIds = Array.from(new Set(moveData.map((m: any) => m.product_id)));
      let query = this.supabase
        .from("products")
        .select("*", { count: "exact" })
        .in("id", productIds)
        .is("deleted_at", null);

      if (params.active_status !== undefined) query = query.eq("active_status", params.active_status);

      const page = params.page || 1;
      const limit = params.limit || 50;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      query = query.range(from, to).order("created_at", { ascending: false });

      const { data, error, count } = await query;
      if (error) throw new DatabaseError("Failed to fetch products", error);
      return { data: data || [], count: count || 0 };
    }

    let query = this.supabase
      .from("products")
      .select("*", { count: "exact" })
      .is("deleted_at", null);

    if (params.search) {
      const escapedSearch = escapeSupabaseLike(params.search);
      let orQuery = `product_code.ilike.${escapedSearch},product_name.ilike.${escapedSearch}`;
      const num = Number(params.search);
      if (!isNaN(num) && params.search.trim() !== '') {
        orQuery += `,thickness.eq.${num},length.eq.${num},width.eq.${num}`;
      }
      query = query.or(orQuery);
    }
    if (params.category) query = query.eq("category", params.category);
    if (params.brand) query = query.eq("brand", params.brand);
    if (params.active_status !== undefined) query = query.eq("active_status", params.active_status);

    const page = params.page || 1;
    const limit = params.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new DatabaseError("Failed to fetch products", error);

    return { data: data || [], count: count || 0 };
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError("Failed to fetch product", error);
    }

    return data;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .insert([product] as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create product", error);

    return data;
  }

  async updateProduct(id: string, updates: UpdateProduct): Promise<Product> {
    const { data, error } = await this.supabase
      .from("products")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update product", error);

    return data;
  }

  async softDeleteProduct(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .update({ deleted_at: new Date().toISOString(), active_status: false } as never)
      .eq("id", id);

    if (error) throw new DatabaseError("Failed to delete product", error);

    // Clean up orphaned warehouse_stock rows for the deleted product
    await this.supabase
      .from("warehouse_stock")
      .delete()
      .eq("product_id", id);
  }

  async getProductStocks(productIds: string[]): Promise<Record<string, { current: number; reserved: number; min: number }>> {
    if (!productIds.length) return {};
    const { data, error } = await this.supabase
      .from("warehouse_stock")
      .select("product_id, current_quantity, reserved_quantity, reorder_level")
      .in("product_id", productIds);

    if (error) throw new DatabaseError("Failed to fetch stock summary", error);

    const stocks: Record<string, { current: number; reserved: number; min: number }> = {};
    (data || []).forEach((row: any) => {
      if (!stocks[row.product_id]) {
        stocks[row.product_id] = { current: 0, reserved: 0, min: 100 };
      }
      stocks[row.product_id].current += row.current_quantity || 0;
      stocks[row.product_id].reserved += row.reserved_quantity || 0;
      if (row.reorder_level) {
        stocks[row.product_id].min = row.reorder_level;
      }
    });

    return stocks;
  }

  async getProductMovements(productId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from("stock_movements")
      .select("id, quantity_change, movement_type, reference_id, purchase_bill_number, created_at, remarks")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to fetch product movements", error);
      return [];
    }
    return data || [];
  }

  async adjustStock(
    productId: string,
    type: "increase" | "decrease",
    amount: number,
    reason: string,
    purchaseBillNumber?: string
  ): Promise<void> {
    const { data: whs }: any = await this.supabase.from("warehouses").select("id").eq("active_status", true).limit(1);
    const targetWhId = whs && whs[0]?.id ? whs[0].id : "e52b1b11-5374-4b52-a5e3-1b93f1d9396e";

    const { data: stockRow }: any = await this.supabase
      .from("warehouse_stock")
      .select("*")
      .eq("warehouse_id", targetWhId)
      .eq("product_id", productId)
      .single();

    const currentQty = stockRow?.current_quantity || 0;
    const change = type === "increase" ? amount : -amount;
    const newQty = currentQty + change;

    if (newQty < 0) {
      throw new DatabaseError("Cannot decrease stock below 0.");
    }

    if (stockRow) {
      await this.supabase
        .from("warehouse_stock")
        .update({ current_quantity: newQty, updated_at: new Date().toISOString() } as never)
        .eq("id", stockRow.id);
    } else {
      await this.supabase
        .from("warehouse_stock")
        .insert([
          {
            warehouse_id: targetWhId,
            product_id: productId,
            current_quantity: newQty,
            reserved_quantity: 0,
            reorder_level: 10,
          },
        ] as any);
    }

    await this.supabase
      .from("stock_movements")
      .insert([
        {
          warehouse_id: targetWhId,
          product_id: productId,
          previous_quantity: currentQty,
          quantity_change: change,
          new_quantity: newQty,
          movement_type: "Adjustment",
          remarks: reason,
          purchase_bill_number: purchaseBillNumber || null,
        },
      ] as any);
  }

  async updateReorderLevel(productId: string, reorderLevel: number): Promise<void> {
    const { data: whs }: any = await this.supabase.from("warehouses").select("id").eq("active_status", true).limit(1);
    const targetWhId = whs && whs[0]?.id ? whs[0].id : "e52b1b11-5374-4b52-a5e3-1b93f1d9396e";

    const { data: stockRow }: any = await this.supabase
      .from("warehouse_stock")
      .select("id")
      .eq("warehouse_id", targetWhId)
      .eq("product_id", productId)
      .single();

    if (stockRow) {
      await this.supabase
        .from("warehouse_stock")
        .update({ reorder_level: reorderLevel, updated_at: new Date().toISOString() } as never)
        .eq("id", stockRow.id);
    } else {
      await this.supabase
        .from("warehouse_stock")
        .insert([
          {
            warehouse_id: targetWhId,
            product_id: productId,
            current_quantity: 0,
            reserved_quantity: 0,
            reorder_level: reorderLevel,
          },
        ] as any);
    }
  }
}
