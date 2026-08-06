import { create } from "zustand";
import { ExportConfig, ExportDataset, ExportFormat, exportService, getGroupField } from "../_services/exportService";
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

  setDataset: (dataset) => { 
    set((state) => {
      const groupField = getGroupField(dataset, state.config.groupBy || null);
      return { 
        config: { 
          ...state.config, 
          dataset,
          groupBy: groupField ? state.config.groupBy : "none"
        } 
      };
    }); 
    get().loadPreview(); 
  },
  setFormat: (format) => set((state) => ({ config: { ...state.config, format } })),
  setDateRange: (dateRange) => { set((state) => ({ config: { ...state.config, dateRange } })); get().loadPreview(); },
  setStatus: (status) => { set((state) => ({ config: { ...state.config, status } })); get().loadPreview(); },
  setGroupBy: (groupBy) => { set((state) => ({ config: { ...state.config, groupBy } })); get().loadPreview(); },

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
        let fallbackTriggered = false;
        
        if (config.format === "csv") {
          exportService.downloadCSV(previewData, filename, config.dataset, config.groupBy);
        } else if (config.format === "pdf") {
          fallbackTriggered = await exportService.downloadPDF(previewData, filename, config.dataset, config.groupBy);
        } else {
          fallbackTriggered = await exportService.downloadExcel(previewData, filename, config.dataset, config.groupBy);
        }
        
        if (fallbackTriggered) {
          toast.warning("Too many groups (>20) — using single-sheet grouping instead");
        } else {
          toast.success(`${config.dataset} exported successfully.`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Export failed.");
      } finally {
        set({ isExporting: false });
      }
    }, 50);
  },
}));
