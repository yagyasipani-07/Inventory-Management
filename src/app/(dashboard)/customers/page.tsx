import { PageHeader } from "@/components/shared/page-header";
import { CustomerClient } from "./_components/CustomerClient";
import Link from "next/link";
import { Plus } from "lucide-react";

export const metadata = { title: "Customers | Paras Plywoods ERP" };

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customers for warehouse dispatch operations."
      >
        <Link 
          href="/customers/new" 
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Add Customer
        </Link>
      </PageHeader>

      <CustomerClient />
    </div>
  );
}
