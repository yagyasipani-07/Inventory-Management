import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Download, Plus, Upload } from 'lucide-react';

export function InventoryHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage warehouse products and inventory levels.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button size="sm" asChild>
          <Link href="/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
    </div>
  );
}
