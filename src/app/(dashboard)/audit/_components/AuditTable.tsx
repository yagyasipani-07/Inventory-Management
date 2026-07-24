"use client";

import { useAuditLogs, useAuditStore } from "../_hooks/useAudit";
import { format } from "date-fns";
import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getPaginationRowModel 
} from "@tanstack/react-table";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "../_services/auditService";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

export function AuditTable() {
  const { data: logs, isLoading } = useAuditLogs();
  const setSelectedLog = useAuditStore(s => s.setSelectedLog);

  const columns = useMemo(() => [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }: any) => {
        const d = new Date(row.original.timestamp);
        return (
          <div className="flex flex-col">
            <span className="font-medium">{format(d, "MMM dd, yyyy")}</span>
            <span className="text-xs text-muted-foreground">{format(d, "hh:mm a")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }: any) => <span className="font-medium text-foreground">{row.original.user}</span>,
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }: any) => {
        const m = row.original.module;
        return (
          <Badge variant="secondary" className="font-normal">
            {m}
          </Badge>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: any) => {
        const a = row.original.action;
        let variant: "default" | "secondary" | "destructive" | "outline" = "default";
        
        switch (a) {
          case "Delete":
          case "Cancel":
            variant = "destructive";
            break;
          case "Create":
          case "Import":
            variant = "default"; // or success if we had one
            break;
          default:
            variant = "secondary";
        }
        
        return <Badge variant={variant} className="capitalize">{a}</Badge>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div className="flex flex-col max-w-[300px]">
          <span className="truncate font-medium">{row.original.description}</span>
          <span className="truncate text-xs text-muted-foreground">{row.original.entity}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const s = row.original.status;
        const colors = {
          Success: "text-green-500 bg-green-500/10",
          Warning: "text-yellow-500 bg-yellow-500/10",
          Failed: "text-red-500 bg-red-500/10",
          Pending: "text-blue-500 bg-blue-500/10"
        };
        const c = colors[s as keyof typeof colors] || "text-gray-500 bg-gray-500/10";
        return (
          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>
            {s}
          </div>
        );
      },
    },
  ], []);

  const table = useReactTable({
    data: logs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!logs || logs.length === 0) {
    return (
      <EmptyState 
        title="No audit records found"
        description="Adjust your filters to see more results."
        icon={Search}
      />
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-11">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow 
                key={row.id} 
                onClick={() => setSelectedLog(row.original as AuditLog)}
                className="cursor-pointer transition-colors hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
