import { z } from "zod";

export const AuditLogSchema = z.object({
  id: z.string().uuid(),
  entity: z.string().min(1, "Entity is required"),
  entity_id: z.string().uuid(),
  action: z.string().min(1, "Action is required"),
  user_id: z.string().uuid().nullable(),
  description: z.string().nullable(),
  metadata: z.any().nullable(),
  created_at: z.string(),
});

export const CreateAuditLogSchema = AuditLogSchema.omit({
  id: true,
  created_at: true,
});
