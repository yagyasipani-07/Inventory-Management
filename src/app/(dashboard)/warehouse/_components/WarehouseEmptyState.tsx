import { Warehouse as WarehouseIcon } from 'lucide-react';

export function WarehouseEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-card border-dashed">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <WarehouseIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight">No Stock Available</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm">
        Import products to populate warehouse inventory. Stock will appear here once added.
      </p>
    </div>
  );
}
