"use client";

import { Button } from "@/src/components/ui/button";
import { Download } from "lucide-react";
import { importService } from "../_services/importService";
import { useImport } from "../_hooks/useImport";

export function ImportTemplateActions() {
  const { importType } = useImport();

  const handleDownload = (format: "csv" | "excel") => {
    if (importType === "Warehouse Stock") {
      importService.downloadWarehouseTemplate(format);
    } else {
      importService.downloadInventoryTemplate(format);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-sm font-semibold">Import Template</h3>
        <p className="text-sm text-muted-foreground">
          Use this sample format to feed {importType.toLowerCase()} data through the import function.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleDownload("csv")}>
          <Download className="mr-2 h-4 w-4" />
          CSV Template
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleDownload("excel")}>
          <Download className="mr-2 h-4 w-4" />
          Excel Template
        </Button>
      </div>
    </div>
  );
}
