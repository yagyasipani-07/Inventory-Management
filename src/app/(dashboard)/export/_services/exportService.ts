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
  category: string | null;
}

export const exportService = {
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

  async downloadExcel(data: any[], filename: string, dataset: string): Promise<void> {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(data);
    const colWidths: { wch: number }[] = [];
    const keys = Object.keys(data[0] || {});
    keys.forEach((key) => {
      let maxLen = key.length;
      const sample = data.slice(0, 200);
      sample.forEach((row) => {
        const val = row[key] ? String(row[key]) : "";
        if (val.length > maxLen) maxLen = val.length;
      });
      colWidths.push({ wch: maxLen + 2 });
    });
    worksheet["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, dataset.substring(0, 31).replace(/[\[\]*\\/?]/g, ''));

    XLSX.writeFile(workbook, `${filename}.xlsx`);
  },

  async downloadPDF(data: any[], filename: string, dataset: string): Promise<void> {
    await printPdfReport(`${dataset} Report`, data, filename);
  }
};
