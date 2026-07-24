import { PageHeader } from "@/components/shared/page-header";
import { ChallanClient } from "./_components/ChallanClient";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Dispatch Challans | Paras Plywoods ERP" };

export default function ChallansPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch Challans"
        description="Manage warehouse dispatch operations."
      >
        <Link 
          href="/challans/new"
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          New Challan
        </Link>
      </PageHeader>

      <ChallanClient />
    </div>
  );
}
