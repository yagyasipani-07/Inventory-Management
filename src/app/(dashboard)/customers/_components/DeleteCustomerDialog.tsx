import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/ui/alert-dialog';
import { useDeleteCustomer } from '../_hooks/useCustomers';

interface DeleteCustomerDialogProps {
  customerId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteCustomerDialog({
  customerId,
  isOpen,
  onOpenChange,
  onSuccess,
}: DeleteCustomerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCustomer = useDeleteCustomer();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteCustomer.mutateAsync(customerId);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this customer? Deleting a customer may affect historical challans and dispatch records.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
