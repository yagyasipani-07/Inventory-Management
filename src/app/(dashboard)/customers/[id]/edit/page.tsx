'use client';

import { PageHeader } from "@/components/shared/page-header";
import { CustomerForm } from "../../_components/CustomerForm";
import { useCustomer, useUpdateCustomer } from "../../_hooks/useCustomers";
import { CustomerFormData } from "../../_services/customerService";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { use } from "react";
import { CustomerError } from "../../_components/CustomerError";

export default function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;
  
  const { data: customer, isLoading, error, refetch } = useCustomer(customerId);
  const updateCustomer = useUpdateCustomer();

  const handleSubmit = async (data: CustomerFormData) => {
    try {
      await updateCustomer.mutateAsync({ id: customerId, data });
      router.push('/customers');
    } catch (error) {
      toast.error('Failed to update customer');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !customer) {
    return <CustomerError onRetry={() => refetch()} message="Failed to load customer details." />;
  }

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
          title={`Edit ${customer.name}`}
          description="Update customer details and dispatch preferences."
        />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <CustomerForm 
          initialData={customer}
          onSubmit={handleSubmit}
          onCancel={() => router.push('/customers')}
          isSubmitting={updateCustomer.isPending}
        />
      </div>
    </div>
  );
}
