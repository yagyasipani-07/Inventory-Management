import { PageHeader } from "@/components/shared/page-header";
import { WarehouseClient } from "./_components/WarehouseClient";

export const metadata = { title: "Warehouse | Paras Plywoods ERP" };

export default function WarehousePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouse Stock"
        description="Live warehouse stock management and rack-level tracking"
      />
      
      <WarehouseClient />
    </div>
  );
}
