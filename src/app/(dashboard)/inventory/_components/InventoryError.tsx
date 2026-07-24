import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface InventoryErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function InventoryError({ 
  message = 'Failed to load inventory data.', 
  onRetry 
}: InventoryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] p-6 text-center border rounded-xl bg-destructive/10 border-destructive/20">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h3 className="text-lg font-semibold text-destructive mb-2">Something went wrong</h3>
      <p className="text-sm text-destructive/80 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={() => onRetry()} className="border-destructive/30 hover:bg-destructive/10 text-destructive">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
}
