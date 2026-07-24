"use client";

import { useImport } from "../_hooks/useImport";
import { Button } from "@/components/ui/button";
import { Download, Play, RefreshCcw } from "lucide-react";

export function ImportSummaryCards() {
  const { summary, phase, confirmImport, reset, downloadErrorReport } = useImport();

  if (!summary || (phase !== "READY" && phase !== "IMPORTING" && phase !== "SUCCESS")) {
    return null;
  }

  const isImporting = phase === "IMPORTING";
  const isSuccess = phase === "SUCCESS";
  const canImport = summary.validRows > 0 && !isImporting && !isSuccess;
  const hasErrors = summary.invalidRows > 0;

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Ready to Import</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {summary.validRows} rows are ready to be imported into {summary.totalRows} total records.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={reset}
            disabled={isImporting}
          >
            Cancel
          </Button>

          {hasErrors && (
            <Button
              variant="secondary"
              onClick={downloadErrorReport}
              disabled={isImporting}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Error Report
            </Button>
          )}

          {isSuccess ? (
            <Button onClick={reset}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Import Another File
            </Button>
          ) : (
            <Button
              onClick={confirmImport}
              disabled={!canImport}
              className="min-w-[140px]"
            >
              {isImporting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Import Data
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
