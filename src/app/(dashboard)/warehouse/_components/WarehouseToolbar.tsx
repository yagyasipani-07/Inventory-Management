import { Search, Download, RefreshCw, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

interface WarehouseToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  isExporting?: boolean;
  isRefreshing?: boolean;
}

export function WarehouseToolbar({
  searchQuery,
  onSearchChange,
  onExport,
  onRefresh,
  isExporting,
  isRefreshing,
}: WarehouseToolbarProps) {
  const hasActiveFilters = searchQuery !== '';

  const handleClearFilters = () => {
    onSearchChange('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 -mx-1 px-1">
      <div className="flex flex-1 items-center space-x-2 w-full sm:max-w-[600px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by product name..."
            className="pl-9 bg-background w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="h-9 px-2 lg:px-3 text-muted-foreground"
          >
            Clear
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={isExporting}
          className="h-9"
        >
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
