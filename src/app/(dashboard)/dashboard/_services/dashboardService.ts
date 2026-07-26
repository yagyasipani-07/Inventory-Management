import { createBrowserClient } from '@/lib/supabase/browser';
import { useQuery } from '@tanstack/react-query';

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
  status: 'Draft' | 'Approved' | 'Printed' | 'Dispatched' | 'Cancelled';
};

export type RecentActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'Inventory' | 'Challan' | 'System' | 'Customer';
};

const getClient = () => createBrowserClient();

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const supabase = getClient();
    
    // Total Products
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('active_status', true);
    
    // Low Stock (using warehouse_stock view logic)
    const { count: lowStockCount } = await supabase
      .from('warehouse_stock')
      .select('*, products!inner(deleted_at, active_status)', { count: 'exact', head: true })
      .lt('current_quantity', 10)
      .is('products.deleted_at', null)
      .eq('products.active_status', true);
    
    // Today's Dispatch
    const today = new Date().toISOString().split('T')[0];
    const { count: dispatchCount } = await supabase
      .from('challans')
      .select('*', { count: 'exact', head: true })
      .eq('dispatch_date', today)
      .is('deleted_at', null);

    return {
      totalProducts: productCount || 0,
      totalProductsTrend: 0, // Requires historical snapshot
      currentStockValue: 0, // No price on products yet
      currentStockValueTrend: 0,
      todaysDispatch: dispatchCount || 0,
      todaysDispatchTrend: 0,
      lowStockItems: lowStockCount || 0,
      lowStockItemsTrend: 0,
    };
  },

  getInventoryTrend: async (): Promise<InventoryTrend[]> => {
    // Generate empty/mock trend until historical snapshots table exists
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        incoming: 0,
        outgoing: 0,
      };
    });
  },

  getLowStockProducts: async (): Promise<LowStockProduct[]> => {
    const supabase = getClient();
    const { data } = await supabase
      .from('warehouse_stock')
      .select('*, products!inner(product_code, product_name, deleted_at, active_status)')
      .lt('current_quantity', 20)
      .is('products.deleted_at', null)
      .eq('products.active_status', true)
      .limit(5);
    
    return (data || []).map((item: any) => ({
      id: item.product_id,
      code: item.products?.product_code || 'N/A',
      name: item.products?.product_name || 'N/A',
      currentStock: item.current_quantity,
      minimumStock: item.reorder_level || 20,
      status: item.current_quantity < 10 ? 'Critical' : 'Warning'
    }));
  },

  getRecentChallans: async (): Promise<RecentChallan[]> => {
    const supabase = getClient();
    const { data } = await supabase.from('challans')
      .select('id, challan_number, created_at, status, customers(customer_name), challan_items(quantity)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5);

    return (data || []).map((c: any) => ({
      id: c.id,
      challanNo: c.challan_number,
      customer: c.customers?.customer_name || 'Unknown',
      date: c.created_at,
      items: c.challan_items?.reduce((acc: number, cur: any) => acc + (cur.quantity || 0), 0) || 0,
      status: c.status as any
    }));
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const supabase = getClient();
    const { data } = await supabase.from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    return (data || []).map((log: any) => {
      let type: 'Inventory' | 'Challan' | 'System' | 'Customer' = 'System';
      if (log.entity === 'Product') type = 'Inventory';
      else if (log.entity === 'Challan') type = 'Challan';
      else if (log.entity === 'Customer') type = 'Customer';
      
      return {
        id: log.id,
        title: `${log.action} ${log.entity}`,
        description: log.description || '',
        time: log.created_at,
        type
      };
    });
  }
};

// React Query Hooks
export const useDashboardStats = () => useQuery({ queryKey: ['dashboardStats'], queryFn: dashboardService.getDashboardStats });
export const useInventoryTrend = () => useQuery({ queryKey: ['inventoryTrend'], queryFn: dashboardService.getInventoryTrend });
export const useLowStockProducts = () => useQuery({ queryKey: ['lowStockProducts'], queryFn: dashboardService.getLowStockProducts });
export const useRecentChallans = () => useQuery({ queryKey: ['recentChallans'], queryFn: dashboardService.getRecentChallans });
export const useRecentActivity = () => useQuery({ queryKey: ['recentActivity'], queryFn: dashboardService.getRecentActivity });
