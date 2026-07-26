import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { useAdjustStock } from '../_hooks/useAdjustStock';
import { toast } from 'sonner';

const adjustStockSchema = z.object({
  type: z.enum(['increase', 'decrease']),
  amount: z.coerce.number().min(1, 'Amount must be at least 1'),
  reason: z.string().min(3, 'Reason is required'),
  purchaseBillNumber: z.string().optional(),
});

type AdjustStockFormValues = z.infer<typeof adjustStockSchema>;

interface StockAdjustmentDialogProps {
  productId: string | null;
  productName: string;
  currentStock: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockAdjustmentDialog({
  productId,
  productName,
  currentStock,
  isOpen,
  onOpenChange,
}: StockAdjustmentDialogProps) {
  const adjustStock = useAdjustStock();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockSchema),
    defaultValues: {
      type: 'increase',
      amount: 1,
      reason: '',
      purchaseBillNumber: '',
    },
  });

  const adjustmentType = form.watch('type');
  const amount = form.watch('amount') || 0;

  const newStock =
    adjustmentType === 'increase'
      ? currentStock + amount
      : currentStock - amount;

  const onSubmit = async (data: AdjustStockFormValues) => {
    if (!productId) return;
    
    setIsSubmitting(true);
    try {
      await adjustStock.mutateAsync({
        id: productId,
        type: data.type,
        amount: data.amount,
        reason: data.reason,
        purchaseBillNumber: data.purchaseBillNumber || undefined,
      });
      toast.success('Stock adjusted successfully');
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to adjust stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) form.reset();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Manually adjust stock for {productName}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="increase">Increase (+)</SelectItem>
                      <SelectItem value="decrease">Decrease (-)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="purchaseBillNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Bill Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. INV-100234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason / Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g. Audit correction, Damaged goods" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Preview</p>
                <div className="flex items-center gap-2 mt-1 font-medium">
                  <span>{currentStock}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className={newStock < 0 ? 'text-destructive' : ''}>
                    {newStock}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Adjustment'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
