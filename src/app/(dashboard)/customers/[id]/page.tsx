'use client';

import { PageHeader } from "@/components/shared/page-header";
import { useCustomer } from "../_hooks/useCustomers";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, FileText, MapPin, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { CustomerError } from "../_components/CustomerError";
import { CustomerStatusBadge } from "../_components/CustomerStatusBadge";
import { format } from "date-fns";
import { Button } from "@/src/components/ui/button";

export default function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.id;
  
  const { data: customer, isLoading, error, refetch } = useCustomer(customerId);

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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/customers"
            className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <PageHeader
            title={customer.name}
            description={customer.id}
          />
          <div className="mt-1">
            <CustomerStatusBadge status={customer.status} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/customers/${customer.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/challans/new?customerId=${customer.id}`}>
              <Truck className="w-4 h-4 mr-2" /> Create Challan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Contact & Location</h3>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium text-foreground">City</p>
                <p className="text-muted-foreground">{customer.city}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Preferences</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Preferred Transport</span>
                <span className="font-medium">{customer.preferredTransport}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Added On</span>
                <span className="font-medium">{format(new Date(customer.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dispatch History</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 rounded-lg border p-4 bg-muted/30">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Total Challans
                </span>
                <span className="text-3xl font-bold">{customer.totalChallans}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-lg border p-4 bg-muted/30">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Last Dispatch
                </span>
                <span className="text-xl font-semibold mt-auto">
                  {customer.lastDispatch ? format(new Date(customer.lastDispatch), 'MMM d, yyyy') : 'Never'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Recent Challans</span>
              <Button variant="link" className="px-0">View All</Button>
            </div>
            <div className="text-sm text-center p-4 bg-muted/50 rounded border border-dashed">
              Challan history will be integrated in Phase 5.
            </div>
          </div>

          {customer.notes && (
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Internal Notes</h3>
              <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
