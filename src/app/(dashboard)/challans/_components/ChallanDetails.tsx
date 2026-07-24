'use client';

import { useChallan, useUpdateChallanStatus } from '../_hooks/useChallans';
import { ChallanStatusBadge } from './ChallanStatusBadge';
import { ChallanTimeline } from './ChallanTimeline';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { MapPin, Truck, Calendar, User, Printer, Edit, PackageCheck, Send, CheckCircle2, Copy } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ChallanStatus } from '../_services/challanService';
import { toast } from 'sonner';

interface ChallanDetailsProps {
  id: string;
}

export function ChallanDetails({ id }: ChallanDetailsProps) {
  const { data: challan, isLoading, error } = useChallan(id);
  const updateStatus = useUpdateChallanStatus();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading details...</div>;
  if (error || !challan) return <div className="p-8 text-center text-destructive">Error loading challan details.</div>;

  const handleStatusChange = async (newStatus: ChallanStatus) => {
    try {
      await updateStatus.mutateAsync({ id: challan.id, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const totalAmount = challan.items.reduce((sum, item) => {
    const amount = Number(item.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{challan.challanNumber}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            Created on {format(new Date(challan.createdAt), 'MMMM d, yyyy')}
            <ChallanStatusBadge status={challan.status} />
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {challan.status === 'Draft' && (
            <Button variant="outline" asChild>
              <Link href={`/challans/${challan.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={() => window.open(`/challans/${challan.id}/print`, '_blank')}>
            <Printer className="h-4 w-4 mr-2" /> Print
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" /> Duplicate
          </Button>
          
          {/* Status Progression Actions */}
          {challan.status === 'Draft' && (
            <Button onClick={() => handleStatusChange('Approved')}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
            </Button>
          )}
          {challan.status === 'Approved' && (
            <Button onClick={() => handleStatusChange('Ready')}>
              <PackageCheck className="h-4 w-4 mr-2" /> Mark Ready
            </Button>
          )}
          {challan.status === 'Ready' && (
            <Button onClick={() => handleStatusChange('Dispatched')}>
              <Send className="h-4 w-4 mr-2" /> Dispatch Now
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content: 2 columns wide on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Product Description</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challan.items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-muted-foreground">{item.thickness} • {item.size}</div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{item.quantity}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.rate || '-'}</TableCell>
                      <TableCell className="text-right font-medium">{item.amount || '-'}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={2} className="text-right">Total:</TableCell>
                    <TableCell className="text-right">{challan.totalQuantity}</TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-right">₹{totalAmount.toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Status progression of this challan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-4">
                <ChallanTimeline challan={challan} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: 1 column wide on large screens */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">{challan.customerName}</div>
                  <div className="text-sm text-muted-foreground">ID: {challan.customerId}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                {challan.city}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispatch Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Transport:</span> {challan.transport || 'Not specified'}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Dispatch Date:</span>{' '}
                {challan.dispatchDate ? format(new Date(challan.dispatchDate), 'MMM d, yyyy') : 'Pending'}
              </div>
            </CardContent>
          </Card>

          {challan.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes & Remarks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{challan.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
