import { create } from "zustand";
import { ExportConfig, ExportDataset, ExportFormat } from "../_services/exportService";

interface ExportState {
  config: ExportConfig;

  setDataset: (dataset: ExportDataset) => void;
  setFormat: (format: ExportFormat) => void;
  setDateRange: (range: { from: Date; to: Date } | null) => void;
  setStatus: (status: string | null) => void;
  setCategory: (category: string | null) => void;
}

export const useExport = create<ExportState>((set) => ({
  config: {
    dataset: "Warehouse Stock",
    format: "excel",
    dateRange: null,
    status: null,
    category: null,
  },

  setDataset: (dataset) => { 
    set((state) => ({
      config: { 
        ...state.config, 
        dataset,
        // Reset category filter when switching to a dataset that doesn't have categories
        category: (dataset === "Inventory" || dataset === "Warehouse Stock") ? state.config.category : null,
      } 
    })); 
  },
  setFormat: (format) => set((state) => ({ config: { ...state.config, format } })),
  setDateRange: (dateRange) => set((state) => ({ config: { ...state.config, dateRange } })),
  setStatus: (status) => set((state) => ({ config: { ...state.config, status } })),
  setCategory: (category) => set((state) => ({ config: { ...state.config, category } })),
}));
