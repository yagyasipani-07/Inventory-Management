import { z } from "zod";

// Zod schema for validation
export const sharedSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
});
