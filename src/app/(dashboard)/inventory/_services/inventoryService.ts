import { apiClient, endpoints } from '@/src/lib/api';

export interface Product {
  id: string;
  code: string;
  name: string;
  photoUrl?: string;
  thickness: string;
  length: string;
  width: string;
  size: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  unit: string;
  openingStock: number;
  minStock: number;
  description?: string;
  lastUpdated: string;
}

// Helper to map DB product to UI product
function mapToUiProduct(dbProduct: any): Product {
  const parts = dbProduct.productCode ? dbProduct.productCode.split('-') : [];
  return {
    id: dbProduct.id,
    code: dbProduct.productCode || 'N/A',
    name: dbProduct.mould || 'Plywood',
    photoUrl: dbProduct.photoUrl || '',
    thickness: parts[1] ? `${parts[1]}mm` : '18mm',
    length: parts[2]?.[0] || '8',
    width: parts[2]?.[1] || '4',
    size: parts[2] && parts[2].length >= 2 ? `${parts[2][0]}x${parts[2][1]}` : '8x4',
    currentStock: dbProduct.currentStock || 0,
    reservedStock: dbProduct.reservedStock || 0,
    availableStock: Math.max(0, (dbProduct.currentStock || 0) - (dbProduct.reservedStock || 0)),
    unit: 'Pieces',
    openingStock: dbProduct.productQty || 0,
    minStock: dbProduct.lowStockThreshold || 100,
    description: `Pack Type: ${dbProduct.packType || 'Standard'}`,
    lastUpdated: dbProduct.createdAt || new Date().toISOString(),
  };
}

export const inventoryService = {
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get(endpoints.products.list);
    return response.data.map(mapToUiProduct);
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const response = await apiClient.get(endpoints.products.list);
    const product = response.data.find((p: any) => p.id === id);
    return product ? mapToUiProduct(product) : undefined;
  },

  async createProduct(
    data: Omit<Product, 'id' | 'size' | 'availableStock' | 'lastUpdated' | 'reservedStock' | 'currentStock'>
  ): Promise<Product> {
    const payload = {
      productCode: data.code,
      mould: data.name,
      photoUrl: data.photoUrl,
      productQty: data.openingStock,
      lowStockThreshold: data.minStock,
    };
    const response = await apiClient.post(endpoints.products.list, payload);
    return mapToUiProduct(response.data);
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    // The POST endpoint acts as upsert based on productCode
    if (!data.code) {
      throw new Error('Product code is required to update');
    }
    const payload = {
      productCode: data.code,
      mould: data.name,
      photoUrl: data.photoUrl,
      productQty: data.openingStock,
      lowStockThreshold: data.minStock,
    };
    const response = await apiClient.post(endpoints.products.list, payload);
    return mapToUiProduct(response.data);
  },

  async deleteProduct(id: string): Promise<void> {
    // Delete is not implemented in the current backend route, this is a placeholder
    console.warn(`Delete product ${id} called, but not supported by backend yet`);
  },

  async adjustStock(id: string, type: 'increase' | 'decrease', amount: number, reason: string): Promise<Product> {
    // Get product to find its code first
    const products = await this.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) throw new Error('Product not found');

    const adjAmount = type === 'increase' ? amount : -amount;
    const payload = {
      productCode: product.code,
      adjustment: adjAmount,
      reason,
    };
    const response = await apiClient.post(endpoints.products.list, payload);
    return mapToUiProduct(response.data);
  },
};
