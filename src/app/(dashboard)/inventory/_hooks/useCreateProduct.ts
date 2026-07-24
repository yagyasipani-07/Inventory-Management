import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof inventoryService.createProduct>[0]) =>
      inventoryService.createProduct(data),
    onSuccess: (newProduct) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Optionally update cache directly for immediate feedback
      queryClient.setQueryData<Product[]>(['products'], (oldData) => {
        return oldData ? [newProduct, ...oldData] : [newProduct];
      });
    },
  });
}
