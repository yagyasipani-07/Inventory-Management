import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { exportService, ExportConfig } from '../_services/exportService';

export const useExecuteExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const executeExport = async (config: ExportConfig, data: any[]) => {
    if (!data || data.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    setIsExporting(true);

    // Yield to the UI once before starting heavy work
    setTimeout(async () => {
      try {
        const filename = `${config.dataset.toLowerCase().replace(/ /g, "-")}-${format(new Date(), "yyyy-MM-dd")}`;
        
        if (config.format === "csv") {
          exportService.downloadCSV(data, filename);
        } else if (config.format === "pdf") {
          await exportService.downloadPDF(data, filename, config.dataset);
        } else {
          await exportService.downloadExcel(data, filename, config.dataset);
        }
        
        toast.success(`${config.dataset} exported successfully.`);
      } catch (error) {
        console.error(error);
        toast.error("Export failed.");
      } finally {
        setIsExporting(false);
      }
    }, 50);
  };

  return { executeExport, isExporting };
};
