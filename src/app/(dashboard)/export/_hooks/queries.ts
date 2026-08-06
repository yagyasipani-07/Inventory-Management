import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/lib/supabase/browser';
import { ExportConfig } from '../_services/exportService';

const getClient = () => createBrowserClient();

const extractRelation = (relation: unknown): any => {
  if (Array.isArray(relation)) {
    return relation.length > 0 ? relation[0] : null;
  }
  return relation || null;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['export-categories'],
    queryFn: async () => {
      const supabase = getClient();
      const { data } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)
        .not('category', 'eq', '')
        .is('deleted_at', null);

      if (!data) return [];

      const unique = [...new Set(data.map((p: any) => String(p.category).trim()).filter(Boolean))];
      unique.sort((a, b) => a.localeCompare(b));
      return unique;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExportData = (config: ExportConfig) => {
  return useQuery({
    queryKey: ['export-data', config.dataset, config.status, config.category, config.dateRange],
    queryFn: async ({ signal }) => {
      const supabase = getClient();
      
      if (config.dataset === "Inventory") {
        let query = supabase.from('products')
          .select('*, stock_movements(purchase_bill_number, created_at)')
          .is('deleted_at', null)
          .order('created_at', { foreignTable: 'stock_movements', ascending: false })
          .limit(10, { foreignTable: 'stock_movements' })
          .abortSignal(signal);
          
        if (config.status === "active") query = query.eq('active_status', true);
        else if (config.status === "inactive") query = query.eq('active_status', false);
        if (config.category) query = query.eq('category', config.category);

        const { data: products } = await query;
        const { data: stocks } = await supabase.from('warehouse_stock').select('*').abortSignal(signal);
        
        const stockMap = new Map();
        (stocks || []).forEach((s: any) => {
          if (!stockMap.has(s.product_id)) stockMap.set(s.product_id, []);
          stockMap.get(s.product_id).push(s);
        });

        const rows: Record<string, any>[] = (products || []).map((p: any) => {
          const productStocks = stockMap.get(p.id) || [];
          const totalQty = productStocks.reduce((acc: number, s: any) => acc + (s.current_quantity || 0), 0);
          const reservedQty = productStocks.reduce((acc: number, s: any) => acc + (s.reserved_quantity || 0), 0);
          
          const movements = (p.stock_movements || [])
            .filter((m: any) => m.purchase_bill_number)
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          const latestBill = movements.length > 0 ? movements[0].purchase_bill_number : "N/A";

          return {
            "Category": String(p.category || "Uncategorized"),
            "Product Code": String(p.product_code || "N/A"),
            "Product Name": String(p.product_name || "N/A"),
            "Brand": String(p.brand || "N/A"),
            "Thickness (mm)": Number(p.thickness || 0),
            "Current Stock": Number(totalQty),
            "Reserved Stock": Number(reservedQty),
            "Available Stock": Number(totalQty - reservedQty),
            "Latest Purchase Bill": String(latestBill),
          };
        });

        return rows;
      } 
      else if (config.dataset === "Warehouse Stock") {
        let query = supabase.from('warehouse_stock')
          .select('*, products(*), warehouses(warehouse_name)')
          .abortSignal(signal);
        
        const { data } = await query;
        const rows: Record<string, any>[] = (data || [])
          .map((p: any) => {
            const product = extractRelation(p.products);
            const warehouse = extractRelation(p.warehouses);
            
            return {
              "Category": String(product?.category || "Uncategorized"),
              "Product Code": String(product?.product_code || "N/A"),
              "Product Name": String(product?.product_name || "N/A"),
              "Warehouse": String(warehouse?.warehouse_name || "Unknown"),
              "Available Qty": Number((p.current_quantity || 0) - (p.reserved_quantity || 0)),
              "Total Qty": Number(p.current_quantity || 0),
            };
          })
          .filter((row) => {
            if (!config.category) return true;
            return row["Category"] === config.category;
          });

        return rows;
      } 
      else if (config.dataset === "Customers") {
        const { data } = await supabase.from('customers').select('*, challans(id)').abortSignal(signal);
        return (data || []).map((c: any) => {
          const challans = Array.isArray(c.challans) ? c.challans : (c.challans ? [c.challans] : []);
          return {
            "Customer Name": String(c.customer_name || "Unknown"),
            "Customer Number": String(c.customer_number || "N/A"),
            "Phone": String(c.phone || "N/A"),
            "Total Challans": Number(challans.length),
          };
        });
      } 
      else if (config.dataset === "Dispatch Challans") {
        let query = supabase.from('challans')
          .select('*, customers(customer_name), challan_items(quantity)')
          .abortSignal(signal);
        
        if (config.status && config.status !== "all") {
          query = query.eq('status', config.status === "active" ? "Approved" : config.status);
        }
        if (config.dateRange?.from) {
          query = query.gte('created_at', config.dateRange.from.toISOString());
        }
        if (config.dateRange?.to) {
          query = query.lte('created_at', config.dateRange.to.toISOString());
        }

        const { data } = await query;
        return (data || []).map((ch: any) => {
          const customer = extractRelation(ch.customers);
          const items = Array.isArray(ch.challan_items) ? ch.challan_items : (ch.challan_items ? [ch.challan_items] : []);
          
          return {
            "Challan Number": String(ch.challan_number || "Unknown"),
            "Date": String(ch.created_at ? ch.created_at.split('T')[0] : "N/A"),
            "Customer": String(customer?.customer_name || "Unknown"),
            "Total Items": Number(items.reduce((a: number, b: any) => a + (b.quantity || 0), 0)),
            "Status": String(ch.status || "Draft"),
          };
        });
      }
      
      return [];
    },
    staleTime: 60 * 1000, // 1 minute
  });
};
