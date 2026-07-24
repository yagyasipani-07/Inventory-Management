"use client";

import { RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuditHeader({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every important action performed across the ERP.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
        <Button variant="default" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>
    </div>
  );
}
