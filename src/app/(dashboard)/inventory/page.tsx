import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Package, Plus } from "lucide-react";

export const metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Manage your product catalog, categories, and stock levels"
      >
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Product
        </button>
      </PageHeader>

      <EmptyState
        icon={Package}
        title="No products yet"
        description="Start building your inventory by adding your first product. You can also import products in bulk via the Import page."
        action={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Your First Product
          </button>
        }
      />
    </div>
  );
}
