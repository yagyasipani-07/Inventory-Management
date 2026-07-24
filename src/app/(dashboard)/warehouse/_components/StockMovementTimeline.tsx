import { StockMovement } from '../_services/warehouseService';
import { PackagePlus, PackageMinus, Package } from 'lucide-react';
import { format } from 'date-fns';

interface StockMovementTimelineProps {
  movements: StockMovement[];
  isLoading?: boolean;
}

export function StockMovementTimeline({ movements, isLoading }: StockMovementTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 py-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="mt-1 h-8 w-8 rounded-full bg-muted flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-3/4 bg-muted rounded" />
              <div className="h-3 w-1/2 bg-muted rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (movements.length === 0) {
    return <div className="text-sm text-muted-foreground py-4 text-center">No recent stock movement.</div>;
  }

  return (
    <div className="space-y-6 py-4">
      {movements.map((movement, index) => {
        const isLast = index === movements.length - 1;
        
        let Icon = Package;
        let iconBg = 'bg-gray-100 text-gray-600';
        
        if (movement.action === 'Increase') {
          Icon = PackagePlus;
          iconBg = 'bg-green-100 text-green-600';
        } else if (movement.action === 'Decrease') {
          Icon = PackageMinus;
          iconBg = 'bg-amber-100 text-amber-600';
        } else if (movement.action === 'Initial') {
          Icon = Package;
          iconBg = 'bg-blue-100 text-blue-600';
        }

        return (
          <div key={movement.id} className="relative flex gap-4">
            {!isLast && (
              <span 
                className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border" 
                aria-hidden="true"
              />
            )}
            <div className={`relative mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconBg} ring-8 ring-background`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex min-w-0 flex-1 justify-between gap-4 pt-1.5">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {movement.action} <span className="text-muted-foreground font-normal">by</span> {movement.user}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {movement.reason}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <p className={`text-sm font-semibold ${
                  movement.action === 'Increase' ? 'text-green-600' :
                  movement.action === 'Decrease' ? 'text-amber-600' :
                  'text-foreground'
                }`}>
                  {movement.action === 'Decrease' ? '-' : '+'}{movement.quantity}
                </p>
                <time className="text-xs text-muted-foreground mt-1 block">
                  {format(new Date(movement.date), 'MMM d, h:mm a')}
                </time>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
