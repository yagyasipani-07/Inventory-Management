import { Database } from "@/types/database.types";
import { z } from "zod";
import { AuditLogSchema, CreateAuditLogSchema } from "./schema";

export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
export type InsertAuditLog = Database["public"]["Tables"]["audit_logs"]["Insert"];

export type ValidatedAuditLog = z.infer<typeof AuditLogSchema>;
export type ValidatedCreateAuditLog = z.infer<typeof CreateAuditLogSchema>;

export interface AuditSearchParams {
  search?: string;
  entity?: string;
  action?: string;
  page?: number;
  limit?: number;
}
