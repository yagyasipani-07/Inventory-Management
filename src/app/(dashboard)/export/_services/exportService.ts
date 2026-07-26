import Papa from "papaparse";
import * as XLSX from "xlsx";
import { printPdfReport } from "@/src/lib/export/printPdf";
import { createBrowserClient } from '@/lib/supabase/browser';

export type ExportFormat = "csv" | "excel" | "pdf";
export type ExportDataset = "Inventory" | "Warehouse Stock" | "Customers" | "Dispatch Challans";

export interface ExportConfig {
  dataset: ExportDataset;
  format: ExportFormat;
  dateRange: { from: Date; to: Date } | null;
  status: string | null;
  groupBy?: "category" | "product_name" | "none";
}

const getClient = () => createBrowserClient();

export const exportService = {
  async fetchData(config: ExportConfig): Promise<any[]> {
    const supabase = getClient();
    
    if (config.dataset === "Inventory") {
      const { data: products } = await supabase.from('products').select('*').is('deleted_at', null);
      const { data: stocks } = await supabase.from('warehouse_stock').select('*');
      
      let rows = (products || []).map((p: any) => {
        const productStocks = (stocks || []).filter((s: any) => s.product_id === p.id);
        const totalQty = productStocks.reduce((acc: number, s: any) => acc + (s.current_quantity || 0), 0);
        const reservedQty = productStocks.reduce((acc: number, s: any) => acc + (s.reserved_quantity || 0), 0);
        return {
          "Category": p.category || "Uncategorized",
          "Product Code": p.product_code,
          "Product Name": p.product_name || "N/A",
          "Brand": p.brand || "N/A",
          "Thickness (mm)": p.thickness || 0,
          "Current Stock": totalQty,
          "Reserved Stock": reservedQty,
          "Available Stock": totalQty - reservedQty,
        };
      });

      if (config.groupBy === "category") {
        rows.sort((a, b) => a["Category"].localeCompare(b["Category"]) || a["Product Name"].localeCompare(b["Product Name"]));
      } else if (config.groupBy === "product_name") {
        rows.sort((a, b) => a["Product Name"].localeCompare(b["Product Name"]) || a["Category"].localeCompare(b["Category"]));
      }
      return rows;
    } 
    else if (config.dataset === "Warehouse Stock") {
      const { data } = await supabase.from('warehouse_stock').select('*, products(*)');
      let rows = (data || []).map((p: any) => ({
        "Category": p.products?.category || "Uncategorized",
        "Product Code": p.products?.product_code || "N/A",
        "Product Name": p.products?.product_name || "N/A",
        "Warehouse": "Main Warehouse", // Hardcoded for now
        "Available Qty": (p.current_quantity || 0) - (p.reserved_quantity || 0),
        "Total Qty": p.current_quantity || 0,
      }));

      if (config.groupBy === "category") {
        rows.sort((a, b) => a["Category"].localeCompare(b["Category"]) || a["Product Name"].localeCompare(b["Product Name"]));
      } else if (config.groupBy === "product_name") {
        rows.sort((a, b) => a["Product Name"].localeCompare(b["Product Name"]) || a["Category"].localeCompare(b["Category"]));
      }
      return rows;
    } 
    else if (config.dataset === "Customers") {
      const { data } = await supabase.from('customers').select('*');
      return (data || []).map((c: any) => ({
        "Customer Name": c.customer_name,
        "Customer Number": c.customer_number || "N/A",
        "Phone": c.phone || "N/A",
        "Total Challans": 0, // Need aggregation query for this
      }));
    } 
    else if (config.dataset === "Dispatch Challans") {
      const { data } = await supabase.from('challans').select('*, customers(customer_name), challan_items(quantity)');
      return (data || []).map((ch: any) => ({
        "Challan Number": ch.challan_number,
        "Date": ch.created_at ? ch.created_at.split('T')[0] : "N/A",
        "Customer": ch.customers?.customer_name || "Unknown",
        "Total Items": ch.challan_items?.reduce((a: number, b: any) => a + (b.quantity || 0), 0) || 0,
        "Status": ch.status || "Draft",
      }));
    }
    
    return [];
  },

  downloadCSV(data: any[], filename: string) {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadExcel(data: any[], filename: string, dataset: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const colWidths: { wch: number }[] = [];
    const keys = Object.keys(data[0] || {});
    keys.forEach((key) => {
      let maxLen = key.length;
      data.forEach((row) => {
        const val = row[key] ? String(row[key]) : "";
        if (val.length > maxLen) maxLen = val.length;
      });
      colWidths.push({ wch: maxLen + 2 });
    });
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataset.substring(0, 31));
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  },

  downloadPDF(data: any[], filename: string, dataset: string) {
    printPdfReport(`${dataset} Report`, data, filename);
  }
};
