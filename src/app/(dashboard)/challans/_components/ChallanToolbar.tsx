import { Search, RefreshCw, X, Download } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';

interface ChallanToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  uniqueCustomers: string[];
}

export function ChallanToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  customerFilter,
  onCustomerFilterChange,
  onRefresh,
  isRefreshing,
  uniqueCustomers,
}: ChallanToolbarProps) {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || customerFilter !== 'all';

  const handleClearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onCustomerFilterChange('all');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 sticky top-0 bg-background/95 backdrop-blur z-10 -mx-1 px-1">
      <div className="flex flex-1 items-center space-x-2 w-full sm:max-w-[800px]">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challan number, customer..."
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
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Dispatched">Dispatched</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={customerFilter} onValueChange={onCustomerFilterChange}>
          <SelectTrigger className="w-[140px] sm:w-[160px] bg-background">
            <SelectValue placeholder="Customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {uniqueCustomers.map(cust => (
              <SelectItem key={cust} value={cust}>{cust}</SelectItem>
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
        <Button
          variant="outline"
          size="sm"
          className="h-9"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}
