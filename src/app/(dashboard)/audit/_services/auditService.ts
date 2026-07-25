import { AuditService as RealAuditService } from '@/features/audit/service';
import { createBrowserClient } from '@/lib/supabase/browser';

export type AuditAction = 
  | "Create" 
  | "Update" 
  | "Delete" 
  | "Import" 
  | "Export" 
  | "Print" 
  | "Dispatch"
  | "Login"
  | "Logout"
  | "Approve"
  | "Cancel";

export type AuditModule = 
  | "Inventory" 
  | "Warehouse" 
  | "Customers" 
  | "Challans" 
  | "Import" 
  | "Export" 
  | "Settings" 
  | "Authentication";

export type AuditStatus = "Success" | "Warning" | "Failed" | "Pending";

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  module: AuditModule;
  action: AuditAction;
  entity: string;
  description: string;
  status: AuditStatus;
  ipAddress: string;
  metadata?: Record<string, any>;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
}

export interface AuditSummary {
  todayActivities: number;
  inventoryChanges: number;
  dispatchOperations: number;
  imports: number;
  exports: number;
}

export interface AuditFilters {
  dateRange: { from?: Date; to?: Date };
  module: AuditModule | "All";
  user: string;
  action: AuditAction | "All";
  status: AuditStatus | "All";
  search: string;
}

const getService = () => new RealAuditService(createBrowserClient());

function mapToUiAuditLog(dbLog: any): AuditLog {
  return {
    id: dbLog.id,
    timestamp: dbLog.created_at,
    user: dbLog.user_profiles?.name || 'System',
    module: "Inventory", // Fallback for UI 
    action: dbLog.action as AuditAction,
    entity: dbLog.entity,
    description: dbLog.description || '',
    status: 'Success',
    ipAddress: '127.0.0.1', 
    metadata: dbLog.metadata,
  };
}

export const auditService = {
  async getAuditLogs(filters?: Partial<AuditFilters>): Promise<AuditLog[]> {
    const service = getService();
    const { data } = await service.getAuditLogs({
      search: filters?.search,
    });
    return data.map(mapToUiAuditLog);
  },

  async getAuditSummary(): Promise<AuditSummary> {
    const logs = await this.getAuditLogs();
    return {
      todayActivities: logs.length,
      inventoryChanges: logs.filter((l) => l.action === 'Update').length,
      dispatchOperations: logs.filter((l) => l.action === 'Dispatch').length,
      imports: logs.filter((l) => l.action === 'Import').length,
      exports: 0
    };
  },

  async getTimeline(): Promise<Record<string, AuditLog[]>> {
    const logs = await this.getAuditLogs();
    return {
      "Recent": logs.slice(0, 10),
      "Earlier": logs.slice(10, 20)
    };
  }
};
