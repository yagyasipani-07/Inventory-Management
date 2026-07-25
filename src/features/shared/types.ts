import { z } from "zod";
import { sharedSchema } from "./schema";

// Example of exporting a type inferred from a Zod schema
export type SharedEntity = z.infer<typeof sharedSchema>;

// Additional explicit interfaces can go here
export interface PaginationParams {
  page: number;
  limit: number;
}
