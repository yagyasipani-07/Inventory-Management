import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Warehouse as WarehouseIcon } from "lucide-react";

export const metadata = { title: "Warehouse" };

export default function WarehousePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Stock"
        description="Live warehouse stock management and rack-level tracking"
      />

      <EmptyState
        icon={WarehouseIcon}
        title="No warehouse data"
        description="Warehouse stock levels will appear here once products are added to inventory and stock is allocated to your warehouse locations."
      />
    </div>
  );
}
