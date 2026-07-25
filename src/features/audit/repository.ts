import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { AuditLog, InsertAuditLog, AuditSearchParams } from "./types";
import { DatabaseError } from "@/utils/errors";

export class AuditRepository {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getAuditLogs(params: AuditSearchParams): Promise<{ data: AuditLog[]; count: number }> {
    let query = this.supabase
      .from("audit_logs")
      .select("*, user_profiles(name, email)", { count: "exact" });

    if (params.search) {
      query = query.or(`description.ilike.%${params.search}%,entity.ilike.%${params.search}%`);
    }
    if (params.entity) query = query.eq("entity", params.entity);
    if (params.action) query = query.eq("action", params.action);

    const page = params.page || 1;
    const limit = params.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to).order("created_at", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw new DatabaseError("Failed to fetch audit logs", error);
    return { data: data || [], count: count || 0 };
  }

  async createAuditLog(log: InsertAuditLog): Promise<void> {
    const { error } = await this.supabase
      .from("audit_logs")
      .insert([log] as any);

    if (error) throw new DatabaseError("Failed to insert audit log", error);
  }
}
