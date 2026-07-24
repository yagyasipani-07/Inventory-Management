import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/lib/utils';
import { CustomerStatus } from '../_services/customerService';

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  className?: string;
}

export function CustomerStatusBadge({ status, className }: CustomerStatusBadgeProps) {
  if (status === 'Inactive') {
    return (
      <Badge variant="secondary" className={cn('bg-gray-100 text-gray-700 hover:bg-gray-200', className)}>
        Inactive
      </Badge>
    );
  }

  if (status === 'New') {
    return (
      <Badge variant="outline" className={cn('bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200', className)}>
        New
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={cn('bg-green-50 text-green-700 hover:bg-green-100 border-green-200', className)}>
      Active
    </Badge>
  );
}
