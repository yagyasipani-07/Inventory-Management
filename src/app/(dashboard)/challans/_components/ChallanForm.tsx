'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Textarea } from '@/src/components/ui/textarea';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSkeleton } from '@/components/shared/loading-skeleton';

import { useCustomers } from '../../customers/_hooks/useCustomers';
import { useProducts } from '../../inventory/_hooks/useProducts';
import { useCreateChallan, useUpdateChallan } from '../_hooks/useChallans';
import { Customer } from '../../customers/_services/customerService';
import { ChallanItem, ChallanFormData, Challan } from '../_services/challanService';

import { CustomerSelector } from './CustomerSelector';
import { ProductSelector } from './ProductSelector';
import { ReviewStep } from './ReviewStep';

interface ChallanFormProps {
  initialData?: Challan;
  isEdit?: boolean;
}

export function ChallanForm({ initialData, isEdit }: ChallanFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Data fetching
  const { data: customers = [], isLoading: loadingCustomers } = useCustomers();
  const { data: products = [], isLoading: loadingProducts } = useProducts();
  
  // Mutations
  const createChallan = useCreateChallan();
  const updateChallan = useUpdateChallan();

  // Form State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [items, setItems] = useState<ChallanItem[]>(initialData?.items || []);
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [transport, setTransport] = useState(initialData?.transport || '');

  // Initialize selected customer if editing
  useEffect(() => {
    if (initialData && customers.length > 0 && !selectedCustomer) {
      const cust = customers.find(c => c.id === initialData.customerId);
      if (cust) setSelectedCustomer(cust);
    }
  }, [initialData, customers, selectedCustomer]);

  const isLoading = loadingCustomers || loadingProducts;

  const handleNext = () => {
    if (step === 1 && !selectedCustomer) {
      toast.error('Please select a customer first');
      return;
    }
    if (step === 2 && items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => Math.max(1, s - 1));
  };

  const onSubmit = async () => {
    if (!selectedCustomer) return;
    
    const formData: ChallanFormData = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      city: selectedCustomer.city,
      transport,
      items,
      notes
    };

    try {
      if (isEdit && initialData) {
        await updateChallan.mutateAsync({ id: initialData.id, data: formData });
      } else {
        await createChallan.mutateAsync(formData);
      }
      router.push('/challans');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center space-x-2">
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
          <span className={`font-medium ${step >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>Customer</span>
          <div className="w-8 h-[2px] bg-muted mx-2" />
          
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
          <span className={`font-medium ${step >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>Products</span>
          <div className="w-8 h-[2px] bg-muted mx-2" />
          
          <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div>
          <span className={`font-medium ${step >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>Review</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Customer</h3>
            <CustomerSelector 
              customers={customers} 
              selectedCustomerId={selectedCustomer?.id || null} 
              onSelect={setSelectedCustomer} 
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add Products</h3>
            <ProductSelector 
              products={products}
              selectedItems={items}
              onChange={setItems}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Review & Confirm</h3>
            <ReviewStep 
              customer={selectedCustomer}
              items={items}
              notes={notes}
              transport={transport}
            />
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="transport">Mode of Transport / Vehicle Info</Label>
                  <Input
                    id="transport"
                    placeholder="e.g. By Road - Tata Ace DL01AB1234, Customer Pickup..."
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes"
                    placeholder="Enter any special instructions or remarks..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {step < 3 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={onSubmit} 
            disabled={createChallan.isPending || updateChallan.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {isEdit ? 'Update Challan' : 'Create Challan'}
          </Button>
        )}
      </div>
    </div>
  );
}
