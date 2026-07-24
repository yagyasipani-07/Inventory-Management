import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Users, Plus } from "lucide-react";

export const metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer directory and contact information"
      >
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Customer
        </button>
      </PageHeader>

      <EmptyState
        icon={Users}
        title="No customers yet"
        description="Add your first customer to start managing their information and creating dispatch challans for them."
        action={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Add Your First Customer
          </button>
        }
      />
    </div>
  );
}
