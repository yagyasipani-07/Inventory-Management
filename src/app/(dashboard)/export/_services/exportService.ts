import Papa from "papaparse";
import * as XLSX from "xlsx";

export type ExportFormat = "csv" | "excel";
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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response generation based on the dataset
    const records = [];
    const count = 50; // Mock 50 rows

    for (let i = 1; i <= count; i++) {
      if (config.dataset === "Inventory") {
        records.push({
          "Product Code": `PRD-${1000 + i}`,
          "Product Name": `Plywood ${i * 5}mm`,
          "Thickness": `${i * 5}mm`,
          "Current Stock": Math.floor(Math.random() * 500),
          "Reserved Stock": Math.floor(Math.random() * 50),
          "Status": i % 5 === 0 ? "Low Stock" : "In Stock",
        });
      } else if (config.dataset === "Warehouse Stock") {
        records.push({
          "Product Code": `PRD-${1000 + i}`,
          "Zone": ["A", "B", "C", "D"][i % 4],
          "Rack": `R-${Math.floor(i / 10) + 1}`,
          "Available Qty": Math.floor(Math.random() * 300),
          "Total Qty": Math.floor(Math.random() * 400),
        });
      } else if (config.dataset === "Customers") {
        records.push({
          "Customer Name": `Customer ${i}`,
          "City": ["Delhi", "Mumbai", "Bangalore"][i % 3],
          "Transport": `Transport ${i % 5 + 1}`,
          "Total Challans": Math.floor(Math.random() * 20),
          "Status": i % 8 === 0 ? "Inactive" : "Active",
        });
      } else if (config.dataset === "Dispatch Challans") {
        records.push({
          "Challan Number": `CH-${2026}-${1000 + i}`,
          "Date": new Date().toISOString().slice(0, 10),
          "Customer": `Customer ${i}`,
          "Total Items": Math.floor(Math.random() * 10) + 1,
          "Status": ["Draft", "Approved", "Dispatched"][i % 3],
        });
      }
    }
    
    return records;
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
  }
};
