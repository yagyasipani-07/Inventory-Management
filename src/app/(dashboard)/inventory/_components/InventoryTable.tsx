'use client';

import { useState, useMemo } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Product } from '../_services/inventoryService';
import { InventoryToolbar } from './InventoryToolbar';
import { InventoryPagination } from './InventoryPagination';
import { Button } from '@/src/components/ui/button';
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2, ArrowRightLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import Link from 'next/link';
import { printPdfReport } from '@/src/lib/export/printPdf';

interface InventoryTableProps {
  data: Product[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onAdjustStock: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function InventoryTable({ data, searchQuery, onSearchChange, onAdjustStock, onDelete }: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.photoUrl ? (
            <img src={row.original.photoUrl} alt="" className="h-10 w-10 rounded-md border object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-md border bg-muted" />
          )}
          <div className="font-medium whitespace-nowrap">{row.getValue('code')}</div>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="min-w-[200px]">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'thickness',
      header: 'Thickness',
      cell: ({ row }) => <div>{row.getValue('thickness')}</div>,
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => <div>{row.getValue('size')}</div>,
    },
    {
      accessorKey: 'currentStock',
      header: () => <div className="text-right">Current Stock</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue('currentStock')}
        </div>
      ),
    },
    {
      accessorKey: 'availableStock',
      header: () => <div className="text-right">Available</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium text-emerald-600 dark:text-emerald-400">
          {row.getValue('availableStock')}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
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
                <Link href={`/inventory/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/inventory/${product.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAdjustStock(product)}>
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Adjust Stock
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(product)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [onAdjustStock, onDelete]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleExportPdf = () => {
    const rows = table.getFilteredRowModel().rows.map(({ original }) => ({
      Code: original.code,
      Name: original.name,
      Thickness: original.thickness,
      Size: original.size,
      'Current Stock': original.currentStock,
      'Available Stock': original.availableStock,
      'Minimum Stock': original.minStock,
      Unit: original.unit,
    }));

    printPdfReport('Inventory Stock Report', rows, `inventory-stock-${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="space-y-4">
      <InventoryToolbar 
        table={table} 
        onExportPdf={handleExportPdf}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <InventoryPagination table={table} />
    </div>
  );
}
