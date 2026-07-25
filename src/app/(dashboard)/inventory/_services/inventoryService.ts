import { InventoryService } from '@/features/inventory/service';
import { createBrowserClient } from '@/lib/supabase/browser';
import { Product as DBProduct } from '@/features/inventory/types';

export type Product = ReturnType<typeof mapToUiProduct>;

// Map database product to the UI product structure expected by components
function mapToUiProduct(dbProduct: DBProduct) {
  return {
    id: dbProduct.id,
    code: dbProduct.product_code || 'N/A',
    name: dbProduct.product_name || 'Plywood',
    photoUrl: dbProduct.product_image_path || '',
    thickness: dbProduct.thickness ? `${dbProduct.thickness}mm` : '18mm',
    length: dbProduct.length ? dbProduct.length.toString() : '8',
    width: dbProduct.width ? dbProduct.width.toString() : '4',
    size: (dbProduct.length && dbProduct.width) ? `${dbProduct.length}x${dbProduct.width}` : '8x4',
    currentStock: 0, // Should be fetched from warehouse_stock
    reservedStock: 0,
    availableStock: 0,
    unit: dbProduct.unit || 'Pieces',
    openingStock: 0,
    minStock: 100,
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
    return data.map(mapToUiProduct);
  },

  async getProductById(id: string) {
    const service = getService();
    const product = await service.getProduct(id);
    return product ? mapToUiProduct(product) : undefined;
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
    return mapToUiProduct(product);
  },

  async updateProduct(id: string, data: any) {
    const service = getService();
    const product = await service.updateProduct(id, {
      product_code: data.code,
      product_name: data.name,
      product_image_path: data.photoUrl,
      description: data.description,
    });
    return mapToUiProduct(product);
  },

  async deleteProduct(id: string) {
    const service = getService();
    await service.deleteProduct(id);
  },

  async adjustStock(id: string, type: 'increase' | 'decrease', amount: number, reason: string) {
    // Stock adjustment should be handled via the Warehouse service
    // For now, this is a stub as per Phase 3 rules (Workflows are in Phase 4)
    console.warn("Stock adjustment moved to Warehouse Service workflows.");
    return {} as any;
  },
};
