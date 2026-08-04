import { useQuery } from '@tanstack/react-query';
import { inventoryService, Product } from '../_services/inventoryService';

export function useProducts(params?: { search?: string; category?: string; brand?: string; purchase_bill_number?: string; page?: number; limit?: number }) {
  return useQuery<Product[]>({
    queryKey: ['products', params],
    queryFn: () => inventoryService.getProducts(params),
  });
}
