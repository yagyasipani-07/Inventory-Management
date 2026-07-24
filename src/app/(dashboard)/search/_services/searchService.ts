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

// Mock dataset for global search
const mockData: SearchResult[] = [
  // Products
  { id: "p1", title: "Commercial Plywood 18mm", subtitle: "PLY-COM-18", category: "Products", href: "/inventory/PLY-COM-18", icon: "box" },
  { id: "p2", title: "Marine Plywood 12mm", subtitle: "PLY-MAR-12", category: "Products", href: "/inventory/PLY-MAR-12", icon: "box" },
  { id: "p3", title: "Teak Veneer 4mm", subtitle: "VEN-TEK-04", category: "Products", href: "/inventory/VEN-TEK-04", icon: "box" },
  
  // Customers
  { id: "c1", title: "Acme Furniture", subtitle: "CUST-001", category: "Customers", href: "/customers/CUST-001", icon: "users" },
  { id: "c2", title: "Sharma Interiors", subtitle: "CUST-002", category: "Customers", href: "/customers/CUST-002", icon: "users" },
  { id: "c3", title: "Woodcrafters Plywoods", subtitle: "CUST-003", category: "Customers", href: "/customers/CUST-003", icon: "users" },

  // Challans
  { id: "ch1", title: "Challan #CH-2023-001", subtitle: "Acme Furniture - 50 items", category: "Challans", href: "/challans/CH-2023-001", icon: "fileText" },
  { id: "ch2", title: "Challan #CH-2023-002", subtitle: "Sharma Interiors - 120 items", category: "Challans", href: "/challans/CH-2023-002", icon: "fileText" },

  // Warehouse
  { id: "w1", title: "Zone A - Plywoods", subtitle: "Main Warehouse", category: "Warehouse", href: "/warehouse", icon: "warehouse" },
  { id: "w2", title: "Zone B - Veneers", subtitle: "Secondary Warehouse", category: "Warehouse", href: "/warehouse", icon: "warehouse" },

  // Audit
  { id: "a1", title: "Stock Adjustment", subtitle: "Added 500 units to PLY-COM-18", category: "Audit", href: "/audit", icon: "activity" },
  { id: "a2", title: "Challan Dispatched", subtitle: "CH-2023-001 marked as dispatched", category: "Audit", href: "/audit", icon: "activity" },

  // Settings
  { id: "s1", title: "Company Profile", subtitle: "Manage company details", category: "Settings", href: "/settings/company", icon: "settings" },
  { id: "s2", title: "Print Preferences", subtitle: "Challan print templates", category: "Settings", href: "/settings/print", icon: "settings" },
];

export const searchService = {
  async searchGlobal(query: string): Promise<Record<SearchCategory, SearchResult[]>> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!query.trim()) {
      return this.getRecentSearches();
    }

    const lowerQuery = query.toLowerCase();
    
    // Filter matching results
    const results = mockData.filter(
      (item) => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );

    // Group by category
    const grouped = results.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<SearchCategory, SearchResult[]>);

    return grouped;
  },

  async getRecentSearches(): Promise<Record<SearchCategory, SearchResult[]>> {
    // Return a few items as "recent"
    const recent = [mockData[0], mockData[3], mockData[6], mockData[10]];
    
    const grouped = recent.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<SearchCategory, SearchResult[]>);
    
    return grouped;
  }
};
