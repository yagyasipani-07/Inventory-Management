import { create } from "zustand";
import { ExportConfig, ExportDataset, ExportFormat, exportService } from "../_services/exportService";
import { toast } from "sonner";
import { format } from "date-fns";

interface ExportState {
  config: ExportConfig;
  isExporting: boolean;
  previewData: any[];
  isPreviewLoading: boolean;
  categories: string[];
  isCategoriesLoading: boolean;

  setDataset: (dataset: ExportDataset) => void;
  setFormat: (format: ExportFormat) => void;
  setDateRange: (range: { from: Date; to: Date } | null) => void;
  setStatus: (status: string | null) => void;
  setCategory: (category: string | null) => void;
  
  loadCategories: () => Promise<void>;
  loadPreview: () => Promise<void>;
  executeExport: () => Promise<void>;
}

export const useExport = create<ExportState>((set, get) => ({
  config: {
    dataset: "Warehouse Stock",
    format: "excel",
    dateRange: null,
    status: null,
    category: null,
  },
  isExporting: false,
  previewData: [],
  isPreviewLoading: false,
  categories: [],
  isCategoriesLoading: false,

  setDataset: (dataset) => { 
    set((state) => ({
      config: { 
        ...state.config, 
        dataset,
        // Reset category filter when switching to a dataset that doesn't have categories
        category: (dataset === "Inventory" || dataset === "Warehouse Stock") ? state.config.category : null,
      } 
    })); 
    get().loadPreview(); 
  },
  setFormat: (format) => set((state) => ({ config: { ...state.config, format } })),
  setDateRange: (dateRange) => { set((state) => ({ config: { ...state.config, dateRange } })); get().loadPreview(); },
  setStatus: (status) => { set((state) => ({ config: { ...state.config, status } })); get().loadPreview(); },
  setCategory: (category) => { set((state) => ({ config: { ...state.config, category } })); get().loadPreview(); },

  loadCategories: async () => {
    set({ isCategoriesLoading: true });
    try {
      const categories = await exportService.fetchCategories();
      set({ categories, isCategoriesLoading: false });
    } catch (error) {
      console.error(error);
      set({ categories: [], isCategoriesLoading: false });
    }
  },

  loadPreview: async () => {
    const { config } = get();
    set({ isPreviewLoading: true });
    try {
      const data = await exportService.fetchData(config);
      set({ previewData: data, isPreviewLoading: false });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load export preview.");
      set({ isPreviewLoading: false, previewData: [] });
    }
  },

  executeExport: async () => {
    const { config, previewData } = get();
    
    if (previewData.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    set({ isExporting: true });
    
    // Yield to the UI once before starting work
    setTimeout(async () => {
      try {
        const filename = `${config.dataset.toLowerCase().replace(/ /g, "-")}-${format(new Date(), "yyyy-MM-dd")}`;
        
        if (config.format === "csv") {
          exportService.downloadCSV(previewData, filename);
        } else if (config.format === "pdf") {
          await exportService.downloadPDF(previewData, filename, config.dataset);
        } else {
          await exportService.downloadExcel(previewData, filename, config.dataset);
        }
        
        toast.success(`${config.dataset} exported successfully.`);
      } catch (error) {
        console.error(error);
        toast.error("Export failed.");
      } finally {
        set({ isExporting: false });
      }
    }, 50);
  },
}));
