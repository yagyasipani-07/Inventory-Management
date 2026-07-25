import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Product, InsertProduct, UpdateProduct, ProductSearchParams } from "./types";
import { DatabaseError } from "@/utils/errors";

export class InventoryRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getProducts(params: ProductSearchParams): Promise<{ data: Product[]; count: number }> {
    let query = this.supabase
      .from("products")
      .select("*", { count: "exact" })
      .is("deleted_at", null);

    if (params.search) {
      query = query.or(`product_code.ilike.%${params.search}%,product_name.ilike.%${params.search}%`);
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
  }
}
