import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/lib/utils';
import { ChallanStatus } from '../_services/challanService';

interface ChallanStatusBadgeProps {
  status: ChallanStatus;
  className?: string;
}

export function ChallanStatusBadge({ status, className }: ChallanStatusBadgeProps) {
  switch (status) {
    case 'Draft':
      return (
        <Badge variant="secondary" className={cn('bg-gray-100 text-gray-700 hover:bg-gray-200', className)}>
          Draft
        </Badge>
      );
    case 'Approved':
      return (
        <Badge variant="outline" className={cn('bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200', className)}>
          Approved
        </Badge>
      );
    case 'Ready':
      return (
        <Badge variant="outline" className={cn('bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200', className)}>
          Ready
        </Badge>
      );
    case 'Dispatched':
      return (
        <Badge variant="outline" className={cn('bg-green-50 text-green-700 hover:bg-green-100 border-green-200', className)}>
          Dispatched
        </Badge>
      );
    case 'Cancelled':
      return (
        <Badge variant="outline" className={cn('bg-red-50 text-red-700 hover:bg-red-100 border-red-200', className)}>
          Cancelled
        </Badge>
      );
    default:
      return null;
  }
}
