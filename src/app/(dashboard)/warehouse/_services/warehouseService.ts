import { Product, inventoryService } from '../../inventory/_services/inventoryService';
import { WarehouseService as RealWarehouseService } from '@/features/warehouse/service';
import { createBrowserClient } from '@/lib/supabase/browser';
import * as xlsx from 'xlsx';

export interface WarehouseItem extends Product {
  location: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  date: string;
  action: 'Increase' | 'Decrease' | 'Initial';
  quantity: number;
  user: string;
  reason: string;
}

export interface WarehouseSummary {
  totalProducts: number;
  availableUnits: number;
  lowStockItems: number;
  outOfStockItems: number;
}

const getService = () => new RealWarehouseService(createBrowserClient());

export const warehouseService = {
  async getWarehouseStock(): Promise<WarehouseItem[]> {
    const service = getService();
    const { data } = await service.getStock({});
    
    // Fallback: If we have no warehouse data configured yet, just return inventory
    if (data.length === 0) {
      const products = await inventoryService.getProducts();
      return products.map((p) => ({
        ...p,
        location: 'Main Warehouse',
      }));
    }

    return data.map((item: any) => ({
      id: item.products.id,
      code: item.products.product_code || 'N/A',
      name: item.products.product_name,
      photoUrl: item.products.product_image_path || '',
      thickness: item.products.thickness ? `${item.products.thickness}mm` : '18mm',
      length: item.products.length ? item.products.length.toString() : '8',
      width: item.products.width ? item.products.width.toString() : '4',
      size: (item.products.length && item.products.width) ? `${item.products.length}x${item.products.width}` : '8x4',
      currentStock: item.current_quantity,
      reservedStock: item.reserved_quantity,
      availableStock: item.current_quantity - item.reserved_quantity,
      unit: item.products.unit || 'Pieces',
      openingStock: 0,
      minStock: item.reorder_level || 100,
      description: item.products.description || '',
      lastUpdated: item.updated_at || new Date().toISOString(),
      location: item.warehouses.warehouse_name || 'Main Warehouse',
    }));
  },

  async getWarehouseSummary(): Promise<WarehouseSummary> {
    const stock = await this.getWarehouseStock();
    return stock.reduce(
      (acc, item) => {
        acc.totalProducts += 1;
        acc.availableUnits += item.availableStock;
        if (item.availableStock === 0) {
          acc.outOfStockItems += 1;
        } else if (item.availableStock < item.minStock) {
          acc.lowStockItems += 1;
        }
        return acc;
      },
      {
        totalProducts: 0,
        availableUnits: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
      }
    );
  },

  async exportWarehouse(items: WarehouseItem[]): Promise<void> {
    const data = items.map((item) => ({
      Code: item.code,
      Name: item.name,
      Dimensions: item.size,
      Thickness: item.thickness,
      'Current Stock': item.currentStock,
      'Available Stock': item.availableStock,
      'Minimum Stock': item.minStock,
      'Location': item.location,
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString(),
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Warehouse Stock');

    const dateStr = new Date().toISOString().split('T')[0];
    xlsx.writeFile(workbook, `warehouse-stock-${dateStr}.xlsx`);
  },

  async getStockMovement(productId: string): Promise<StockMovement[]> {
    // Phase 4 will implement real stock movements via DB
    return [];
  },
};
