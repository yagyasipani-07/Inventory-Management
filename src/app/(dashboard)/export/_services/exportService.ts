import Papa from "papaparse";
import * as XLSX from "xlsx";
import { printPdfReport } from "@/src/lib/export/printPdf";

export type ExportFormat = "csv" | "excel" | "pdf";
export type ExportDataset = "Inventory" | "Warehouse Stock" | "Customers" | "Dispatch Challans";

export interface ExportConfig {
  dataset: ExportDataset;
  format: ExportFormat;
  dateRange: { from: Date; to: Date } | null;
  status: string | null;
}

export const exportService = {
  /**
   * Generates mock data for export based on the selected dataset.
   * In a real application, this would be an API call with filters.
   */
  async fetchData(config: ExportConfig): Promise<any[]> {
    const { apiClient, endpoints } = await import('@/src/lib/api');
    
    if (config.dataset === "Inventory" || config.dataset === "Warehouse Stock") {
      const res = await apiClient.get(endpoints.products.list);
      return res.data.map((p: any) => {
        if (config.dataset === "Inventory") {
          return {
            "Product Code": p.productCode,
            "Product Name": p.mould || "N/A",
            "Current Stock": p.currentStock || 0,
            "Available Stock": (p.currentStock || 0) - (p.reservedStock || 0),
          };
        } else {
          return {
            "Product Code": p.productCode,
            "Available Qty": (p.currentStock || 0) - (p.reservedStock || 0),
            "Total Qty": p.currentStock || 0,
          };
        }
      });
    } 
    else if (config.dataset === "Customers") {
      const res = await apiClient.get(endpoints.customers.list);
      return res.data.map((c: any) => ({
        "Customer Name": c.name,
        "City": c.city || "N/A",
        "Customer Number": c.phone || "N/A",
        "Total Challans": 0, // Not available in list endpoint yet
      }));
    } 
    else if (config.dataset === "Dispatch Challans") {
      const res = await apiClient.get(endpoints.challans.list);
      return res.data.map((ch: any) => ({
        "Challan Number": ch.challanNumber,
        "Date": ch.createdAt ? ch.createdAt.split('T')[0] : "N/A",
        "Customer": ch.customer?.name || "Unknown",
        "Total Items": ch.totalQty || 0,
        "Status": ch.status || "DRAFT",
      }));
    }
    
    return [];
  },

  /**
   * Exports data to a CSV file and triggers download.
   */
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

  /**
   * Exports data to a professional Excel file and triggers download.
   */
  downloadExcel(data: any[], filename: string, dataset: string) {
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Apply auto-width to columns based on the max length of data in each column
    const colWidths: { wch: number }[] = [];
    const keys = Object.keys(data[0] || {});
    keys.forEach((key) => {
      let maxLen = key.length;
      data.forEach((row) => {
        const val = row[key] ? String(row[key]) : "";
        if (val.length > maxLen) maxLen = val.length;
      });
      colWidths.push({ wch: maxLen + 2 }); // Add padding
    });
    worksheet["!cols"] = colWidths;

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, dataset.substring(0, 31)); // Sheet name limit is 31 chars

    // Generate buffer and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  },

  downloadPDF(data: any[], filename: string, dataset: string) {
    printPdfReport(`${dataset} Report`, data, filename);
  }
};
