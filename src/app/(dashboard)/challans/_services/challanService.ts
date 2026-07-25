import { v4 as uuidv4 } from 'uuid';
import { apiClient, endpoints } from '@/src/lib/api';

export type ChallanStatus = 'Draft' | 'Approved' | 'Ready' | 'Dispatched' | 'Cancelled';

export interface ChallanItem {
  id: string;
  productId: string;
  productName: string;
  thickness: string;
  size: string;
  quantity: number;
  rate?: number | string;
  amount?: number | string;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  customerName: string;
  city: string;
  transport: string;
  status: ChallanStatus;
  dispatchDate: string | null;
  items: ChallanItem[];
  totalQuantity: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type ChallanFormData = Omit<Challan, 'id' | 'challanNumber' | 'status' | 'createdBy' | 'createdAt' | 'updatedAt' | 'totalQuantity' | 'dispatchDate'>;

function mapToUiStatus(dbStatus: string): ChallanStatus {
  switch (dbStatus) {
    case 'DRAFT': return 'Draft';
    case 'APPROVED': return 'Approved';
    case 'DISPATCHED': return 'Dispatched';
    case 'CANCELLED': return 'Cancelled';
    default: return 'Draft';
  }
}

function mapToDbStatus(uiStatus: ChallanStatus): string {
  switch (uiStatus) {
    case 'Draft': return 'DRAFT';
    case 'Approved': return 'APPROVED';
    case 'Dispatched': return 'DISPATCHED';
    case 'Cancelled': return 'CANCELLED';
    default: return 'DRAFT';
  }
}

function mapToUiChallan(dbChallan: any): Challan {
  return {
    id: dbChallan.id,
    challanNumber: dbChallan.challanNumber,
    customerId: dbChallan.customerId,
    customerName: dbChallan.customer?.name || 'Unknown',
    city: dbChallan.customer?.city || '',
    transport: dbChallan.transport || '',
    status: mapToUiStatus(dbChallan.status),
    dispatchDate: dbChallan.dispatchedAt,
    items: dbChallan.lineItems?.map((li: any) => ({
      id: li.id,
      productId: li.productId,
      productName: li.product?.mould || 'Product',
      thickness: li.product?.productCode && li.product.productCode.includes('-') ? `${li.product.productCode.split('-')[1]}mm` : 'N/A',
      size: li.product?.productCode && li.product.productCode.split('-').length >= 3 
        ? `${li.product.productCode.split('-')[2][0]}x${li.product.productCode.split('-')[2][1]}` 
        : 'N/A',
      quantity: li.qty,
      rate: li.rate || '',
      amount: li.amount || '',
    })) || [],
    totalQuantity: dbChallan.totalQty || 0,
    notes: dbChallan.terms || '',
    createdBy: dbChallan.createdBy?.name || 'Admin',
    createdAt: dbChallan.createdAt,
    updatedAt: dbChallan.createdAt, // Backend missing updatedAt
  };
}

export const challanService = {
  getChallans: async (): Promise<Challan[]> => {
    const response = await apiClient.get(endpoints.challans.list);
    return response.data.map(mapToUiChallan);
  },

  getChallan: async (id: string): Promise<Challan | undefined> => {
    try {
      const response = await apiClient.get(endpoints.challans.detail(id));
      return mapToUiChallan(response.data);
    } catch (error: any) {
      if (error.status === 404) return undefined;
      throw error;
    }
  },

  createChallan: async (data: ChallanFormData): Promise<Challan> => {
    const payload = {
      challanNumber: `CH-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customerId: data.customerId,
      transport: data.transport,
      terms: data.notes,
      lineItems: data.items.map(i => ({
        productId: i.productId,
        qty: Number(i.quantity),
        rate: Number(i.rate) || undefined,
        amount: Number(i.amount) || undefined,
      }))
    };
    
    const response = await apiClient.post(endpoints.challans.list, payload);
    return mapToUiChallan(response.data);
  },

  updateChallan: async (id: string, data: ChallanFormData): Promise<Challan> => {
    // Current backend doesn't support updating line items or general details yet
    console.warn(`Full update for challan ${id} not supported, only status patch available.`);
    const c = await challanService.getChallan(id);
    if (!c) throw new Error('Not found');
    return c;
  },

  updateStatus: async (id: string, status: ChallanStatus): Promise<Challan> => {
    const payload = { status: mapToDbStatus(status) };
    const response = await apiClient.patch(endpoints.challans.detail(id), payload);
    return mapToUiChallan(response.data);
  },

  deleteChallan: async (id: string): Promise<void> => {
    console.warn(`Delete challan ${id} not supported by backend.`);
  },
  
  duplicateChallan: async (id: string): Promise<Challan> => {
    const existing = await challanService.getChallan(id);
    if (!existing) throw new Error('Challan not found');
    
    // Create new with same data
    const { id: _id, challanNumber, status, dispatchDate, createdAt, updatedAt, createdBy, totalQuantity, ...formData } = existing;
    return challanService.createChallan(formData);
  }
};
