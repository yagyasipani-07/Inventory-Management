import { useQuery } from '@tanstack/react-query';
import { warehouseService } from '../_services/warehouseService';

export function useWarehouseStock() {
  return useQuery({
    queryKey: ['warehouseStock'],
    queryFn: () => warehouseService.getWarehouseStock(),
  });
}

export function useWarehouseSummary() {
  return useQuery({
    queryKey: ['warehouseSummary'],
    queryFn: () => warehouseService.getWarehouseSummary(),
  });
}

export function useStockMovement(productId: string) {
  return useQuery({
    queryKey: ['stockMovement', productId],
    queryFn: () => warehouseService.getStockMovement(productId),
    enabled: !!productId,
  });
}
