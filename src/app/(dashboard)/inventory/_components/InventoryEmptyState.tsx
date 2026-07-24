import { Button } from '@/src/components/ui/button';
import { PackageX } from 'lucide-react';
import Link from 'next/link';

export function InventoryEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] border border-dashed rounded-xl bg-muted/20">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <PackageX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight mb-2">No Products Found</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Start by creating your first inventory item or clear your current filters if you are searching.
      </p>
      <Button asChild>
        <Link href="/inventory/new">Add Product</Link>
      </Button>
    </div>
  );
}
