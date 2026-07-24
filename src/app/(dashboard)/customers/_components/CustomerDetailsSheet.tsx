import { Customer } from '../_services/customerService';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { Button } from '@/src/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/src/components/ui/sheet';
import Link from 'next/link';
import { Edit, ExternalLink, MapPin, Truck, FileText } from 'lucide-react';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { format } from 'date-fns';

interface CustomerDetailsSheetProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomerDetailsSheet({ customer, isOpen, onClose }: CustomerDetailsSheetProps) {
  if (!customer) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-hidden flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl flex items-center gap-2">
            {customer.name}
          </SheetTitle>
          <SheetDescription className="text-base text-muted-foreground flex justify-between items-center">
            <span>{customer.id}</span>
            <CustomerStatusBadge status={customer.status} />
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            {/* Dispatch Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dispatch Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 rounded-lg border p-3 bg-muted/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Total Challans
                  </span>
                  <span className="text-2xl font-bold">{customer.totalChallans}</span>
                </div>
                <div className="flex flex-col gap-1 rounded-lg border p-3 bg-muted/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Last Dispatch
                  </span>
                  <span className="text-lg font-semibold mt-auto">
                    {customer.lastDispatch ? format(new Date(customer.lastDispatch), 'MMM d, yyyy') : 'Never'}
                  </span>
                </div>
                <div className="col-span-2 flex flex-col gap-1 rounded-lg border p-3 bg-muted/30">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> City
                  </span>
                  <span className="text-lg font-semibold">{customer.city}</span>
                </div>
              </div>
            </div>

            {/* Transport Preferences */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Preferences</h3>
              <div className="text-sm space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Preferred Transport</span>
                  <span className="font-medium">{customer.preferredTransport}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Added On</span>
                  <span className="font-medium">{format(new Date(customer.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Internal Notes</h3>
                <div className="text-sm bg-muted/50 p-4 rounded-lg border">
                  {customer.notes}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/20 flex flex-col gap-2">
          <Button className="w-full" asChild>
            {/* Navigates to a placeholder route for Challan Creation */}
            <Link href={`/challans/new?customerId=${customer.id}`}>
              <Truck className="w-4 h-4 mr-2" /> Create Challan
            </Link>
          </Button>
          <div className="flex gap-2 w-full">
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/customers/${customer.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href={`/customers/${customer.id}`}>
                <ExternalLink className="w-4 h-4 mr-2" /> Full Details
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
