import { Table } from '@tanstack/react-table';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Download, X, SlidersHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

interface InventoryToolbarProps<TData> {
  table: Table<TData>;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onExportPdf: () => void;
}

export function InventoryToolbar<TData>({
  table,
  searchQuery,
  onSearchChange,
  onExportPdf,
}: InventoryToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || searchQuery !== '';

  return (
    <div className="flex items-center justify-between sticky top-0 z-10 bg-background pb-4 pt-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter products..."
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-9 w-[150px] lg:w-[350px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onSearchChange('');
            }}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="outline" size="sm" className="ml-auto h-9" onClick={onExportPdf}>
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden h-9 lg:flex">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
