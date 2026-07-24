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
import { ProductStatusBadge } from './ProductStatusBadge';
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

interface InventoryTableProps {
  data: Product[];
  onAdjustStock: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function InventoryTable({ data, onAdjustStock, onDelete }: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Product>[] = useMemo(() => [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => <div className="font-medium whitespace-nowrap">{row.getValue('code')}</div>,
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
      accessorKey: 'reservedStock',
      header: () => <div className="text-right">Reserved</div>,
      cell: ({ row }) => (
        <div className="text-right text-muted-foreground">
          {row.getValue('reservedStock')}
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
      id: 'status',
      accessorFn: (row) => row.currentStock,
      header: 'Status',
      cell: ({ row }) => <ProductStatusBadge currentStock={row.getValue('status')} />,
      filterFn: (row, id, value) => {
        const stock = row.getValue(id) as number;
        if (value === 'healthy') return stock > 100;
        if (value === 'low') return stock >= 30 && stock <= 100;
        if (value === 'critical') return stock < 30;
        return true;
      },
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

  return (
    <div className="space-y-4">
      <InventoryToolbar table={table} />
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
