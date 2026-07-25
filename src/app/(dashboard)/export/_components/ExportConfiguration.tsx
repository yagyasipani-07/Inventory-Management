"use client";

import { useExport } from "../_hooks/useExport";
import { ExportFormat } from "../_services/exportService";
import { cn } from "@/lib/utils";
import { FileSpreadsheet, FileJson, FileText, CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function ExportConfiguration() {
  const { config, setFormat, setStatus, loadPreview } = useExport();

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold tracking-tight mb-6">Export Configuration</h3>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Format Selection */}
        <div className="space-y-4">
          <Label className="text-base">Export Format</Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={() => setFormat("excel")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                config.format === "excel"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-border hover:bg-muted"
              )}
            >
              <FileSpreadsheet className={cn("h-5 w-5", config.format === "excel" ? "text-emerald-500" : "text-muted-foreground")} />
              <span className="font-medium">Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => setFormat("csv")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                config.format === "csv"
                  ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                  : "border-border hover:bg-muted"
              )}
            >
              <FileJson className={cn("h-5 w-5", config.format === "csv" ? "text-blue-500" : "text-muted-foreground")} />
              <span className="font-medium">CSV (.csv)</span>
            </button>
            <button
              onClick={() => setFormat("pdf")}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4 transition-colors",
                config.format === "pdf"
                  ? "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400"
                  : "border-border hover:bg-muted"
              )}
            >
              <FileText className={cn("h-5 w-5", config.format === "pdf" ? "text-rose-500" : "text-muted-foreground")} />
              <span className="font-medium">PDF (.pdf)</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <Label className="text-base">Filters (Mocked for Phase 6)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Date Range</Label>
              <Button variant="outline" className="w-full justify-start text-left font-normal" disabled>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Select range...</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <Select
                value={config.status || "all"}
                onValueChange={(val) => {
                  setStatus(val === "all" ? null : val);
                  loadPreview(); // Reload preview with new filter
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active / In Stock</SelectItem>
                  <SelectItem value="inactive">Inactive / Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
