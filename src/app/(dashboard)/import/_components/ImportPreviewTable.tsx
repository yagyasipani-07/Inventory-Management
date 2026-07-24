"use client";

import { useMemo, useState } from "react";
import { useImport } from "../_hooks/useImport";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ValidationResult } from "../_services/importService";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export function ImportPreviewTable() {
  const { validationResults, phase } = useImport();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<ValidationResult>[]>(() => {
    if (validationResults.length === 0) return [];
    
    // Extract column keys from the first row of data
    const firstRowKeys = Object.keys(validationResults[0].row);
    
    const dataCols = firstRowKeys.map((key) => ({
      accessorFn: (row: ValidationResult) => row.row[key],
      id: key,
      header: key,
      cell: (info: any) => info.getValue() as string,
    }));

    return [
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const isValid = row.original.isValid;
          return (
            <div className="flex items-center justify-center">
              {isValid ? (
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
            </div>
          );
        },
        size: 50,
      },
      ...dataCols,
      {
        id: "issues",
        header: "Issues",
        cell: ({ row }) => {
          const errors = row.original.errors;
          if (errors.length === 0) return <span className="text-muted-foreground">-</span>;
          return (
            <span className="font-medium text-destructive">
              {errors.join(", ")}
            </span>
          );
        },
      }
    ];
  }, [validationResults]);

  const table = useReactTable({
    data: validationResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  if (phase === "SELECT_FILE" || phase === "PARSING" || validationResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-4 py-3 text-left font-medium"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : "auto" }}
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
                  className={cn(
                    "border-t border-border transition-colors",
                    !row.original.isValid ? "bg-destructive/5 hover:bg-destructive/10" : "hover:bg-muted/50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
        <div>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} rows
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
