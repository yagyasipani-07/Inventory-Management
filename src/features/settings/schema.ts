import { z } from "zod";

export const SettingSchema = z.object({
  key: z.string().min(1, "Setting key is required"),
  value: z.any(),
  description: z.string().nullable(),
  updated_at: z.string(),
});

export const UpdateSettingSchema = z.object({
  value: z.any(),
});
