import { Search, Download, RefreshCw, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

interface WarehouseToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  zoneFilter: string;
  onZoneFilterChange: (value: string) => void;
  onExport: () => void;
  onRefresh: () => void;
  isExporting?: boolean;
  isRefreshing?: boolean;
}

export function WarehouseToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  zoneFilter,
  onZoneFilterChange,
  onExport,
  onRefresh,
  isExporting,
  isRefreshing,
}: WarehouseToolbarProps) {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || zoneFilter !== 'all';

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onZoneFilterChange('all');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 -mx-1 px-1">
      <div className="flex flex-1 items-center space-x-2 w-full sm:max-w-[600px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search code, name, dimensions, or location..."
            className="pl-9 bg-background w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[140px] sm:w-[160px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="healthy">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select value={zoneFilter} onValueChange={onZoneFilterChange}>
          <SelectTrigger className="w-[140px] sm:w-[160px] bg-background">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Zones</SelectItem>
            <SelectItem value="a">Zone A</SelectItem>
            <SelectItem value="b">Zone B</SelectItem>
            <SelectItem value="c">Zone C</SelectItem>
            <SelectItem value="d">Zone D</SelectItem>
          </SelectContent>
        </Select>

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
          Export Excel
        </Button>
      </div>
    </div>
  );
}
