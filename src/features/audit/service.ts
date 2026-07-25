import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { AuditRepository } from "./repository";
import { CreateAuditLogSchema } from "./schema";
import { ValidatedCreateAuditLog, AuditSearchParams } from "./types";
import { AppError } from "@/utils/errors";

export class AuditService {
  private repository: AuditRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new AuditRepository(supabase);
  }

  async getAuditLogs(params: AuditSearchParams) {
    try {
      return await this.repository.getAuditLogs(params);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logAction(data: ValidatedCreateAuditLog) {
    try {
      const validatedData = CreateAuditLogSchema.parse(data);
      await this.repository.createAuditLog(validatedData);
    } catch (error) {
      // We generally don't want audit log failures to crash the main application workflow,
      // but we should log it to console or external monitoring
      console.error("Audit logging failed:", error);
    }
  }

  private handleError(error: any): Error {
    if (error instanceof AppError) return error;
    return new AppError("An unexpected error occurred in AuditService", "INTERNAL_ERROR", 500, error);
  }
}
