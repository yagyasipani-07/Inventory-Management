import { logger } from "@/utils/logger";
import { createSuccessResponse, createErrorResponse, type ApiResponse } from "@/utils/response";
import type { SharedEntity } from "./types";

/**
 * Example base service showcasing the pattern.
 * Real implementations will use Supabase clients passed in or created within.
 */
export class SharedService {
  /**
   * Example method signature
   */
  async getBaseData(): Promise<ApiResponse<SharedEntity>> {
    try {
      logger.info("Fetching base data");
      // TODO: Implement Supabase call
      
      const mockData: SharedEntity = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        createdAt: new Date().toISOString(),
      };
      
      return createSuccessResponse(mockData, "Data fetched successfully");
    } catch (error) {
      logger.error("Failed to fetch base data", error);
      return createErrorResponse(error);
    }
  }
}
