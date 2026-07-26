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

    // Products added in last 7 days for trend
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    const { count: newProductsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null)
      .eq('active_status', true)
      .gte('created_at', lastWeekDate.toISOString());
    
    // Low Stock Items (query warehouse_stock and check against reorder_level)
    const { data: stockData } = await supabase
      .from('warehouse_stock')
      .select('*, products!inner(deleted_at, active_status)')
      .is('products.deleted_at', null)
      .eq('products.active_status', true);
    
    let lowStockCount = 0;
    let totalStockQty = 0;
    (stockData || []).forEach((item: any) => {
      const threshold = item.reorder_level > 0 ? item.reorder_level : 10;
      const qty = item.current_quantity || 0;
      totalStockQty += qty;
      if (qty <= threshold) {
        lowStockCount++;
      }
    });
    
    // Today's & Yesterday's Dispatches
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const { data: dispatches } = await supabase
      .from('challans')
      .select('id, dispatch_date, status, updated_at')
      .eq('status', 'Dispatched')
      .is('deleted_at', null);

    const todaysDispatch = (dispatches || []).filter((c: any) => 
      (c.dispatch_date && c.dispatch_date.startsWith(today)) ||
      (!c.dispatch_date && c.updated_at && c.updated_at.startsWith(today))
    ).length;

    const yesterdaysDispatch = (dispatches || []).filter((c: any) => 
      (c.dispatch_date && c.dispatch_date.startsWith(yesterday)) ||
      (!c.dispatch_date && c.updated_at && c.updated_at.startsWith(yesterday))
    ).length;

    return {
      totalProducts: productCount || 0,
      totalProductsTrend: newProductsCount || 0,
      currentStockValue: totalStockQty,
      currentStockValueTrend: 0,
      todaysDispatch,
      todaysDispatchTrend: todaysDispatch - yesterdaysDispatch,
      lowStockItems: lowStockCount,
      lowStockItemsTrend: 0,
    };
  },

  getInventoryTrend: async (): Promise<InventoryTrend[]> => {
    const supabase = getClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: movements } = await supabase
      .from('stock_movements')
      .select('created_at, quantity_change, movement_type')
      .gte('created_at', sevenDaysAgo.toISOString());

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];

      const dayMovements = (movements || []).filter((m: any) => 
        m.created_at && m.created_at.startsWith(dateStr)
      );

      const incoming = dayMovements
        .filter((m: any) => m.quantity_change > 0)
        .reduce((sum: number, m: any) => sum + m.quantity_change, 0);

      const outgoing = dayMovements
        .filter((m: any) => m.quantity_change < 0)
        .reduce((sum: number, m: any) => sum + Math.abs(m.quantity_change), 0);

      return {
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        incoming,
        outgoing,
      };
    });
  },

  getLowStockProducts: async (): Promise<LowStockProduct[]> => {
    const supabase = getClient();
    const { data } = await supabase
      .from('warehouse_stock')
      .select('*, products!inner(product_code, product_name, deleted_at, active_status)')
      .is('products.deleted_at', null)
      .eq('products.active_status', true);
    
    const lowStockList = (data || [])
      .map((item: any) => {
        const threshold = item.reorder_level > 0 ? item.reorder_level : 10;
        return {
          id: item.product_id,
          code: item.products?.product_code || 'N/A',
          name: item.products?.product_name || 'N/A',
          currentStock: item.current_quantity || 0,
          minimumStock: threshold,
          status: (item.current_quantity || 0) < threshold / 2 ? 'Critical' : 'Warning'
        } as LowStockProduct;
      })
      .filter((item: LowStockProduct) => item.currentStock <= item.minimumStock)
      .slice(0, 5);

    return lowStockList;
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

    if (data && data.length > 0) {
      return data.map((log: any) => {
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

    // Fallback to recent challans if audit_logs is empty
    const { data: recentChallans } = await supabase.from('challans')
      .select('id, challan_number, status, created_at, customers(customer_name)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5);

    return (recentChallans || []).map((c: any) => ({
      id: c.id,
      title: `Challan ${c.challan_number}`,
      description: `Status: ${c.status} for ${c.customers?.customer_name || 'Customer'}`,
      time: c.created_at,
      type: 'Challan'
    }));
  }
};

// React Query Hooks
export const useDashboardStats = () => useQuery({ queryKey: ['dashboardStats'], queryFn: dashboardService.getDashboardStats });
export const useInventoryTrend = () => useQuery({ queryKey: ['inventoryTrend'], queryFn: dashboardService.getInventoryTrend });
export const useLowStockProducts = () => useQuery({ queryKey: ['lowStockProducts'], queryFn: dashboardService.getLowStockProducts });
export const useRecentChallans = () => useQuery({ queryKey: ['recentChallans'], queryFn: dashboardService.getRecentChallans });
export const useRecentActivity = () => useQuery({ queryKey: ['recentActivity'], queryFn: dashboardService.getRecentActivity });
