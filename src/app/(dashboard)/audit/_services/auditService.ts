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

// Generate some mock logs
const generateMockLogs = (): AuditLog[] => {
  const logs: AuditLog[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const time = new Date(now.getTime() - i * 3600000 - Math.random() * 3600000);
    
    // Some static varied data
    const types: { action: AuditAction, module: AuditModule, desc: string, entity: string, status: AuditStatus }[] = [
      { action: "Update", module: "Inventory", desc: "Adjusted stock manually", entity: "PLY-COM-18", status: "Success" },
      { action: "Dispatch", module: "Challans", desc: "Dispatched Challan #CH-2023-001", entity: "CH-2023-001", status: "Success" },
      { action: "Create", module: "Customers", desc: "Added new customer", entity: "CUST-004", status: "Success" },
      { action: "Import", module: "Import", desc: "Bulk imported 50 products", entity: "Products", status: "Warning" },
      { action: "Export", module: "Export", desc: "Exported current stock report", entity: "Warehouse Stock", status: "Success" },
      { action: "Login", module: "Authentication", desc: "User logged in", entity: "admin@parasplywoods.com", status: "Success" },
      { action: "Print", module: "Challans", desc: "Printed Dispatch Challan", entity: "CH-2023-002", status: "Success" },
      { action: "Delete", module: "Inventory", desc: "Deleted obsolete product", entity: "OLD-PLY-01", status: "Success" },
      { action: "Update", module: "Settings", desc: "Updated company address", entity: "Company Profile", status: "Success" },
      { action: "Create", module: "Challans", desc: "Created draft challan", entity: "CH-2023-003", status: "Pending" },
    ];
    
    const template = types[i % types.length];
    
    logs.push({
      id: `log-${50 - i}`,
      timestamp: time.toISOString(),
      user: ["Admin User", "Warehouse Manager", "Dispatch Operator"][i % 3],
      module: template.module,
      action: template.action,
      entity: template.entity,
      description: template.desc,
      status: template.status,
      ipAddress: `192.168.1.${100 + (i % 20)}`,
      oldValue: i % 2 === 0 ? { stock: 100 } : undefined,
      newValue: i % 2 === 0 ? { stock: 150 } : undefined,
      metadata: { browser: "Chrome 120", os: "Windows 11" }
    });
  }
  
  return logs;
};

const mockLogs = generateMockLogs();

export const auditService = {
  async getAuditLogs(filters?: Partial<AuditFilters>): Promise<AuditLog[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredLogs = [...mockLogs];

    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.description.toLowerCase().includes(s) || 
          log.entity.toLowerCase().includes(s) ||
          log.user.toLowerCase().includes(s)
        );
      }
      
      if (filters.module && filters.module !== "All") {
        filteredLogs = filteredLogs.filter(log => log.module === filters.module);
      }
      
      if (filters.action && filters.action !== "All") {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      
      if (filters.status && filters.status !== "All") {
        filteredLogs = filteredLogs.filter(log => log.status === filters.status);
      }
    }

    return filteredLogs;
  },

  async getAuditSummary(): Promise<AuditSummary> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      todayActivities: 24,
      inventoryChanges: 8,
      dispatchOperations: 5,
      imports: 1,
      exports: 3
    };
  },

  async getTimeline(): Promise<Record<string, AuditLog[]>> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Group logs by relative time (Today, Yesterday, Earlier)
    const grouped: Record<string, AuditLog[]> = {
      "Today": mockLogs.slice(0, 5),
      "Yesterday": mockLogs.slice(5, 12),
      "Earlier": mockLogs.slice(12, 20)
    };
    
    return grouped;
  }
};
