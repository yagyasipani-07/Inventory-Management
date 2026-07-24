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
import { useDeleteChallan } from '../_hooks/useChallans';

interface DeleteChallanDialogProps {
  challanId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteChallanDialog({
  challanId,
  isOpen,
  onOpenChange,
  onSuccess,
}: DeleteChallanDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteChallan = useDeleteChallan();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteChallan.mutateAsync(challanId);
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
          <AlertDialogTitle>Delete Challan?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this challan? This action cannot be undone.
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
