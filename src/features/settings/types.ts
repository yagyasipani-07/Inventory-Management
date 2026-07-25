import { Database } from "@/types/database.types";
import { z } from "zod";
import { SettingSchema, UpdateSettingSchema } from "./schema";

export type Setting = Database["public"]["Tables"]["settings"]["Row"];
export type UpdateSetting = Database["public"]["Tables"]["settings"]["Update"];

export type ValidatedSetting = z.infer<typeof SettingSchema>;
export type ValidatedUpdateSetting = z.infer<typeof UpdateSettingSchema>;
