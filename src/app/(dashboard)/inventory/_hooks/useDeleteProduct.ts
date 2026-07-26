import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
      queryClient.invalidateQueries({ queryKey: ['recentActivity'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryTrend'] });
      
      queryClient.setQueryData<Product[]>(['products'], (oldData) => {
        return oldData?.filter((p) => p.id !== deletedId);
      });
      queryClient.removeQueries({ queryKey: ['product', deletedId] });
    },
  });
}
