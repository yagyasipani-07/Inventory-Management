import { InventoryService } from '@/features/inventory/service';
import { createBrowserClient } from '@/lib/supabase/browser';
import { Product as DBProduct } from '@/features/inventory/types';

export type Product = ReturnType<typeof mapToUiProduct>;

// Map database product to the UI product structure expected by components
function mapToUiProduct(
  dbProduct: DBProduct,
  stockInfo?: { current: number; reserved: number; min: number }
) {
  const current = stockInfo?.current || 0;
  const reserved = stockInfo?.reserved || 0;
  const available = Math.max(0, current - reserved);
  const min = stockInfo?.min || 100;

  return {
    id: dbProduct.id,
    code: dbProduct.product_code || 'N/A',
    name: dbProduct.product_name || 'Plywood',
    photoUrl: dbProduct.product_image_path || '',
    thickness: dbProduct.thickness ? `${dbProduct.thickness}mm` : '18mm',
    length: dbProduct.length ? dbProduct.length.toString() : '8',
    width: dbProduct.width ? dbProduct.width.toString() : '4',
    size: (dbProduct.length && dbProduct.width) ? `${dbProduct.length}x${dbProduct.width}` : '8x4',
    currentStock: current,
    reservedStock: reserved,
    availableStock: available,
    unit: dbProduct.unit || 'Pieces',
    openingStock: current,
    minStock: min,
    description: dbProduct.description || '',
    lastUpdated: dbProduct.updated_at || new Date().toISOString(),
  };
}

// Create a singleton service instance using the browser client
const getService = () => new InventoryService(createBrowserClient());

export const inventoryService = {
  async getProducts() {
    const service = getService();
    const { data } = await service.getProducts({});
    const productIds = data.map((p) => p.id);
    const stockMap = await service.getProductStocks(productIds);
    return data.map((p) => mapToUiProduct(p, stockMap[p.id]));
  },

  async getProductById(id: string) {
    const service = getService();
    const product = await service.getProduct(id);
    if (!product) return undefined;
    const stockMap = await service.getProductStocks([id]);
    return mapToUiProduct(product, stockMap[id]);
  },

  async createProduct(data: any) {
    const service = getService();
    const product = await service.createProduct({
      product_code: data.code,
      product_name: data.name,
      product_image_path: data.photoUrl,
      thickness: parseFloat(data.thickness) || null,
      length: parseFloat(data.length) || null,
      width: parseFloat(data.width) || null,
      active_status: true,
      description: data.description || null,
      brand: data.brand || null,
      category: data.category || null,
      unit: data.unit || 'Pieces'
    });
    const initialQty = Number(data.openingStock) || 0;
    if (initialQty > 0) {
      await service.adjustStock(product.id, 'increase', initialQty, 'Initial opening stock');
    }
    const minStock = Number(data.minStock);
    if (!isNaN(minStock)) {
      await service.updateReorderLevel(product.id, minStock);
    }
    const stockMap = await service.getProductStocks([product.id]);
    return mapToUiProduct(product, stockMap[product.id]);
  },

  async updateProduct(id: string, data: any) {
    const service = getService();
    const existingStocks = await service.getProductStocks([id]);
    const currentQty = existingStocks[id]?.current || 0;

    const product = await service.updateProduct(id, {
      product_code: data.code,
      product_name: data.name,
      product_image_path: data.photoUrl,
      description: data.description,
      thickness: data.thickness !== undefined ? parseFloat(String(data.thickness)) || null : undefined,
      length: data.length !== undefined ? parseFloat(String(data.length)) || null : undefined,
      width: data.width !== undefined ? parseFloat(String(data.width)) || null : undefined,
      unit: data.unit,
      brand: data.brand,
      category: data.category,
    });

    const newQty = Number(data.openingStock);
    if (!isNaN(newQty) && newQty !== currentQty && newQty >= 0) {
      const diff = newQty - currentQty;
      const type = diff > 0 ? 'increase' : 'decrease';
      await service.adjustStock(id, type, Math.abs(diff), 'Stock updated via product edit');
    }

    const minStock = Number(data.minStock);
    if (!isNaN(minStock)) {
      await service.updateReorderLevel(id, minStock);
    }

    const stockMap = await service.getProductStocks([id]);
    return mapToUiProduct(product, stockMap[id]);
  },

  async deleteProduct(id: string) {
    const service = getService();
    await service.deleteProduct(id);
  },

  async adjustStock(
    id: string,
    type: 'increase' | 'decrease',
    amount: number,
    reason: string,
    purchaseBillNumber?: string
  ) {
    const service = getService();
    await service.adjustStock(id, type, amount, reason, purchaseBillNumber);
    const product = await service.getProduct(id);
    const stockMap = await service.getProductStocks([id]);
    return mapToUiProduct(product, stockMap[id]);
  },

  async getProductMovements(id: string) {
    const service = getService();
    return service.getProductMovements(id);
  },
};
