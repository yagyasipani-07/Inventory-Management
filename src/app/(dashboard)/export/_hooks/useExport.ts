import { create } from "zustand";
import { ExportConfig, ExportDataset, ExportFormat, exportService } from "../_services/exportService";
import { toast } from "sonner";
import { format } from "date-fns";

interface ExportState {
  config: ExportConfig;
  isExporting: boolean;
  previewData: any[];
  isPreviewLoading: boolean;

  setDataset: (dataset: ExportDataset) => void;
  setFormat: (format: ExportFormat) => void;
  setDateRange: (range: { from: Date; to: Date } | null) => void;
  setStatus: (status: string | null) => void;
  setGroupBy: (groupBy: "category" | "product_name" | "none") => void;
  
  loadPreview: () => Promise<void>;
  executeExport: () => Promise<void>;
}

export const useExport = create<ExportState>((set, get) => ({
  config: {
    dataset: "Warehouse Stock",
    format: "excel",
    dateRange: null,
    status: null,
    groupBy: "none",
  },
  isExporting: false,
  previewData: [],
  isPreviewLoading: false,

  setDataset: (dataset) => set((state) => ({ config: { ...state.config, dataset } })),
  setFormat: (format) => set((state) => ({ config: { ...state.config, format } })),
  setDateRange: (dateRange) => set((state) => ({ config: { ...state.config, dateRange } })),
  setStatus: (status) => set((state) => ({ config: { ...state.config, status } })),
  setGroupBy: (groupBy) => set((state) => ({ config: { ...state.config, groupBy } })),

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
    
    try {
      const filename = `${config.dataset.toLowerCase().replace(" ", "-")}-${format(new Date(), "yyyy-MM-dd")}`;
      
      if (config.format === "csv") {
        exportService.downloadCSV(previewData, filename);
      } else if (config.format === "pdf") {
        exportService.downloadPDF(previewData, filename, config.dataset);
      } else {
        exportService.downloadExcel(previewData, filename, config.dataset);
      }
      
      toast.success(`${config.dataset} exported successfully.`);
    } catch (error) {
      console.error(error);
      toast.error("Export failed.");
    } finally {
      set({ isExporting: false });
    }
  },
}));
