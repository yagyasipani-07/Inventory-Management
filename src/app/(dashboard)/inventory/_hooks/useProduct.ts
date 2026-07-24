import { useQuery } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

export function useProduct(id: string) {
  return useQuery<Product | undefined>({
    queryKey: ['product', id],
    queryFn: () => inventoryService.getProductById(id),
    enabled: !!id,
  });
}
