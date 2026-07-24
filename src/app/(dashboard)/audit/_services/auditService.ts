import { apiClient, endpoints } from '@/src/lib/api';

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
  timestamp: string; // ISO String
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

function mapToUiAuditLog(dbLog: any): AuditLog {
  let module: AuditModule = "Inventory";
  if (dbLog.entityType === 'Customer') module = "Customers";
  if (dbLog.entityType === 'Challan') module = "Challans";

  let action: AuditAction = "Update";
  if (dbLog.action === 'CREATED') action = "Create";
  if (dbLog.action === 'IMPORTED') action = "Import";
  if (dbLog.action === 'APPROVED') action = "Approve";
  if (dbLog.action === 'DISPATCHED') action = "Dispatch";
  
  const desc = `${action} performed on ${dbLog.entityType}`;

  return {
    id: dbLog.id,
    timestamp: dbLog.timestamp,
    user: dbLog.userId || 'System',
    module,
    action,
    entity: dbLog.entityId,
    description: desc,
    status: 'Success',
    ipAddress: '127.0.0.1', // Mocked as DB doesn't store this yet
    oldValue: dbLog.oldValue,
    newValue: dbLog.newValue,
  };
}

export const auditService = {
  async getAuditLogs(filters?: Partial<AuditFilters>): Promise<AuditLog[]> {
    const response = await apiClient.get(endpoints.audit.list);
    let logs = response.data.map(mapToUiAuditLog);

    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        logs = logs.filter((log: AuditLog) => 
          log.description.toLowerCase().includes(s) || 
          log.entity.toLowerCase().includes(s) ||
          log.user.toLowerCase().includes(s)
        );
      }
      
      if (filters.module && filters.module !== "All") {
        logs = logs.filter((log: AuditLog) => log.module === filters.module);
      }
      
      if (filters.action && filters.action !== "All") {
        logs = logs.filter((log: AuditLog) => log.action === filters.action);
      }
      
      if (filters.status && filters.status !== "All") {
        logs = logs.filter((log: AuditLog) => log.status === filters.status);
      }
    }

    return logs;
  },

  async getAuditSummary(): Promise<AuditSummary> {
    const response = await apiClient.get(endpoints.audit.list);
    const logs = response.data;
    
    return {
      todayActivities: logs.length,
      inventoryChanges: logs.filter((l: any) => l.entityType === 'Product').length,
      dispatchOperations: logs.filter((l: any) => l.action === 'DISPATCHED').length,
      imports: logs.filter((l: any) => l.action === 'IMPORTED').length,
      exports: 0
    };
  },

  async getTimeline(): Promise<Record<string, AuditLog[]>> {
    const logs = await this.getAuditLogs();
    
    const grouped: Record<string, AuditLog[]> = {
      "Today": logs.slice(0, 5),
      "Yesterday": logs.slice(5, 12),
      "Earlier": logs.slice(12, 20)
    };
    
    return grouped;
  }
};
