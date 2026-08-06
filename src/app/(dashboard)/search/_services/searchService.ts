import { createBrowserClient } from '@/lib/supabase/browser';
import { escapeSupabaseLike } from "@/src/lib/utils";

export type SearchCategory = 
  | "Products" 
  | "Customers" 
  | "Warehouse" 
  | "Challans" 
  | "Audit" 
  | "Settings";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  category: SearchCategory;
  href: string;
  icon?: string;
  shortcut?: string;
}

const getClient = () => createBrowserClient();

export const searchService = {
  async searchGlobal(query: string): Promise<Record<SearchCategory, SearchResult[]>> {
    if (!query.trim()) {
      return this.getRecentSearches();
    }

    const supabase = getClient();
    const results: SearchResult[] = [];
    const searchPattern = escapeSupabaseLike(query);

    // Search Products
    const { data: products } = await supabase.from('products').select('id, product_name, product_code').or(`product_name.ilike.${searchPattern},product_code.ilike.${searchPattern}`).limit(3);
    (products as any[])?.forEach(p => results.push({ id: p.id, title: p.product_name, subtitle: p.product_code || '', category: 'Products', href: `/inventory/${p.id}`, icon: 'box' }));

    // Search Customers
    const { data: customers } = await supabase.from('customers').select('id, customer_name, customer_number').or(`customer_name.ilike.${searchPattern},customer_number.ilike.${searchPattern}`).limit(3);
    (customers as any[])?.forEach(c => results.push({ id: c.id, title: c.customer_name, subtitle: c.customer_number || '', category: 'Customers', href: `/customers/${c.id}`, icon: 'users' }));

    // Search Challans
    const { data: challans } = await supabase.from('challans').select('id, challan_number, status').ilike('challan_number', `%${query.replace(/[%_\\]/g, '\\$&')}%`).limit(3);
    (challans as any[])?.forEach(ch => results.push({ id: ch.id, title: ch.challan_number, subtitle: ch.status || '', category: 'Challans', href: `/challans/${ch.id}`, icon: 'file-text' }));

    // Group by category
    return results.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<SearchCategory, SearchResult[]>);
  },

  async getRecentSearches(): Promise<Record<SearchCategory, SearchResult[]>> {
    // Ideally this comes from local storage or DB
    return {
      "Products": [],
      "Customers": [],
      "Warehouse": [],
      "Challans": [],
      "Audit": [],
      "Settings": []
    };
  }
};
