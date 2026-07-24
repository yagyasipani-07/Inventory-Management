import { AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface WarehouseErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function WarehouseError({ 
  message = "Failed to load warehouse data.", 
  onRetry 
}: WarehouseErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-destructive/10 border-destructive/20">
      <AlertCircle className="h-8 w-8 text-destructive mb-4" />
      <h3 className="text-lg font-semibold tracking-tight text-destructive">Error Loading Stock</h3>
      <p className="text-sm text-destructive/80 mt-1 mb-4 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
          Try Again
        </Button>
      )}
    </div>
  );
}
