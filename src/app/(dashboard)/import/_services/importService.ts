import Papa from "papaparse";
import * as XLSX from "xlsx";

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

export const importService = {
  /**
   * Reads the file asynchronously depending on its extension.
   */
  async uploadFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result !== null && e.target?.result !== undefined) {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = (e) => reject(e);

      if (file.name.toLowerCase().endsWith(".csv")) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  },

  /**
   * Parses CSV content using PapaParse.
   */
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

  /**
   * Parses Excel (XLSX/XLS) content using SheetJS.
   */
  async parseExcel(buffer: ArrayBuffer): Promise<ImportRow[]> {
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // Defval ensures empty cells are included as empty strings to maintain column consistency
    return XLSX.utils.sheet_to_json<ImportRow>(worksheet, { defval: "" });
  },

  /**
   * Validates parsed rows based on standard ERP rules.
   */
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
        rowIndex: index + 1, // 1-based row index for user friendliness
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    });
  },

  /**
   * Generates a summary of the validation results.
   */
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

    return {
      totalRows: results.length,
      validRows,
      invalidRows,
      duplicateProducts,
      missingFields,
    };
  },

  /**
   * Imports validated products to the backend.
   */
  async importProducts(data: any[]): Promise<boolean> {
    const { apiClient, endpoints } = await import('@/src/lib/api');
    
    const rows = data.map(row => ({
      productCode: String(row.productCode || row["Product Code"] || "").trim(),
      mould: String(row.productName || row["Product Name"] || "").trim(),
      productQty: Number(row.currentStock || row["Current Stock"] || row.stock || 0),
    }));

    await apiClient.post(endpoints.import.products, { rows });
    return true; 
  },
  
  /**
   * Generates and triggers download of a CSV file for errors.
   */
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
  }
};
