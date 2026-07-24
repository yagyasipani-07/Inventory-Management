"use client";

import { useExport } from "../_hooks/useExport";
import { Loader2, Table2 } from "lucide-react";
import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

export function ExportPreview() {
  const { previewData, isPreviewLoading, config } = useExport();

  const columns = useMemo<ColumnDef<any>[]>(() => {
    if (previewData.length === 0) return [];
    
    // Extract column keys from the first row of data
    const firstRowKeys = Object.keys(previewData[0]);
    
    return firstRowKeys.map((key) => ({
      accessorFn: (row: any) => row[key],
      id: key,
      header: key,
      cell: (info: any) => info.getValue(),
    }));
  }, [previewData]);

  const table = useReactTable({
    data: previewData.slice(0, 5), // Only show first 5 rows in preview
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPreviewLoading) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50 mb-2" />
        <p>Loading preview data...</p>
      </div>
    );
  }

  if (previewData.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground">
        <Table2 className="h-8 w-8 mb-2 opacity-50" />
        <p>No data found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">Data Preview</h3>
        <p className="text-xs text-muted-foreground">
          Showing 5 of {previewData.length} total rows
        </p>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-4 py-2.5 text-left font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border transition-colors hover:bg-muted/50 last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
