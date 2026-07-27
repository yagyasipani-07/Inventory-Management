import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

interface AdjustStockParams {
  id: string;
  type: 'increase' | 'decrease';
  amount: number;
  reason: string;
  purchaseBillNumber?: string;
}

export function useAdjustStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, type, amount, reason, purchaseBillNumber }: AdjustStockParams) =>
      inventoryService.adjustStock(id, type, amount, reason, purchaseBillNumber),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] });
      queryClient.invalidateQueries({ queryKey: ['warehouseStock'] });
      queryClient.invalidateQueries({ queryKey: ['warehouseSummary'] });
      queryClient.invalidateQueries({ queryKey: ['product-movements', updatedProduct.id] });
      queryClient.invalidateQueries({ queryKey: ['stockMovement', updatedProduct.id] });
      
      queryClient.setQueryData<Product[]>(['products'], (oldData) => {
        return oldData?.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      });
      queryClient.setQueryData<Product>(['product', updatedProduct.id], updatedProduct);
    },
  });
}
