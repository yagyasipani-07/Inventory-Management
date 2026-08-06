"use client";

import { useExport } from "../_hooks/useExport";
import { useExportData } from "../_hooks/queries";
import { useExecuteExport } from "../_hooks/useExportActions";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useMemo } from "react";

export function ExportSummary() {
  const config = useExport((state) => state.config);
  const { data = [] } = useExportData(config);
  const { executeExport, isExporting } = useExecuteExport();

  const estSizeKB = useMemo(() => {
    // Rough estimation: ~100 bytes per row
    return ((data.length * 100) / 1024).toFixed(2);
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mt-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Ready to Export</h3>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>{data.length} records</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>Estimated size: {estSizeKB} KB</span>
        </div>
      </div>
      
      <Button
        size="lg"
        onClick={() => executeExport(config, data)}
        disabled={isExporting}
        className="min-w-[140px]"
      >
        {isExporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Export {config.format.toUpperCase()}
          </>
        )}
      </Button>
    </div>
  );
}
