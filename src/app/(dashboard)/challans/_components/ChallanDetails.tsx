'use client';

import { useState } from 'react';
import { useChallan, useUpdateChallanStatus, useUpdateChallanDispatchInfo } from '../_hooks/useChallans';
import { ChallanStatusBadge } from './ChallanStatusBadge';
import { ChallanTimeline } from './ChallanTimeline';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
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
  const updateDispatchInfo = useUpdateChallanDispatchInfo();

  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchDateInput, setDispatchDateInput] = useState('');
  const [transportInput, setTransportInput] = useState('');
  const [transportNameInput, setTransportNameInput] = useState('');
  const [vehicleNumberInput, setVehicleNumberInput] = useState('');

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading details...</div>;
  if (error || !challan) return <div className="p-8 text-center text-destructive">Error loading challan details.</div>;

  const openDispatchModal = () => {
    setDispatchDateInput(challan.dispatchDate ? challan.dispatchDate.split('T')[0] : new Date().toISOString().split('T')[0]);
    setTransportInput(challan.transport || '');
    setTransportNameInput(challan.transportName || '');
    setVehicleNumberInput(challan.vehicleNumber || '');
    setIsDispatchModalOpen(true);
  };

  const handleStatusChange = async (newStatus: ChallanStatus) => {
    try {
      const dDate =
        newStatus === 'Dispatched' && !challan.dispatchDate
          ? new Date().toISOString().split('T')[0]
          : challan.dispatchDate;
      await updateStatus.mutateAsync({ id: challan.id, status: newStatus, dispatchDate: dDate });
      toast.success(`Challan status updated to ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleSaveDispatchInfo = async (markDispatched = false) => {
    try {
      await updateDispatchInfo.mutateAsync({
        id: challan.id,
        dispatchDate: dispatchDateInput || null,
        transport: transportInput || `${transportNameInput} ${vehicleNumberInput}`.trim(),
        status: markDispatched ? 'Dispatched' : undefined,
      });
      setIsDispatchModalOpen(false);
      toast.success(markDispatched ? 'Challan marked as Dispatched!' : 'Dispatch info updated');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to save dispatch info');
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
        
        <div className="flex flex-wrap items-center gap-2">
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
          {(challan.status === 'Approved' || challan.status === 'Dispatched') && (
            <Button variant="outline" onClick={openDispatchModal}>
              <Calendar className="h-4 w-4 mr-2" /> Set Dispatch Date
            </Button>
          )}
          {challan.status === 'Approved' && (
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
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Dispatch Info</CardTitle>
              {(challan.status === 'Approved' || challan.status === 'Dispatched') && (
                <Button variant="ghost" size="sm" onClick={openDispatchModal} className="h-8 px-2">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="font-medium">Transport:</span> {challan.transport || 'Not specified'}
              </div>
              {challan.transportName && (
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Transport Name:</span> {challan.transportName}
                </div>
              )}
              {challan.vehicleNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium">Vehicle No:</span> {challan.vehicleNumber}
                </div>
              )}
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

      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Dispatch Information</DialogTitle>
            <DialogDescription>
              Enter the manual dispatch date and vehicle/transport info for this challan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dispatch-date">Dispatch Date</Label>
              <Input
                id="dispatch-date"
                type="date"
                value={dispatchDateInput}
                onChange={(e) => setDispatchDateInput(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transport-name">Transport Name / Company</Label>
              <Input
                id="transport-name"
                placeholder="e.g. Bluedart, VRL Logistics, Customer Pickup..."
                value={transportNameInput}
                onChange={(e) => setTransportNameInput(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="vehicle-number">Vehicle Number</Label>
              <Input
                id="vehicle-number"
                placeholder="e.g. DL 01 AB 1234"
                value={vehicleNumberInput}
                onChange={(e) => setVehicleNumberInput(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dispatch-transport">Mode of Transport / Notes</Label>
              <Input
                id="dispatch-transport"
                placeholder="e.g. Tata Ace, Road, Special instructions..."
                value={transportInput}
                onChange={(e) => setTransportInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => handleSaveDispatchInfo(false)}
              disabled={updateDispatchInfo.isPending}
            >
              Save Dispatch Info
            </Button>
            {challan.status === 'Approved' && (
              <Button
                onClick={() => handleSaveDispatchInfo(true)}
                disabled={updateDispatchInfo.isPending}
              >
                <Send className="h-4 w-4 mr-2" /> Save & Mark Dispatched
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

