import { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Challan } from '../_services/challanService';
import { ChallanStatusBadge } from './ChallanStatusBadge';
import { Button } from '@/src/components/ui/button';
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, MoreHorizontal, Edit, Trash2, Printer } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { format } from 'date-fns';
import Link from 'next/link';

interface ChallanTableProps {
  data: Challan[];
  onDelete: (challan: Challan) => void;
}

export function ChallanTable({ data, onDelete }: ChallanTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Challan>[]>(
    () => [
      {
        accessorKey: 'challanNumber',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="-ml-4 font-semibold"
            >
              Challan Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => <span className="font-medium text-foreground">{row.getValue('challanNumber')}</span>,
      },
      {
        accessorKey: 'customerName',
        header: 'Customer',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.getValue('customerName')}</span>
            <span className="text-xs text-muted-foreground">{row.original.city}</span>
          </div>
        ),
      },
      {
        accessorKey: 'dispatchDate',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className="-ml-4 font-semibold"
            >
              Dispatch Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const dateStr = row.getValue('dispatchDate') as string | null;
          if (!dateStr) return <span className="text-muted-foreground italic">Pending</span>;
          return (
            <span className="text-muted-foreground">
              {format(new Date(dateStr), 'MMM d, yyyy')}
            </span>
          );
        },
      },
      {
        accessorKey: 'items',
        header: 'Products',
        cell: ({ row }) => {
          const items = row.original.items;
          const count = items.length;
          const label = count === 1 ? '1 product' : `${count} products`;
          return <span className="text-muted-foreground">{label}</span>;
        }
      },
      {
        accessorKey: 'totalQuantity',
        header: 'Total Qty',
        cell: ({ row }) => {
          const total = row.getValue('totalQuantity') as number;
          return <span className="font-medium">{total.toLocaleString()}</span>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <ChallanStatusBadge status={row.getValue('status')} />
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const challan = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                asChild
              >
                <Link href={`/challans/${challan.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/challans/${challan.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  {challan.status === 'Draft' && (
                    <DropdownMenuItem asChild>
                      <Link href={`/challans/${challan.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Challan
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.open(`/challans/${challan.id}/print`, '_blank')}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(challan)}
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Challan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No challans found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground flex-1">
          Showing {table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
