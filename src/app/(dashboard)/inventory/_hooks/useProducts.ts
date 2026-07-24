import { useQuery } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: inventoryService.getProducts,
  });
}
