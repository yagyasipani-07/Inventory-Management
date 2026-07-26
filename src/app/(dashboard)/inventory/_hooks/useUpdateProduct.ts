import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      inventoryService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', updatedProduct.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTrend'] });
      
      queryClient.setQueryData<Product[]>(['products'], (oldData) => {
        return oldData?.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      });
      queryClient.setQueryData<Product>(['product', updatedProduct.id], updatedProduct);
    },
  });
}
