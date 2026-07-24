'use client';

import { PageHeader } from "@/components/shared/page-header";
import { CustomerForm } from "../_components/CustomerForm";
import { useCreateCustomer } from "../_hooks/useCustomers";
import { CustomerFormData } from "../_services/customerService";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewCustomerPage() {
  const router = useRouter();
  const createCustomer = useCreateCustomer();

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await createCustomer.mutateAsync(data);
      router.push('/customers');
    } catch (error) {
      toast.error('Failed to create customer');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link 
          href="/customers"
          className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <PageHeader
          title="New Customer"
          description="Add a new customer to the directory for dispatch operations."
        />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <CustomerForm 
          onSubmit={handleSubmit}
          onCancel={() => router.push('/customers')}
          isSubmitting={createCustomer.isPending}
        />
      </div>
    </div>
  );
}
