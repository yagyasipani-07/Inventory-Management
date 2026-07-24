import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  code: string;
  name: string;
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

// Initial mock data
let mockProducts: Product[] = [
  {
    id: '1',
    code: 'MR-18-84',
    name: 'MR Grade Plywood',
    thickness: '18mm',
    length: '8',
    width: '4',
    size: '8x4',
    currentStock: 450,
    reservedStock: 50,
    availableStock: 400,
    unit: 'Pieces',
    openingStock: 500,
    minStock: 100,
    description: 'Moisture Resistant Plywood for interior use.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'BWR-12-84',
    name: 'BWR Grade Plywood',
    thickness: '12mm',
    length: '8',
    width: '4',
    size: '8x4',
    currentStock: 85,
    reservedStock: 10,
    availableStock: 75,
    unit: 'Pieces',
    openingStock: 200,
    minStock: 100,
    description: 'Boiling Water Resistant Plywood.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    code: 'BWP-19-84',
    name: 'BWP Marine Grade Plywood',
    thickness: '19mm',
    length: '8',
    width: '4',
    size: '8x4',
    currentStock: 25,
    reservedStock: 5,
    availableStock: 20,
    unit: 'Pieces',
    openingStock: 150,
    minStock: 50,
    description: 'Boiling Water Proof Marine Plywood.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    code: 'FLUSH-30-84',
    name: 'Flush Door',
    thickness: '30mm',
    length: '8',
    width: '4',
    size: '8x4',
    currentStock: 120,
    reservedStock: 20,
    availableStock: 100,
    unit: 'Pieces',
    openingStock: 150,
    minStock: 50,
    description: 'Solid core flush door.',
    lastUpdated: new Date().toISOString(),
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const inventoryService = {
  async getProducts(): Promise<Product[]> {
    await delay(600);
    return [...mockProducts];
  },

  async getProductById(id: string): Promise<Product | undefined> {
    await delay(300);
    return mockProducts.find((p) => p.id === id);
  },

  async createProduct(
    data: Omit<Product, 'id' | 'size' | 'availableStock' | 'lastUpdated' | 'reservedStock' | 'currentStock'>
  ): Promise<Product> {
    await delay(800);
    
    const newProduct: Product = {
      ...data,
      id: uuidv4(),
      size: `${data.length}x${data.width}`,
      currentStock: data.openingStock,
      reservedStock: 0,
      availableStock: data.openingStock,
      lastUpdated: new Date().toISOString(),
    };

    mockProducts = [newProduct, ...mockProducts];
    return newProduct;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    await delay(800);
    
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const product = mockProducts[index];
    const updatedProduct = {
      ...product,
      ...data,
      size: data.length && data.width ? `${data.length}x${data.width}` : product.size,
      lastUpdated: new Date().toISOString(),
    };
    
    // Recalculate available stock if current or reserved changed
    updatedProduct.availableStock = updatedProduct.currentStock - updatedProduct.reservedStock;

    mockProducts[index] = updatedProduct;
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    await delay(600);
    mockProducts = mockProducts.filter((p) => p.id !== id);
  },

  async adjustStock(id: string, type: 'increase' | 'decrease', amount: number, reason: string): Promise<Product> {
    await delay(800);
    
    const index = mockProducts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const product = mockProducts[index];
    let newCurrentStock = product.currentStock;

    if (type === 'increase') {
      newCurrentStock += amount;
    } else {
      if (product.currentStock - amount < product.reservedStock) {
        throw new Error('Cannot decrease stock below reserved amount');
      }
      newCurrentStock -= amount;
    }

    const updatedProduct = {
      ...product,
      currentStock: newCurrentStock,
      availableStock: newCurrentStock - product.reservedStock,
      lastUpdated: new Date().toISOString(),
    };

    mockProducts[index] = updatedProduct;
    return updatedProduct;
  },
};
