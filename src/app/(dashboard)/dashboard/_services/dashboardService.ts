import { useQuery } from '@tanstack/react-query';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export type DashboardStats = {
  totalProducts: number;
  totalProductsTrend: number;
  currentStockValue: number;
  currentStockValueTrend: number;
  todaysDispatch: number;
  todaysDispatchTrend: number;
  lowStockItems: number;
  lowStockItemsTrend: number;
};

export type InventoryTrend = {
  date: string;
  incoming: number;
  outgoing: number;
};

export type LowStockProduct = {
  id: string;
  code: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  status: 'Critical' | 'Warning';
};

export type RecentChallan = {
  id: string;
  challanNo: string;
  customer: string;
  date: string;
  items: number;
  status: 'Draft' | 'Approved' | 'Printed' | 'Dispatched';
};

export type RecentActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'Inventory' | 'Challan' | 'System' | 'Customer';
};

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(600);
    return {
      totalProducts: 524,
      totalProductsTrend: 2.4,
      currentStockValue: 4285000,
      currentStockValueTrend: 1.2,
      todaysDispatch: 18,
      todaysDispatchTrend: -5.0,
      lowStockItems: 11,
      lowStockItemsTrend: 15.0,
    };
  },

  getInventoryTrend: async (): Promise<InventoryTrend[]> => {
    await delay(700);
    // Generate last 30 days of mock data
    return Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        incoming: Math.floor(Math.random() * 500) + 100,
        outgoing: Math.floor(Math.random() * 600) + 50,
      };
    });
  },

  getLowStockProducts: async (): Promise<LowStockProduct[]> => {
    await delay(500);
    return [
      { id: '1', code: 'PRD-001', name: '18mm Commercial Plywood', currentStock: 12, minimumStock: 50, status: 'Critical' },
      { id: '2', code: 'PRD-045', name: '12mm Marine Plywood', currentStock: 25, minimumStock: 30, status: 'Warning' },
      { id: '3', code: 'PRD-112', name: 'Fevicol SH 5kg', currentStock: 5, minimumStock: 20, status: 'Critical' },
      { id: '4', code: 'PRD-089', name: 'Teak Wood Veneer 4x8', currentStock: 18, minimumStock: 25, status: 'Warning' },
      { id: '5', code: 'PRD-034', name: 'Edge Banding Tape White', currentStock: 2, minimumStock: 15, status: 'Critical' },
    ];
  },

  getRecentChallans: async (): Promise<RecentChallan[]> => {
    await delay(800);
    return [
      { id: '1', challanNo: 'CH-2023-1042', customer: 'Sharma Interiors', date: new Date().toISOString(), items: 14, status: 'Dispatched' },
      { id: '2', challanNo: 'CH-2023-1043', customer: 'Verma Builders', date: new Date().toISOString(), items: 5, status: 'Printed' },
      { id: '3', challanNo: 'CH-2023-1044', customer: 'Gupta & Sons', date: new Date().toISOString(), items: 22, status: 'Approved' },
      { id: '4', challanNo: 'CH-2023-1045', customer: 'Modern Woodworks', date: new Date().toISOString(), items: 8, status: 'Draft' },
    ];
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    await delay(400);
    return [
      { id: '1', title: 'Inventory Updated', description: 'Received 50 units of 18mm Commercial Plywood', time: '2 mins ago', type: 'Inventory' },
      { id: '2', title: 'New Challan Created', description: 'CH-2023-1045 created by Admin', time: '15 mins ago', type: 'Challan' },
      { id: '3', title: 'Excel Imported', description: 'Bulk product update (145 records)', time: '1 hour ago', type: 'System' },
      { id: '4', title: 'Customer Added', description: 'Modern Woodworks onboarded', time: 'Yesterday', type: 'Customer' },
    ];
  }
};

// React Query Hooks
export const useDashboardStats = () => useQuery({ queryKey: ['dashboardStats'], queryFn: dashboardService.getDashboardStats });
export const useInventoryTrend = () => useQuery({ queryKey: ['inventoryTrend'], queryFn: dashboardService.getInventoryTrend });
export const useLowStockProducts = () => useQuery({ queryKey: ['lowStockProducts'], queryFn: dashboardService.getLowStockProducts });
export const useRecentChallans = () => useQuery({ queryKey: ['recentChallans'], queryFn: dashboardService.getRecentChallans });
export const useRecentActivity = () => useQuery({ queryKey: ['recentActivity'], queryFn: dashboardService.getRecentActivity });
