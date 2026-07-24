import { Product, inventoryService } from '../../inventory/_services/inventoryService';
import * as xlsx from 'xlsx';

export interface WarehouseItem extends Product {
  location: string; // e.g., 'A-02-B'
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
  reservedUnits: number;
  lowStockItems: number;
  outOfStockItems: number;
}

const mockLocations = ['A-01-A', 'A-01-B', 'B-02-C', 'C-03-A', 'D-01-D'];

// Function to generate a stable mock location based on ID
const getMockLocation = (id: string) => {
  const num = parseInt(id, 10) || id.charCodeAt(0);
  return mockLocations[num % mockLocations.length];
};

export const warehouseService = {
  async getWarehouseStock(): Promise<WarehouseItem[]> {
    const products = await inventoryService.getProducts();
    return products.map((p) => ({
      ...p,
      location: getMockLocation(p.id),
    }));
  },

  async getWarehouseSummary(): Promise<WarehouseSummary> {
    const stock = await this.getWarehouseStock();
    return stock.reduce(
      (acc, item) => {
        acc.totalProducts += 1;
        acc.availableUnits += item.availableStock;
        acc.reservedUnits += item.reservedStock;
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
        reservedUnits: 0,
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
      Location: item.location,
      'Current Stock': item.currentStock,
      'Reserved Stock': item.reservedStock,
      'Available Stock': item.availableStock,
      'Minimum Stock': item.minStock,
      Status:
        item.availableStock === 0
          ? 'Out of Stock'
          : item.availableStock < item.minStock
          ? 'Critical'
          : item.availableStock === item.minStock
          ? 'Warning'
          : 'Healthy',
      'Last Updated': new Date(item.lastUpdated).toLocaleDateString(),
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Warehouse Stock');

    const dateStr = new Date().toISOString().split('T')[0];
    xlsx.writeFile(workbook, `warehouse-stock-${dateStr}.xlsx`);
  },

  async getStockMovement(productId: string): Promise<StockMovement[]> {
    // Return mock historical movement
    return [
      {
        id: 'mv-1',
        productId,
        date: new Date().toISOString(),
        action: 'Initial',
        quantity: 100,
        user: 'System',
        reason: 'Initial Upload',
      },
      {
        id: 'mv-2',
        productId,
        date: new Date().toISOString(),
        action: 'Increase',
        quantity: 50,
        user: 'Admin',
        reason: 'Restock shipment',
      },
    ];
  },
};
