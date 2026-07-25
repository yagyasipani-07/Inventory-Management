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
}

const getClient = () => createBrowserClient();

export const exportService = {
  async fetchData(config: ExportConfig): Promise<any[]> {
    const supabase = getClient();
    
    if (config.dataset === "Inventory" || config.dataset === "Warehouse Stock") {
      const { data } = await supabase.from('warehouse_stock').select('*, products(*)');
      return (data || []).map((p: any) => {
        if (config.dataset === "Inventory") {
          return {
            "Product Code": p.products?.product_code,
            "Product Name": p.products?.product_name || "N/A",
            "Current Stock": p.current_quantity || 0,
            "Available Stock": (p.current_quantity || 0) - (p.reserved_quantity || 0),
          };
        } else {
          return {
            "Product Code": p.products?.product_code,
            "Warehouse": "Main Warehouse", // Hardcoded for now
            "Available Qty": (p.current_quantity || 0) - (p.reserved_quantity || 0),
            "Total Qty": p.current_quantity || 0,
          };
        }
      });
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
