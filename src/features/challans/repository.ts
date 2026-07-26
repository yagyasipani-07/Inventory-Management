import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Challan, ChallanSearchParams, ValidatedCreateChallan, ValidatedUpdateChallan } from "./types";
import { DatabaseError } from "@/utils/errors";

export class ChallanRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getChallans(params: ChallanSearchParams): Promise<{ data: any[]; count: number }> {
    let query = this.supabase
      .from("challans")
      .select("*, customers(customer_name, customer_number), challan_items(*, products(product_name, product_code))", { count: "exact" })
      .is("deleted_at", null);

    if (params.search) {
      query = query.or(`challan_number.ilike.%${params.search}%`);
    }
    if (params.status) query = query.eq("status", params.status);
    if (params.customer_id) query = query.eq("customer_id", params.customer_id);

    const page = params.page || 1;
    const limit = params.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new DatabaseError("Failed to fetch challans", error);

    return { data: data || [], count: count || 0 };
  }

  async getChallanById(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from("challans")
      .select("*, customers(*), challan_items(*, products(*))")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError("Failed to fetch challan", error);
    }
    return data;
  }

  async generateNextChallanNumber(): Promise<string> {
    const { data, error } = await this.supabase
      .from("challans")
      .select("challan_number")
      .order("created_at", { ascending: false })
      .limit(1);
    
    if (error) throw new DatabaseError("Failed to get latest challan number", error);
    
    if (!data || data.length === 0) return "CH-000001";
    
    const lastNum = (data as any[])[0].challan_number;
    const match = lastNum.match(/CH-(\d+)/);
    if (match) {
      const nextId = parseInt(match[1]) + 1;
      return `CH-${nextId.toString().padStart(6, '0')}`;
    }
    return `CH-${Date.now()}`;
  }

  async createDraftChallan(data: ValidatedCreateChallan, userId?: string): Promise<any> {
    // Basic creation without full atomic transaction logic (handled later via RPC if needed)
    const challan_number = await this.generateNextChallanNumber();
    
    const { data: challan, error: challanError } = await this.supabase
      .from("challans")
      .insert([{
        challan_number,
        customer_id: data.customer_id,
        notes: data.notes || null,
        status: "Draft",
        created_by_id: userId || null,
      }] as any)
      .select()
      .single();

    if (challanError) throw new DatabaseError("Failed to create challan record", challanError);

    const itemsToInsert = data.items.map(item => ({
      challan_id: (challan as any).id,
      product_id: item.product_id,
      quantity: item.quantity
    }));

    const { error: itemsError } = await this.supabase
      .from("challan_items")
      .insert(itemsToInsert as any);

    if (itemsError) throw new DatabaseError("Failed to insert challan items", itemsError);

    return this.getChallanById((challan as any).id);
  }

  async softDeleteChallan(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("challans")
      .update({ deleted_at: new Date().toISOString() } as never)
      .eq("id", id);

    if (error) throw new DatabaseError("Failed to delete challan", error);
  }
}

