import { Customer } from '../../customers/_services/customerService';
import { ChallanItem } from '../_services/challanService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { MapPin, Truck, Calendar, User, Package } from 'lucide-react';

interface ReviewStepProps {
  customer: Customer | null;
  items: ChallanItem[];
  notes: string;
}

export function ReviewStep({ customer, items, notes }: ReviewStepProps) {
  if (!customer) return null;

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const amount = Number(item.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" /> Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="font-semibold text-lg">{customer.name}</div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {customer.city}
              </span>
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Transport: {customer.preferredTransport}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dispatch Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" /> Dispatch Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Products</span>
              <span className="font-medium">{items.length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Quantity</span>
              <span className="font-medium">{totalQty}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Estimated Amount</span>
              <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Product Details</CardTitle>
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
              {items.map((item, index) => (
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
              <TableRow className="bg-muted/50 hover:bg-muted/50 font-semibold">
                <TableCell colSpan={2} className="text-right">Total:</TableCell>
                <TableCell className="text-right">{totalQty}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">₹{totalAmount.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Notes / Remarks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
