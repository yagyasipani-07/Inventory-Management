import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Customer, InsertCustomer, UpdateCustomer, CustomerSearchParams } from "./types";
import { DatabaseError } from "@/utils/errors";

export class CustomerRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getCustomers(params: CustomerSearchParams): Promise<{ data: Customer[]; count: number }> {
    let query = this.supabase
      .from("customers")
      .select("*", { count: "exact" })
      .is("deleted_at", null);

    if (params.search) {
      query = query.or(`customer_number.ilike.%${params.search}%,customer_name.ilike.%${params.search}%,phone.ilike.%${params.search}%`);
    }

    const page = params.page || 1;
    const limit = params.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new DatabaseError("Failed to fetch customers", error);

    return { data: data || [], count: count || 0 };
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const { data, error } = await this.supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError("Failed to fetch customer", error);
    }

    return data;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const { data, error } = await this.supabase
      .from("customers")
      .insert([customer] as any)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to create customer", error);

    return data;
  }

  async updateCustomer(id: string, updates: UpdateCustomer): Promise<Customer> {
    const { data, error } = await this.supabase
      .from("customers")
      .update(updates as never)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new DatabaseError("Failed to update customer", error);

    return data;
  }

  async softDeleteCustomer(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("customers")
      .update({ deleted_at: new Date().toISOString() } as never)
      .eq("id", id);

    if (error) throw new DatabaseError("Failed to delete customer", error);
  }
}
