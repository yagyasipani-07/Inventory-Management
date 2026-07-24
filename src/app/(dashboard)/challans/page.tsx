import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText, Plus } from "lucide-react";

export const metadata = { title: "Dispatch Challans" };

export default function ChallansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch Challans"
        description="Create, track, and manage dispatch challans for outgoing goods"
      >
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Challan
        </button>
      </PageHeader>

      <EmptyState
        icon={FileText}
        title="No challans yet"
        description="Create your first dispatch challan to track outgoing goods. Each challan records customer, products, quantities, and dispatch details."
        action={
          <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
            <Plus className="h-4 w-4" strokeWidth={2} />
            Create First Challan
          </button>
        }
      />
    </div>
  );
}
