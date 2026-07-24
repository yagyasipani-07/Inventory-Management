import { Search, RefreshCw, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

interface CustomerToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  cityFilter: string;
  onCityFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  uniqueCities: string[];
}

export function CustomerToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cityFilter,
  onCityFilterChange,
  onRefresh,
  isRefreshing,
  uniqueCities,
}: CustomerToolbarProps) {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || cityFilter !== 'all';

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onCityFilterChange('all');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 -mx-1 px-1">
      <div className="flex flex-1 items-center space-x-2 w-full sm:max-w-[600px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, city, or transport..."
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="New">New</SelectItem>
          </SelectContent>
        </Select>

        <Select value={cityFilter} onValueChange={onCityFilterChange}>
          <SelectTrigger className="w-[140px] sm:w-[160px] bg-background">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {uniqueCities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
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
      </div>
    </div>
  );
}
