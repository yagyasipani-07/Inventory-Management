import { create } from "zustand";
import { ImportRow, ValidationResult, ImportSummary, importService } from "../_services/importService";
import { toast } from "sonner";

export type ImportPhase = "SELECT_FILE" | "PARSING" | "VALIDATION" | "READY" | "IMPORTING" | "SUCCESS";

interface ImportState {
  phase: ImportPhase;
  file: File | null;
  importType: string;
  rows: ImportRow[];
  validationResults: ValidationResult[];
  summary: ImportSummary | null;
  
  setImportType: (type: string) => void;
  reset: () => void;
  handleFileUpload: (file: File) => Promise<void>;
  confirmImport: () => Promise<void>;
  downloadErrorReport: () => void;
}

export const useImport = create<ImportState>((set, get) => ({
  phase: "SELECT_FILE",
  file: null,
  importType: "Inventory",
  rows: [],
  validationResults: [],
  summary: null,

  setImportType: (type) => set({ importType: type }),
  
  reset: () => set({ 
    phase: "SELECT_FILE", 
    file: null, 
    rows: [], 
    validationResults: [], 
    summary: null 
  }),

  handleFileUpload: async (file: File) => {
    set({ file, phase: "PARSING" });
    try {
      const fileData = await importService.uploadFile(file);
      let rows: ImportRow[] = [];

      if (file.name.toLowerCase().endsWith(".csv")) {
        rows = await importService.parseCSV(fileData as string);
      } else {
        rows = await importService.parseExcel(fileData as ArrayBuffer);
      }

      set({ phase: "VALIDATION" });
      
      const validationResults = importService.validateRows(rows);
      const summary = importService.getSummary(validationResults);
      
      set({ rows, validationResults, summary, phase: "READY" });

      if (summary.invalidRows > 0) {
        toast.warning(`Found ${summary.invalidRows} invalid rows. Please review.`);
      } else {
        toast.success(`Successfully parsed ${summary.validRows} valid rows.`);
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to parse the file. Please ensure it's a valid CSV or Excel file.");
      set({ phase: "SELECT_FILE", file: null });
    }
  },

  confirmImport: async () => {
    const { validationResults, summary } = get();
    if (!summary || summary.validRows === 0) {
      toast.error("No valid rows to import.");
      return;
    }

    set({ phase: "IMPORTING" });
    try {
      const validRows = validationResults.filter(r => r.isValid).map(r => r.row);
      await importService.importProducts(validRows);
      
      set({ phase: "SUCCESS" });
      toast.success("Import completed successfully.");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during import.");
      set({ phase: "READY" });
    }
  },

  downloadErrorReport: () => {
    const { validationResults } = get();
    importService.downloadErrorReport(validationResults);
  }
}));
