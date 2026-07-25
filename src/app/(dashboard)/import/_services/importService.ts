import Papa from "papaparse";
import * as XLSX from "xlsx";
import { createBrowserClient } from '@/lib/supabase/browser';

export interface ImportRow {
  [key: string]: any;
}

export interface ValidationResult {
  row: ImportRow;
  rowIndex: number;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImportSummary {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateProducts: number;
  missingFields: number;
}

const getClient = () => createBrowserClient();

export const importService = {
  async uploadFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result !== null && e.target?.result !== undefined) resolve(e.target.result);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = (e) => reject(e);
      if (file.name.toLowerCase().endsWith(".csv")) reader.readAsText(file);
      else reader.readAsArrayBuffer(file);
    });
  },

  async parseCSV(text: string): Promise<ImportRow[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as ImportRow[]),
        error: (error: any) => reject(error),
      });
    });
  },

  async parseExcel(buffer: ArrayBuffer): Promise<ImportRow[]> {
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json<ImportRow>(worksheet, { defval: "" });
  },

  validateRows(rows: ImportRow[]): ValidationResult[] {
    const codes = new Set<string>();
    return rows.map((row, index) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const code = String(row.productCode || row["Product Code"] || "").trim();
      const name = String(row.productName || row["Product Name"] || "").trim();
      const rawStock = row.currentStock || row["Current Stock"] || row.stock;
      const stock = rawStock ? Number(rawStock) : 0;

      if (!code) errors.push("Missing Product Code");
      else {
        if (codes.has(code)) errors.push("Duplicate Product Code");
        codes.add(code);
      }
      if (!name) errors.push("Missing Product Name");
      if (isNaN(stock)) errors.push("Invalid Quantity");
      else if (stock < 0) errors.push("Negative Stock");

      return {
        row,
        rowIndex: index + 1,
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    });
  },

  getSummary(results: ValidationResult[]): ImportSummary {
    let validRows = 0;
    let invalidRows = 0;
    let duplicateProducts = 0;
    let missingFields = 0;

    results.forEach((r) => {
      if (r.isValid) validRows++;
      else invalidRows++;
      r.errors.forEach((err) => {
        if (err.includes("Duplicate")) duplicateProducts++;
        if (err.includes("Missing")) missingFields++;
      });
    });

    return { totalRows: results.length, validRows, invalidRows, duplicateProducts, missingFields };
  },

  async importProducts(data: any[]): Promise<boolean> {
    const supabase = getClient();
    
    // Convert to DB payload
    const rows = data.map(row => ({
      product_code: String(row.productCode || row["Product Code"] || "").trim(),
      product_name: String(row.productName || row["Product Name"] || "").trim(),
    }));

    // Perform bulk upsert for products. Warehouse stock initialization should ideally be handled next.
    const { error } = await supabase.from('products').upsert(rows, { onConflict: 'product_code' });
    
    if (error) {
      console.error("Import failed:", error);
      return false;
    }
    
    // Log audit
    await supabase.from('audit_logs').insert({
      entity: 'Product',
      entity_id: '00000000-0000-0000-0000-000000000000', // Use real UUID in prod
      action: 'Import',
      description: `Bulk imported ${rows.length} products`
    });

    return true; 
  },
  
  downloadErrorReport(results: ValidationResult[]) {
    const errorRows = results.filter(r => !r.isValid).map(r => ({
      Row: r.rowIndex,
      Error: r.errors.join(", "),
      Reason: "Validation failed during import",
      SuggestedFix: "Review row and update missing or duplicate fields"
    }));

    if (errorRows.length === 0) return;
    const csv = Papa.unparse(errorRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `import_error_report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadInventoryTemplate(format: "csv" | "excel") {
    const rows = [
      { "Product Code": "MR-18-84", "Product Name": "18mm MR Grade Plywood", "Current Stock": 100, "Minimum Stock": 20 },
      { "Product Code": "BWP-12-84", "Product Name": "12mm BWP Plywood", "Current Stock": 75, "Minimum Stock": 15 },
    ];

    if (format === "csv") {
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "inventory-import-template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Template");
    XLSX.writeFile(workbook, "inventory-import-template.xlsx");
  },

  downloadWarehouseTemplate(format: "csv" | "excel") {
    const rows = [
      { "Product Code": "MR-18-84", "Warehouse Location": "A1-Rack-2", "Current Stock": 50 },
      { "Product Code": "BWP-12-84", "Warehouse Location": "B2-Rack-1", "Current Stock": 20 },
    ];

    if (format === "csv") {
      const csv = Papa.unparse(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "warehouse-import-template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Warehouse Template");
    XLSX.writeFile(workbook, "warehouse-import-template.xlsx");
  }
};
