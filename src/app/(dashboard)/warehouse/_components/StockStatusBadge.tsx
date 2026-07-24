import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/lib/utils';

interface StockStatusBadgeProps {
  available: number;
  min: number;
  className?: string;
}

export function StockStatusBadge({ available, min, className }: StockStatusBadgeProps) {
  if (available === 0) {
    return (
      <Badge variant="secondary" className={cn('bg-gray-100 text-gray-700 hover:bg-gray-200', className)}>
        Out of Stock
      </Badge>
    );
  }

  if (available < min) {
    return (
      <Badge variant="destructive" className={cn('bg-red-100 text-red-700 hover:bg-red-200 border-red-200', className)}>
        Critical
      </Badge>
    );
  }

  if (available === min) {
    return (
      <Badge variant="outline" className={cn('bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200', className)}>
        Warning
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn('bg-green-50 text-green-700 hover:bg-green-100 border-green-200', className)}>
      Healthy
    </Badge>
  );
}
