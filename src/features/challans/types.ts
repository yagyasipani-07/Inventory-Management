import { Database } from "@/types/database.types";
import { z } from "zod";
import { ChallanSchema, CreateChallanSchema, UpdateChallanSchema, ChallanItemSchema } from "./schema";

export type Challan = Database["public"]["Tables"]["challans"]["Row"];
export type ChallanItem = Database["public"]["Tables"]["challan_items"]["Row"];
export type InsertChallan = Database["public"]["Tables"]["challans"]["Insert"];
export type UpdateChallanRecord = Database["public"]["Tables"]["challans"]["Update"];

export type ValidatedCreateChallan = z.infer<typeof CreateChallanSchema>;
export type ValidatedUpdateChallan = z.infer<typeof UpdateChallanSchema>;
export type ValidatedChallanItem = z.infer<typeof ChallanItemSchema>;

export interface ChallanSearchParams {
  search?: string;
  status?: Database["public"]["Enums"]["challan_status"];
  customer_id?: string;
  page?: number;
  limit?: number;
}
