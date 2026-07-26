import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../_services/inventoryService';

export function useProductMovements(productId: string) {
  return useQuery({
    queryKey: ['product-movements', productId],
    queryFn: () => inventoryService.getProductMovements(productId),
    enabled: !!productId,
  });
}
