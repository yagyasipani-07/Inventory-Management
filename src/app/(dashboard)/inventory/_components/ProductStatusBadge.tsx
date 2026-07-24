import { Badge } from '@/src/components/ui/badge';

interface ProductStatusBadgeProps {
  currentStock: number;
}

export function ProductStatusBadge({ currentStock }: ProductStatusBadgeProps) {
  if (currentStock < 30) {
    return (
      <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
        Critical
      </Badge>
    );
  }

  if (currentStock <= 100) {
    return (
      <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-600">
        Low
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
      Healthy
    </Badge>
  );
}
